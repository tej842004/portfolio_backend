const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const { Blog } = require("../models/blog");

router.get("/me", auth, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id }).select("-password");
  res.send(user);
});

router.get("/blogs", auth, async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const userId = req.user._id;

    const total_count = await Blog.countDocuments({ "user._id": userId });
    const blogs = await Blog.find({ "user._id": userId })
      .sort("-createdAt")
      .skip(offset)
      .limit(limit);

    res.send({
      data: blogs,
      meta: {
        message: "Blogs fetched successfully",
      },
      pagination: {
        total_count,
        count: blogs.length,
        offset,
      },
    });
  } catch (err) {
    res.status(500).send({
      meta: { message: "Internal server error" },
      error: err.message,
    });
  }
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
