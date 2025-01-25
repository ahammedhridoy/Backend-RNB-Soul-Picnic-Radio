const express = require("express");
const nodemailer = require("nodemailer");

const formRouter = express.Router();

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// POST /form
formRouter.post("/form", async (req, res) => {
  const { firstName, lastName, email, phone, address, city, subject } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !address ||
    !city ||
    !subject
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const fullname = firstName + " " + lastName;

  // Email options
  const mailOptions = {
    from: `"${fullname}" <${email}>`,
    to: process.env.RECEIVER_EMAIL,
    subject: subject,
    html: `
      <h3>RNB Soul Mobile APP Contact Form</h3>
      <p><strong>First Name:</strong> ${firstName}</p>
      <p><strong>Last Name:</strong> ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Subject:</strong>${subject}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>City:</strong> ${city}</p>
    `,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Failed to send email." });
  }
});

module.exports = formRouter;
