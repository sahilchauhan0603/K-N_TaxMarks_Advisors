const express = require('express');
const router = express.Router();
const TaxPlanning = require('../../models/TaxPlanning');
const auth = require('../../middleware/userAuth');
const upload = require('../../middleware/upload');
const { uploadImage } = require('../../config/cloudinary');

// Personal & Corporate Tax
router.post('/tax-personal-corporate', auth, upload.single('documents'), async (req, res) => {
  try {
    const { entityType, incomeDetails, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'tax/personal-corporate');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const taxService = new TaxPlanning({
      userId: req.user._id,
      entityType,
      incomeDetails,
      notes,
      documentPath,
      documentUrl,
      planningType: 'personal_corporate',
    });
    await taxService.save();

    // Send confirmation email to user
    try {
      const sendMail = require('../../utils/mailer');
      const user = req.user;
      await sendMail(
        user.email,
        'Your Service Request Has Been Submitted',
        undefined,
        `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px 0;">
            <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 2px 12px #0001; padding: 32px 28px; border: 1px solid #e5e7eb;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0;">Your Service Request Has Been Submitted</h2>
                <p style="color: #64748b; font-size: 1rem; margin: 8px 0 0 0;">Thank you for submitting your service request. Stay tuned for further updates. We will notify you by email as your request progresses.</p>
              </div>
              <div style="margin: 32px 0; padding: 20px; background: #f1f5f9; border-radius: 12px;">
                <h3 style="color: #2563eb; margin-bottom: 12px;">User Information</h3>
                <ul style="list-style: none; padding: 0; color: #334155; font-size: 1rem;">
                  <li><strong>Name:</strong> ${user.name || 'N/A'}</li>
                  <li><strong>Email:</strong> ${user.email || 'N/A'}</li>
                </ul>
                <h3 style="color: #2563eb; margin: 20px 0 12px 0;">Service Information</h3>
                <ul style="list-style: none; padding: 0; color: #334155; font-size: 1rem;">
                  <li><strong>Service Type:</strong> Personal & Corporate Tax</li>
                  <li><strong>Entity Type:</strong> ${entityType || 'N/A'}</li>
                  <li><strong>Income Details:</strong> ${incomeDetails || 'N/A'}</li>
                  <li><strong>Notes:</strong> ${notes || 'N/A'}</li>
                  <li><strong>Submitted At:</strong> ${taxService.createdAt ? new Date(taxService.createdAt).toLocaleString('en-IN') : 'N/A'}</li>
                </ul>
              </div>
              <div style="margin-top: 32px; text-align: center; color: #94a3b8; font-size: 0.9rem;">&copy; ${new Date().getFullYear()} K-N TaxMarks Advisors</div>
            </div>
          </div>
        `
      );
    } catch (mailErr) {
      console.error('Failed to send confirmation email:', mailErr.message);
    }
    res.json({ success: true, message: 'Personal & Corporate Tax request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Year-round Strategies
router.post('/tax-year-round', auth, upload.single('documents'), async (req, res) => {
  try {
    const { investmentPlans, yearGoals, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'tax/year-round');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const taxService = new TaxPlanning({
      userId: req.user._id,
      investmentPlans,
      yearGoals,
      notes,
      documentPath,
      documentUrl,
      planningType: 'year_round',
    });
    await taxService.save();

    // Send confirmation email to user
    try {
      const sendMail = require('../../utils/mailer');
      const user = req.user;
      await sendMail(
        user.email,
        'Your Service Request Has Been Submitted',
        undefined,
        `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px 0;">
            <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 2px 12px #0001; padding: 32px 28px; border: 1px solid #e5e7eb;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0;">Your Service Request Has Been Submitted</h2>
                <p style="color: #64748b; font-size: 1rem; margin: 8px 0 0 0;">Thank you for submitting your service request. Stay tuned for further updates. We will notify you by email as your request progresses.</p>
              </div>
              <div style="margin: 32px 0; padding: 20px; background: #f1f5f9; border-radius: 12px;">
                <h3 style="color: #2563eb; margin-bottom: 12px;">User Information</h3>
                <ul style="list-style: none; padding: 0; color: #334155; font-size: 1rem;">
                  <li><strong>Name:</strong> ${user.name || 'N/A'}</li>
                  <li><strong>Email:</strong> ${user.email || 'N/A'}</li>
                </ul>
                <h3 style="color: #2563eb; margin: 20px 0 12px 0;">Service Information</h3>
                <ul style="list-style: none; padding: 0; color: #334155; font-size: 1rem;">
                  <li><strong>Service Type:</strong> Year-round Strategies</li>
                  <li><strong>Investment Plans:</strong> ${investmentPlans || 'N/A'}</li>
                  <li><strong>Year Goals:</strong> ${yearGoals || 'N/A'}</li>
                  <li><strong>Notes:</strong> ${notes || 'N/A'}</li>
                  <li><strong>Submitted At:</strong> ${taxService.createdAt ? new Date(taxService.createdAt).toLocaleString('en-IN') : 'N/A'}</li>
                </ul>
              </div>
              <div style="margin-top: 32px; text-align: center; color: #94a3b8; font-size: 0.9rem;">&copy; ${new Date().getFullYear()} K-N TaxMarks Advisors</div>
            </div>
          </div>
        `
      );
    } catch (mailErr) {
      console.error('Failed to send confirmation email:', mailErr.message);
    }
    res.json({ success: true, message: 'Year-round Strategies request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Tax Compliance & Advisory
router.post('/tax-compliance', auth, upload.single('documents'), async (req, res) => {
  try {
    const { complianceType, query, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'tax/compliance');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const taxService = new TaxPlanning({
      userId: req.user._id,
      complianceType,
      query,
      notes,
      documentPath,
      documentUrl,
      planningType: 'compliance',
    });
    await taxService.save();

    // Send confirmation email to user
    try {
      const sendMail = require('../../utils/mailer');
      const user = req.user;
      await sendMail(
        user.email,
        'Your Service Request Has Been Submitted',
        undefined,
        `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px 0;">
            <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 2px 12px #0001; padding: 32px 28px; border: 1px solid #e5e7eb;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0;">Your Service Request Has Been Submitted</h2>
                <p style="color: #64748b; font-size: 1rem; margin: 8px 0 0 0;">Thank you for submitting your service request. Stay tuned for further updates. We will notify you by email as your request progresses.</p>
              </div>
              <div style="margin: 32px 0; padding: 20px; background: #f1f5f9; border-radius: 12px;">
                <h3 style="color: #2563eb; margin-bottom: 12px;">User Information</h3>
                <ul style="list-style: none; padding: 0; color: #334155; font-size: 1rem;">
                  <li><strong>Name:</strong> ${user.name || 'N/A'}</li>
                  <li><strong>Email:</strong> ${user.email || 'N/A'}</li>
                </ul>
                <h3 style="color: #2563eb; margin: 20px 0 12px 0;">Service Information</h3>
                <ul style="list-style: none; padding: 0; color: #334155; font-size: 1rem;">
                  <li><strong>Service Type:</strong> Tax Compliance & Advisory</li>
                  <li><strong>Compliance Type:</strong> ${complianceType || 'N/A'}</li>
                  <li><strong>Query:</strong> ${query || 'N/A'}</li>
                  <li><strong>Notes:</strong> ${notes || 'N/A'}</li>
                  <li><strong>Submitted At:</strong> ${taxService.createdAt ? new Date(taxService.createdAt).toLocaleString('en-IN') : 'N/A'}</li>
                </ul>
              </div>
              <div style="margin-top: 32px; text-align: center; color: #94a3b8; font-size: 0.9rem;">&copy; ${new Date().getFullYear()} K-N TaxMarks Advisors</div>
            </div>
          </div>
        `
      );
    } catch (mailErr) {
      console.error('Failed to send confirmation email:', mailErr.message);
    }
    res.json({ success: true, message: 'Tax Compliance & Advisory request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Personal & Corporate Tax requests
router.get('/tax-personal-corporate/all', async (req, res) => {
  try {
    const records = await TaxPlanning.find({ planningType: 'personal_corporate' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Year-round Strategies requests
router.get('/tax-year-round/all', async (req, res) => {
  try {
    const records = await TaxPlanning.find({ planningType: 'year_round' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Tax Compliance & Advisory requests
router.get('/tax-compliance/all', async (req, res) => {
  try {
    const records = await TaxPlanning.find({ planningType: 'compliance' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Get all tax planning services
router.get('/all', async (req, res) => {
  try {
    const allEntries = await TaxPlanning.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's tax planning services
router.get('/user-services', auth, async (req, res) => {
  try {
    const userServices = await TaxPlanning.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(userServices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
