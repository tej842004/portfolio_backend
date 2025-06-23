// const express = require("express");
// const nodemailer = require("nodemailer");
// const router = express();

// router.post("/", async (req, res) => {
//   const { name, email, message } = req.body;

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "imtej08@gmail.com",
//       pass: "tusl nxqw hoxj wmsg",
//     },
//   });

//   const mailOptions = {
//     from: email,
//     to: "imtej08@gmail.com",
//     subject: `New Contact from ${name}`,
//     text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: "Email sent" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to send email" });
//   }
// });

// module.exports = router;
const express = require("express");
const nodemailer = require("nodemailer");
const router = express();

router.use(express.json()); // Ensure body parsing middleware is used

router.post("/", async (req, res) => {
  const { name, email, message, heading } = req.body;

  // Construct body dynamically
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
      pass: "tusl nxqw hoxj wmsg", // 👈 Don't share this in public repos
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
