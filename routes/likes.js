// const auth = require("../middleware/auth");
// const { Like } = require("../models/like");
// const express = require("express");
// const router = express.Router();

// router.post("/", auth, async (req, res) => {
//   const like = new Like({
//     user: {
//       _id: req.user._id,
//       name: req.user.name,
//       email: req.user.email,
//     },
//   });

//   await like.save();

//   res.status(201).send(like);
// });

// router.delete("/", auth, async (req, res) => {
//   const like = await Like.findOne({ "user._id": req.user._id });
//   if (!like)
//     return res.status(400).send("You don't have permission to unlike.");

//   const deleteLike = await Like.findByIdAndDelete(like._id);
//   res.send(deleteLike);
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Like, validate } = require("../models/like");
const { Blog } = require("../models/blog");
const { User } = require("../models/user");

// POST /api/likes
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const blog = await Blog.findById(req.body.blog);
    if (!blog) return res.status(400).send("Blog is required.");

    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send("User is required.");

    const existingLike = await Like.findOne({
      "user._id": user._id,
      "blog._id": blog._id,
    });
    if (existingLike)
      return res.status(400).send("You already liked this post.");

    const like = new Like({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      blog: {
        _id: blog._id,
        title: blog.title,
      },
    });

    await like.save();
    res.status(201).send(like);
  } catch (err) {
    console.error(err);
    res.status(500).send("Interval Server Error.");
  }
});

// DELETE /api/likes
router.delete("/:id", auth, async (req, res) => {
  const { error } = validate(req.params.id);
  if (error) return res.status(400).send(error.details[0].message);

  const blog = await Blog.findById(req.body.blog);
  if (!blog) return res.status(400).send("Blog is required.");

  const user = await User.findById(req.user._id);
  if (!user) return res.status(400).send("User is required.");

  try {
    const like = await Like.findOneAndDelete({
      "user._id": user._id,
      "blog._id": blog._id,
    });
    if (!like) return res.status(400).send("Like not found.");
    res.send(like);
  } catch (err) {
    console.error(err);
    res.status(500).send("Interval Server Error.");
  }
});

module.exports = router;
