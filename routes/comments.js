const { Blog } = require("../models/blog");
const { User } = require("../models/user");
const { Comment, validate } = require("../models/comment");
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const total_count = await Comment.countDocuments();
    const comments = await Comment.find()
      .sort("-createdAt")
      .skip(offset)
      .limit(limit)
      .lean();

    res.send({
      data: comments,
      meta: {
        message: "Comments fetched successfully",
      },
      pagination: {
        total_count,
        count: comments.length,
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

router.post("/", auth, async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).send("Invalid user.");

    const blog = await Blog.findById(req.body.blogId);
    if (!blog) return res.status(400).send("Blog is required.");

    const comment = new Comment({
      comment: req.body.comment,
      user: new User({
        _id: user._id,
        name: user.name,
        email: user.email,
      }),
      blog: new Blog({
        _id: blog._id,
        title: blog.title,
        content: blog.content,
      }),
    });

    await comment.save();

    res.status(201).send(comment);
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).send({
      meta: { message: "Something went wrong." },
      error: err.message,
    });
  }
});

router.put("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid blog ID.");

  let comment = await Comment.findById(req.params.id);
  if (!comment.user._id.equals(req.user._id))
    return res
      .status(400)
      .send("You don't have permission to delete this comment.");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  comment = await Comment.findByIdAndUpdate(
    comment._id,
    {
      comment: req.body.comment,
    },
    { new: true }
  );

  if (!comment) return res.status(404).send("Comment not found.");

  res.send(comment);
});

router.delete("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid blog ID.");

  const comment = await Comment.findById(req.params.id);
  if (!comment.user._id.equals(req.user._id))
    return res
      .status(400)
      .send("You don't have permission to delete this comment.");

  const deleteComment = await Comment.findByIdAndDelete(req.params.id);
  if (!deleteComment) return res.status(404).send("Comment not found.");

  res.send(comment);
});

module.exports = router;
