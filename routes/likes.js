const auth = require("../middleware/auth");
const { Like, validate } = require("../models/like");
const express = require("express");
const router = express.Router();

router.post("/", auth, (req, res) => {
  const { error } = validate(req.user);
  if (error) return res.status(400).send(error.details[0].message);

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
