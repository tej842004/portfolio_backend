const express = require("express");
const nodemailer = require("nodemailer");
const router = express();

router.use(express.json());

router.post("/", async (req, res) => {
  const { name, email, message, heading } = req.body;

  let mailText = "";

  if (heading) mailText += `Heading: ${heading}\n`;
  if (name) mailText += `Name: ${name}\n`;
  if (email) mailText += `Email: ${email}\n`;
  if (message) mailText += `Message: ${message}\n`;

  if (!message && !name && !email && !heading) {
    return res.status(400).json({ message: "No content provided." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "imtej08@gmail.com",
      pass: "tusl nxqw hoxj wmsg",
    },
  });

  const mailOptions = {
    from: email || "no-reply@example.com",
    to: "imtej08@gmail.com",
    subject: `New Contact${name ? ` from ${name}` : ""}`,
    text: mailText,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email." });
  }
});

module.exports = router;
