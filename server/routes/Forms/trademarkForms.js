const express = require('express');
const router = express.Router();
const Trademark = require('../../models/Trademark');
const auth = require('../../middleware/userAuth');
const upload = require('../../middleware/upload');
const { uploadImage } = require('../../config/cloudinary');

// Trademark Search & Registration
router.post('/trademark-search', auth, upload.single('documents'), async (req, res) => {
  try {
    const { brandName, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'trademark/search');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const trademarkService = new Trademark({
      userId: req.user._id,
      brandName,
      notes,
      documentPath,
      documentUrl,
      serviceType: 'search',
    });
    await trademarkService.save();

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
                  <li><strong>Service Type:</strong> Trademark Search & Registration</li>
                  <li><strong>Brand Name:</strong> ${trademarkService.brandName || 'N/A'}</li>
                  <li><strong>Notes:</strong> ${trademarkService.notes || 'N/A'}</li>
                  <li><strong>Submitted At:</strong> ${trademarkService.createdAt ? new Date(trademarkService.createdAt).toLocaleString('en-IN') : 'N/A'}</li>
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
    res.json({ success: true, message: 'Trademark Search & Registration request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Legal Documentation & Compliance
router.post('/trademark-documentation', auth, upload.single('documents'), async (req, res) => {
  try {
    const { docType, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'trademark/documentation');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const trademarkService = new Trademark({
      userId: req.user._id,
      docType,
      notes,
      documentPath,
      documentUrl,
      serviceType: 'documentation',
    });
    await trademarkService.save();

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
                  <li><strong>Service Type:</strong> Legal Documentation & Compliance</li>
                  <li><strong>Document Type:</strong> ${trademarkService.docType || 'N/A'}</li>
                  <li><strong>Notes:</strong> ${trademarkService.notes || 'N/A'}</li>
                  <li><strong>Submitted At:</strong> ${trademarkService.createdAt ? new Date(trademarkService.createdAt).toLocaleString('en-IN') : 'N/A'}</li>
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
    res.json({ success: true, message: 'Legal Documentation & Compliance request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// IP Protection & Dispute Resolution
router.post('/trademark-protection', auth, upload.single('documents'), async (req, res) => {
  try {
    const { disputeType, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'trademark/protection');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const trademarkService = new Trademark({
      userId: req.user._id,
      disputeType,
      notes,
      documentPath,
      documentUrl,
      serviceType: 'protection',
    });
    await trademarkService.save();

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
                  <li><strong>Service Type:</strong> IP Protection & Dispute Resolution</li>
                  <li><strong>Dispute Type:</strong> ${trademarkService.disputeType || 'N/A'}</li>
                  <li><strong>Notes:</strong> ${trademarkService.notes || 'N/A'}</li>
                  <li><strong>Submitted At:</strong> ${trademarkService.createdAt ? new Date(trademarkService.createdAt).toLocaleString('en-IN') : 'N/A'}</li>
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
    res.json({ success: true, message: 'IP Protection & Dispute Resolution request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Trademark Search & Registration requests
router.get('/trademark-search/all', async (req, res) => {
  try {
    const records = await Trademark.find({ serviceType: 'search' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all Legal Documentation & Compliance requests
router.get('/trademark-documentation/all', async (req, res) => {
  try {
    const records = await Trademark.find({ serviceType: 'documentation' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Fetch all IP Protection & Dispute Resolution requests
router.get('/trademark-protection/all', async (req, res) => {
  try {
    const records = await Trademark.find({ serviceType: 'protection' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

// Get all trademark services
router.get('/all', async (req, res) => {
  try {
    const allEntries = await Trademark.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's trademark services
router.get('/user-services', auth, async (req, res) => {
  try {
    const userServices = await Trademark.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(userServices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
