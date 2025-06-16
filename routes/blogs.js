const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Blog, validate } = require("../models/blog");
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const { Genre } = require("../models/genre");
const {
  extractPlainTextFromTipTapJSON,
} = require("../utils/extractPlainTextFromTipTapJSON");

// GET all blogs
router.get("/", async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 10;

    const total_count = await Blog.countDocuments();
    const blogs = await Blog.find()
      .sort("-createdAt")
      .skip(offset)
      .limit(limit)
      .populate("genre", "title");

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

// POST a new blog
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const author = await User.findById(req.body.author);
    if (!author) return res.status(400).send("Invalid Author.");

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("Genre is required.");

    let readTime = 1;
    try {
      const plainText = extractPlainTextFromTipTapJSON(req.body.content);
      const wordsPerMinute = 200;
      const wordCount = plainText.trim().split(/\s+/).length;
      readTime = Math.ceil(wordCount / wordsPerMinute);
    } catch (err) {
      console.warn("Could not calculate read time:", err);
    }

    const blog = new Blog({
      title: req.body.title,
      content: req.body.content,
      user: {
        _id: author._id,
        name: author.name,
        email: author.email,
      },
      genre: {
        _id: genre._id,
        title: genre.title,
      },
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      imagePublicId: req.body.imagePublicId,
      readTime,
      createdAt: new Date(),
    });

    await blog.save();

    res.status(201).send(blog);
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).send("Something went wrong.");
  }
});

// PUT (update) an existing blog
router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid blog ID.");

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      content: req.body.content,
      user: req.body.author,
      genre: req.body.genre,
      tags: req.body.tags,
      image: req.body.image,
    },
    { new: true }
  );

  if (!blog) return res.status(404).send("Blog not found.");

  res.send(blog);
});

// DELETE a blog
router.delete("/:id", auth, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid blog ID.");

  const blog = await Blog.findById(req.params.id);
  if (blog.user._id.toString() !== req.user._id)
    return res
      .status(400)
      .send("You don't have permission to delete this blog.");

  const deleteBlog = await Blog.findByIdAndDelete(req.params.id);
  if (!deleteBlog) return res.status(404).send("Blog not found.");

  res.send(blog);
});

// GET a single blog by ID
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).send("Invalid blog ID.");

  const blog = await Blog.findById(req.params.id).populate("genre", "title");

  if (!blog) return res.status(404).send("Blog not found.");

  res.send(blog);
});

module.exports = router;
