const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/genre");
const slugify = require("slugify");

// GET all genres with pagination and structured response
router.get("/", async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = 25;

  const [total_count, genres] = await Promise.all([
    Genre.countDocuments(),
    Genre.find().sort("title").skip(offset).limit(limit),
  ]);

  res.send({
    data: genres,
    pagination: {
      total_count,
      count: genres.length,
      offset,
    },
  });
});

// GET genre by slug (optional)
router.get("/slug/:slug", async (req, res) => {
  const genre = await Genre.findOne({ slug: req.params.slug });
  if (!genre) return res.status(404).send("Genre not found.");
  res.send(genre);
});

// POST a new genre
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existing = await Genre.findOne({
    title: new RegExp(`^${req.body.title}$`, "i"),
  });
  if (existing) return res.status(400).send("Genre already exists.");

  const slug = slugify(req.body.title, { lower: true, strict: true });

  const genre = new Genre({
    title: req.body.title,
    slug,
  });

  await genre.save();
  res.send(genre);
});

// PUT update a genre
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const slug = slugify(req.body.title, { lower: true, strict: true });

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      slug,
    },
    { new: true }
  );

  if (!genre) return res.status(404).send("Genre not found.");
  res.send(genre);
});

// DELETE a genre
router.delete("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send("Genre not found.");
  res.send(genre);
});

module.exports = router;
