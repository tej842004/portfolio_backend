const express = require("express");
const nodemailer = require("nodemailer");
const router = express();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "imtej08@gmail.com",
      pass: "tusl nxqw hoxj wmsg",
    },
  });

  const mailOptions = {
    from: email,
    to: "imtej08@gmail.com",
    subject: `New Contact from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = router;
