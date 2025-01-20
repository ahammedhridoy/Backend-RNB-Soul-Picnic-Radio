import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Replace with your SMTP server
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (to, token) => {
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
