const mongoose = require("mongoose");
const Joi = require("joi");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  content: {
    type: Object,
    required: true,
  },
  author: {
    type: new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
    required: true,
  },
  genre: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
    required: true,
  },
  tags: {
    type: [String],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: "A blog should have at least one tag.",
    },
  },
  imageUrl: String,
  imagePublicId: String,
  readTime: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Blog = mongoose.model("Blog", blogSchema);

function validateBlog(blog) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(255).required().label("Title"),
    content: Joi.object().required().label("Content"),
    tags: Joi.array().items(Joi.string()).min(1).required().label("Tags"),
    author: Joi.string().hex().length(24).required().label("Author"),
    genreId: Joi.string().hex().length(24).required().label("Genre"),
    imageUrl: Joi.string().required().label("Image"),
    imagePublicId: Joi.string().required().label("Image Public Id"),
  });

  return schema.validate(blog);
}

exports.Blog = Blog;
exports.validate = validateBlog;
