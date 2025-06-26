const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { visitorId, visitorName } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "imtej08@gmail.com",
      pass: "tusl nxqw hoxj wmsg",
    },
  });

  const mailOptions = {
    from: "imtej08@gmail.com",
    to: "imtej08@gmail.com",
    subject: "🚨 New Website Visit",
    text: `User "${visitorName}" with ID ${visitorId} just visited your site at ${new Date().toLocaleString()}. IP: ${ip}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

module.exports = router;
