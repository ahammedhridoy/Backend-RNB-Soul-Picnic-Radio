const nodemailer = require("nodemailer");

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendPasswordResetEmail = async (to, token) => {
  const resetUrl = `${process.env.CLIENT_DOMAIN_NAME}/reset-password/${token}`;

  const mailOptions = {
    from: process.env.SMTP_AUTH_USER,
    to,
    subject: "Password Reset Request",
    html: `<p>You requested to reset your password.</p>
           <p>Click <a href="${resetUrl}" target="_blank">here</a> to reset your password. This link will expire in 1 hour.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendForgotPasswordEmail = async (email, generatedPassword) => {
  const mailOptions = {
    from: `RNB Soul APP ${process.env.SMTP_AUTH_USER} <aiwebmail0@gmail.com>`,
    to: email,
    subject: "Password Reset Request",
    html: `<p>Your password has been reset successfully.</p>
          <p>Your new password is: <strong style="color: green">${generatedPassword}</strong></p>
         <p>Please log in with your new password.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error("❌ Email sending error:", error);
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendForgotPasswordEmail,
};
