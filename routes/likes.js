const auth = require("../middleware/auth");
const { Like } = require("../models/like");
const express = require("express");
const router = express.Router();

router.post("/", auth, (req, res) => {
  const like = new Like({
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
    },
  });

  like.save();

  res.status(201).send(like);
});

router.delete("/", auth, (req, res) => {
  res.send("Delete");
});

module.exports = router;
