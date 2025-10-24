const express = require('express');
const router = express.Router();
const OthersContact = require('../models/OthersContact');
const adminAuth = require('../middleware/adminAuth');
const userAuth = require('../middleware/userAuth');

// Public route - Submit contact form
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, subject, message, source } = req.body;

    // Validation
    if (!name || !email || !subject || !message || !source) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, subject, message, and source are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Source validation
    const validSources = ['cookie-policy', 'faq', 'privacy-policy', 'sitemap', 'terms'];
    if (!validSources.includes(source)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid source page'
      });
    }

    const contactSubmission = new OthersContact({
      name,
      email,
      phone,
      subject,
      message,
      source
    });

    await contactSubmission.save();

    res.status(201).json({
      success: true,
      message: 'Your message has been submitted successfully. We will get back to you soon!',
      data: {
        id: contactSubmission._id,
        submittedAt: contactSubmission.createdAt
      }
    });

  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
});

// Admin routes - protected
router.use(adminAuth); // All routes below require admin authentication

// Get all contact submissions with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.source) filter.source = req.query.source;
    if (req.query.priority) filter.priority = req.query.priority;
    
    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex }
      ];
    }

    // Sort by creation date (newest first) unless specified
    const sortOrder = req.query.sort === 'asc' ? 1 : -1;

    const contacts = await OthersContact.find(filter)
      .populate('respondedBy', 'name email')
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit);

    const total = await OthersContact.countDocuments(filter);

    // Get status counts for dashboard
    const statusCounts = await OthersContact.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const sourceStats = await OthersContact.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        },
        stats: {
          statusCounts: statusCounts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          sourceStats: sourceStats.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        }
      }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact submissions'
    });
  }
});

// Get single contact submission
router.get('/:id', async (req, res) => {
  try {
    const contact = await OthersContact.findById(req.params.id)
      .populate('respondedBy', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact submission'
    });
  }
});

// Update contact submission (status, priority, admin response)
router.put('/:id', async (req, res) => {
  try {
    const { status, priority, adminResponse } = req.body;
    const updateData = {};

    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    
    // Get the original contact before updating for email purposes
    const originalContact = await OthersContact.findById(req.params.id);
    if (!originalContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }
    
    if (adminResponse) {
      updateData.adminResponse = adminResponse;
      
      // Try to find user by admin email, if not found, store email directly
      const User = require('../models/User');
      const adminUser = await User.findOne({ email: req.admin.email });
      
      if (adminUser) {
        updateData.respondedBy = adminUser._id;
      } else {
        // Store admin email in a separate field since no User document exists
        updateData.respondedByEmail = req.admin.email;
      }
      
      updateData.respondedAt = new Date();
    }

    const contact = await OthersContact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('respondedBy', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    // Send email notification if admin response was provided
    if (adminResponse) {
      try {
        const sendMail = require('../utils/mailer');
        
        const emailHtml = `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px 0;">
            <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 2px 12px #0001; padding: 32px 28px; border: 1px solid #e5e7eb;">
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; background: linear-gradient(90deg,#3b82f6,#6366f1); border-radius: 50%; padding: 16px; margin-bottom: 12px;">
                  <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <h2 style="font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0;">Response to Your Query</h2>
                <p style="color: #64748b; font-size: 1rem; margin: 8px 0 0 0;">We have responded to your query from ${originalContact.source.replace('-', ' ')} page.</p>
              </div>
              
              <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 24px 0;">
                <h3 style="color: #374151; font-size: 1.1rem; margin: 0 0 8px 0; font-weight: 600;">Your Original Query:</h3>
                <p style="color: #6b7280; font-size: 0.95rem; margin: 0 0 12px 0;"><strong>Subject:</strong> ${originalContact.subject}</p>
                <p style="color: #6b7280; font-size: 0.95rem; margin: 0; line-height: 1.5;">${originalContact.message}</p>
              </div>
              
              <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin: 24px 0; border-left: 4px solid #3b82f6;">
                <h3 style="color: #1e40af; font-size: 1.1rem; margin: 0 0 12px 0; font-weight: 600;">Our Response:</h3>
                <p style="color: #374151; font-size: 1rem; line-height: 1.6; margin: 0; white-space: pre-wrap;">${adminResponse}</p>
              </div>
              
              <div style="text-align: center; margin: 32px 0 0 0;">
                <p style="color: #64748b; font-size: 0.9rem; margin: 0;">If you have any further questions, please feel free to contact us.</p>
                <div style="margin-top: 24px; color: #94a3b8; font-size: 0.85rem;">&copy; ${new Date().getFullYear()} K-N TaxMarks Advisors</div>
              </div>
            </div>
          </div>
        `;

        await sendMail(
          originalContact.email,
          `Response to Your Query: ${originalContact.subject}`,
          `Dear ${originalContact.name},\n\nWe have responded to your query regarding "${originalContact.subject}".\n\nOur Response:\n${adminResponse}\n\nIf you have any further questions, please feel free to contact us.\n\nBest regards,\nK-N TaxMarks Advisors Team`,
          emailHtml
        );
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Continue with success response even if email fails
      }
    }

    res.json({
      success: true,
      message: 'Contact submission updated successfully' + (adminResponse ? ' and notification sent to user' : ''),
      data: contact
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact submission'
    });
  }
});

// Delete contact submission
router.delete('/:id', async (req, res) => {
  try {
    const contact = await OthersContact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact submission deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact submission'
    });
  }
});

// Bulk operations
router.patch('/bulk', async (req, res) => {
  try {
    const { ids, action, status, priority } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid contact IDs'
      });
    }

    let updateData = {};
    
    if (action === 'update-status' && status) {
      updateData.status = status;
    } else if (action === 'update-priority' && priority) {
      updateData.priority = priority;
    } else if (action === 'delete') {
      await OthersContact.deleteMany({ _id: { $in: ids } });
      return res.json({
        success: true,
        message: `${ids.length} contact submissions deleted successfully`
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid bulk action'
      });
    }

    const result = await OthersContact.updateMany(
      { _id: { $in: ids } },
      updateData
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} contact submissions updated successfully`,
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Bulk operation error:', error);
    res.status(500).json({
      success: false,
      message: 'Bulk operation failed'
    });
  }
});

module.exports = router;