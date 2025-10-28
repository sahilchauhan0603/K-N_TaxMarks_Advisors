const express = require('express');
const router = express.Router();
const BusinessAdvisory = require('../../models/BusinessAdvisory');
const auth = require('../../middleware/userAuth');
const upload = require('../../middleware/upload');
const { uploadImage } = require('../../config/cloudinary');

// Startup & MSME Registration
router.post('/business-startup', auth, upload.single('documents'), async (req, res) => {
  try {
    const { businessName, businessType, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'business/startup');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const businessService = new BusinessAdvisory({
      userId: req.user._id,
      businessName,
      businessType,
      notes,
      documentPath,
      documentUrl,
      advisoryType: 'startup',
    });
    await businessService.save();

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
                  <li><strong>Service Type:</strong> Startup & MSME Registration</li>
                  <li><strong>Business Name:</strong> ${businessService.businessName || 'N/A'}</li>
                  <li><strong>Business Type:</strong> ${businessService.businessType || 'N/A'}</li>
                  <li><strong>Notes:</strong> ${businessService.notes || 'N/A'}</li>
                  <li><strong>Submitted At:</strong> ${businessService.createdAt ? new Date(businessService.createdAt).toLocaleString('en-IN') : 'N/A'}</li>
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
    res.json({ success: true, message: 'Startup & MSME Registration request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Company Incorporation
router.post('/business-incorporation', auth, upload.single('documents'), async (req, res) => {
  try {
    const { companyName, companyType, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'business/incorporation');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const businessService = new BusinessAdvisory({
      userId: req.user._id,
      companyName,
      companyType,
      notes,
      documentPath,
      documentUrl,
      advisoryType: 'incorporation',
    });
    await businessService.save();

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
                  <li><strong>Service Type:</strong> Company Incorporation</li>
                  <li><strong>Company Name:</strong> ${businessService.companyName || 'N/A'}</li>
                  <li><strong>Company Type:</strong> ${businessService.companyType || 'N/A'}</li>
                  <li><strong>Notes:</strong> ${businessService.notes || 'N/A'}</li>
                  <li><strong>Submitted At:</strong> ${businessService.createdAt ? new Date(businessService.createdAt).toLocaleString('en-IN') : 'N/A'}</li>
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
    res.json({ success: true, message: 'Company Incorporation request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Legal & Financial Advisory
router.post('/business-advisory', auth, upload.single('documents'), async (req, res) => {
  try {
    const { query, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'business/advisory');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const businessService = new BusinessAdvisory({
      userId: req.user._id,
      query,
      notes,
      documentPath,
      documentUrl,
      advisoryType: 'advisory',
    });
    await businessService.save();

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
                  <li><strong>Service Type:</strong> Legal & Financial Advisory</li>
                  <li><strong>Query:</strong> ${businessService.query || 'N/A'}</li>
                  <li><strong>Notes:</strong> ${businessService.notes || 'N/A'}</li>
                  <li><strong>Submitted At:</strong> ${businessService.createdAt ? new Date(businessService.createdAt).toLocaleString('en-IN') : 'N/A'}</li>
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
    res.json({ success: true, message: 'Legal & Financial Advisory request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Startup & MSME Registration requests
router.get('/business-startup/all', async (req, res) => {
  try {
    const records = await BusinessAdvisory.find({ advisoryType: 'startup' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Company Incorporation requests
router.get('/business-incorporation/all', async (req, res) => {
  try {
    const records = await BusinessAdvisory.find({ advisoryType: 'incorporation' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Legal & Financial Advisory requests
router.get('/business-advisory/all', async (req, res) => {
  try {
    const records = await BusinessAdvisory.find({ advisoryType: 'advisory' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Get all business advisory services
router.get('/all', async (req, res) => {
  try {
    const allEntries = await BusinessAdvisory.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's business advisory services
router.get('/user-services', auth, async (req, res) => {
  try {
    const userServices = await BusinessAdvisory.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(userServices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
