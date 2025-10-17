const nodemailer = require('nodemailer');

const enabled = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);

const transporter = enabled ? nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
}) : null;

exports.sendEmail = async (to, subject, text) => {
  if (!enabled) {
    console.log(`[email disabled] Would send email to ${to} — ${subject}`);
    return;
  }
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      text
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Email error', err.message);
  }
};
