const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (to, subject, text, html) => {
  try {
    const msg = {
      to,
      from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
      subject,
      text,
      html,
    };

    const response = await sgMail.send(msg);
    return response;
  } catch (error) {
    console.error('Email sending failed:', error.message);
    if (error.response) {
      console.error('SendGrid error details:', error.response.body);
    }
    throw error;
  }
};

module.exports = sendMail;
