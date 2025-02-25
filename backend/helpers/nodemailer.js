const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Replace with your SMTP server
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASSWORD,
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
    from: `RNB Soul APP ${process.env.SMTP_AUTH_USER}`,
    to: email,
    subject: "Password Reset Request",
    html: `<p>Your password has been reset successfully.</p>
            <p>Your new password is: <strong style="color: green">${generatedPassword}</strong></p>
           <p>Please log in with your new password.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendPasswordResetEmail,
  sendForgotPasswordEmail,
};
