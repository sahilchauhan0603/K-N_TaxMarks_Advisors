const express = require('express');
const router = express.Router();
const ITR = require('../../models/ITR');
const auth = require('../../middleware/userAuth');
const upload = require('../../middleware/upload');
const { uploadImage } = require('../../config/cloudinary');

// ITR Filing
router.post('/itr-filing', auth, upload.single('documents'), async (req, res) => {
  try {
    const { pan, itrType, annualIncome, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'itr/filing');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const itrService = new ITR({ 
      userId: req.user._id,
      serviceType: 'Filing',
      pan,
      itrType,
      annualIncome,
      notes,
      documentPath,
      documentUrl
    });
    await itrService.save();

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
                  <li><strong>Service Type:</strong> ITR Filing</li>
                  <li><strong>PAN:</strong> ${itrService.pan || 'N/A'}</li>
                  <li><strong>ITR Type:</strong> ${itrService.itrType || 'N/A'}</li>
                  <li><strong>Annual Income:</strong> ${itrService.annualIncome || 'N/A'}</li>
                  <li><strong>Notes:</strong> ${itrService.notes || 'N/A'}</li>
                  <li><strong>Submitted At:</strong> ${itrService.createdAt ? new Date(itrService.createdAt).toLocaleString('en-IN') : 'N/A'}</li>
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
    res.json({ success: true, message: 'ITR Filing request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

router.get('/itr-filing/all', async (req, res) => {
  try {
    const allEntries = await ITR.find({ serviceType: 'Filing' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ITR Refund/Notice
router.post('/itr-refund-notice', auth, upload.single('documents'), async (req, res) => {
  try {
    const { pan, refundYear, noticeType, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'itr/refund-notice');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const itrService = new ITR({ 
      userId: req.user._id,
      serviceType: 'Refund/Notice',
      pan,
      refundYear,
      noticeType,
      notes,
      documentPath,
      documentUrl
    });
    await itrService.save();

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
                  <li><strong>Service Type:</strong> ITR Refund/Notice</li>
                  <li><strong>PAN:</strong> ${itrService.pan || 'N/A'}</li>
                  <li><strong>Refund Year:</strong> ${itrService.refundYear || 'N/A'}</li>
                  <li><strong>Notice Type:</strong> ${itrService.noticeType || 'N/A'}</li>
                  <li><strong>Notes:</strong> ${itrService.notes || 'N/A'}</li>
                  <li><strong>Submitted At:</strong> ${itrService.createdAt ? new Date(itrService.createdAt).toLocaleString('en-IN') : 'N/A'}</li>
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
    res.status(201).json({ success: true, message: 'ITR Refund/Notice request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

router.get('/itr-refund-notice/all', async (req, res) => {
  try {
    const allEntries = await ITR.find({ serviceType: 'Refund/Notice' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ITR Document Preparation
router.post('/itr-document-prep', auth, upload.single('documents'), async (req, res) => {
  try {
    const { documentType, notes } = req.body;
    let documentPath = '';
    let documentUrl = '';
    
    if (req.file) {
      const result = await uploadImage(req.file.buffer, 'itr/document-prep');
      documentPath = result.public_id;
      documentUrl = result.secure_url;
    }
    
    const itrService = new ITR({ 
      userId: req.user._id,
      serviceType: 'Document Preparation',
      documentType,
      notes,
      documentPath,
      documentUrl
    });
    await itrService.save();

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
                  <li><strong>Service Type:</strong> ITR Document Preparation</li>
                  <li><strong>Document Type:</strong> ${itrService.documentType || 'N/A'}</li>
                  <li><strong>Notes:</strong> ${itrService.notes || 'N/A'}</li>
                  <li><strong>Submitted At:</strong> ${itrService.createdAt ? new Date(itrService.createdAt).toLocaleString('en-IN') : 'N/A'}</li>
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
    res.status(201).json({ success: true, message: 'ITR Document Preparation request submitted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Server error.' });
  }
});

router.get('/itr-document-prep/all', async (req, res) => {
  try {
    const allEntries = await ITR.find({ serviceType: 'Document Preparation' }).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all ITR services
router.get('/all', async (req, res) => {
  try {
    const allEntries = await ITR.find().populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.status(200).json(allEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's ITR services
router.get('/user-services', auth, async (req, res) => {
  try {
    const userServices = await ITR.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(userServices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
