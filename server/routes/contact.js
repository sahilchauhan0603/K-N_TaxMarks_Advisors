const express = require('express');
const router = express.Router();
const sendMail = require('../utils/mailer');

// Send contact inquiry email
router.post('/send', async (req, res) => {
  const { name, email, phone, service, message } = req.body;
  if (!name || !email || !phone || !service || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }
  try {
    const mailText = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`;
    const mailHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px;">
        <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); padding: 32px;">
          <h2 style="color: #2563eb; margin-bottom: 16px;">New Inquiry from K&N TaxMark Advisors</h2>
          <table style="width: 100%; margin-bottom: 24px;">
            <tr><td style="font-weight: bold; color: #222;">Name:</td><td>${name}</td></tr>
            <tr><td style="font-weight: bold; color: #222;">Email:</td><td>${email}</td></tr>
            <tr><td style="font-weight: bold; color: #222;">Phone:</td><td>${phone}</td></tr>
            <tr><td style="font-weight: bold; color: #222;">Service:</td><td>${service}</td></tr>
          </table>
          <div style="margin-bottom: 24px;">
            <div style="font-weight: bold; color: #222; margin-bottom: 8px;">Message:</div>
            <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; color: #333;">${message}</div>
          </div>
          <div style="text-align: center; margin-top: 32px;">
            <img src="https://kntaxmarkadvisors.com/logo.png" alt="K&N TaxMark Advisors" style="height: 48px; margin-bottom: 8px;" />
            <div style="color: #64748b; font-size: 13px;">This message was sent from the K&N TaxMark Advisors website contact form.</div>
          </div>
        </div>
      </div>
    `;
    await sendMail(
      process.env.CONTACT_EMAIL,
      `New Inquiry from ${name} (${service})`,
      mailText,
      mailHtml
    );
    res.json({ success: true, message: 'Inquiry sent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send inquiry.' });
  }
});

module.exports = router;
