const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { visitorId, visitorName } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const istTime = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });
  console.log(istTime);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "imtej08@gmail.com",
      pass: "tusl nxqw hoxj wmsg",
    },
  });

  const mailOptions = {
    from: "imtej08@gmail.com",
    to: "imtej08@gmail.com",
    subject: "Website Visit👀",
    text: `User "${visitorName}" with ID ${visitorId} just visited your site at ${istTime}. IP: ${ip}`,
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
// const nodemailer = require("nodemailer");
// const express = require("express");
// const router = express.Router();

// router.post("/", async (req, res) => {
//   const { visitorId, visitorName } = req.body;
//   const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

//   const istTime = new Date().toLocaleString('en')

//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: "imtej08@gmail.com",
//       pass: "tusl nxqw hoxj wmsg", // Be careful exposing this in public code
//     },
//   });

//   const mailOptions = {
//     from: "imtej08@gmail.com",
//     to: "imtej08@gmail.com",
//     subject: "Website Visit👀",
//     text: `User "${visitorName}" with ID ${visitorId} just visited your site at ${istTime}. IP: ${ip}`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.json({ success: true });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to send email" });
//   }
// });

// module.exports = router;
