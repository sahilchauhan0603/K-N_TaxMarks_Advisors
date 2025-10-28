const express = require('express');
const router = express.Router();
const GST = require('../../models/GST');
const auth = require('../../middleware/userAuth');
const upload = require('../../middleware/upload');
const { uploadImage } = require('../../config/cloudinary');

// GST Registration
router.post('/gst-registration', auth, upload.single('documents'), async (req, res) => {
  try {
    const { gstNumber, businessName, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'gst/registration');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const gstService = new GST({ 
      userId: req.user._id,
      serviceType: 'Registration',
      gstNumber,
      businessName,
      notes,
      documentPath,
      documentUrl
    });
    await gstService.save();

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
                  <li><strong>Service Type:</strong> GST Registration</li>
                  <li><strong>GST Number:</strong> ${gstService.gstNumber || 'N/A'}</li>
                  <li><strong>Business Name:</strong> ${gstService.businessName || 'N/A'}</li>
                  <li><strong>Notes:</strong> ${gstService.notes || 'N/A'}</li>
                  <li><strong>Submitted At:</strong> ${gstService.createdAt ? new Date(gstService.createdAt).toLocaleString('en-IN') : 'N/A'}</li>
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
    res.json({ success: true, message: 'GST Registration request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

router.get('/gst-registration/all', async (req, res) => {
  try {
    const allEntries = await GST.find({ serviceType: 'Registration' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GST Return Filing
router.post('/gst-return-filing', auth, upload.single('documents'), async (req, res) => {
  try {
    const { gstin, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'gst/return-filing');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const gstService = new GST({ 
      userId: req.user._id,
      serviceType: 'Return Filing',
      gstin,
      notes,
      documentPath,
      documentUrl
    });
    await gstService.save();

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
                  <li><strong>Service Type:</strong> GST Return Filing</li>
                  <li><strong>GSTIN:</strong> ${gstService.gstin || 'N/A'}</li>
                  <li><strong>Notes:</strong> ${gstService.notes || 'N/A'}</li>
                  <li><strong>Submitted At:</strong> ${gstService.createdAt ? new Date(gstService.createdAt).toLocaleString('en-IN') : 'N/A'}</li>
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
    res.status(201).json({ success: true, message: 'GST Return Filing request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

router.get('/gst-return-filing/all', async (req, res) => {
  try {
    const allEntries = await GST.find({ serviceType: 'Return Filing' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GST Resolution
router.post('/gst-resolution', auth, upload.single('documents'), async (req, res) => {
  try {
    const { gstNumber, issue, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'gst/resolution');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const gstService = new GST({ 
      userId: req.user._id,
      serviceType: 'Resolution',
      gstNumber,
      issue,
      notes,
      documentPath,
      documentUrl
    });
    await gstService.save();

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
                  <li><strong>Service Type:</strong> GST Resolution</li>
                  <li><strong>GST Number:</strong> ${gstService.gstNumber || 'N/A'}</li>
                  <li><strong>Issue:</strong> ${gstService.issue || 'N/A'}</li>
                  <li><strong>Notes:</strong> ${gstService.notes || 'N/A'}</li>
                  <li><strong>Submitted At:</strong> ${gstService.createdAt ? new Date(gstService.createdAt).toLocaleString('en-IN') : 'N/A'}</li>
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
    res.status(201).json({ success: true, message: 'GST Resolution request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

router.get('/gst-resolution/all', async (req, res) => {
  try {
    const allEntries = await GST.find({ serviceType: 'Resolution' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all GST services
router.get('/all', async (req, res) => {
  try {
    const allEntries = await GST.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's GST services
router.get('/user-services', auth, async (req, res) => {
  try {
    const userServices = await GST.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(userServices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
