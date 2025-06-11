const mongoose = require("mongoose");
const Joi = require("joi");
const slugify = require("slugify"); // install this using `npm i slugify`

const genreSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
});

// Generate slug from title before saving
genreSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Genre = mongoose.model("Genre", genreSchema);

const validateGenre = (genre) => {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(genre);
};

exports.Genre = Genre;
exports.validate = validateGenre;
