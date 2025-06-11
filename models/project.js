const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    minlength: 20,
  },
  techstack: {
    type: [String],
    required: true,
    validate: {
      validator: (arr) => arr.length >= 1,
      message: "Tech stack must have at least 1 item.",
    },
  },
  website: {
    type: String,
    required: true,
    match: /^https?:\/\/.+\..+/,
  },
  github: {
    type: String,
    required: true,
    match: /^https?:\/\/(www\.)?github\.com\/.+/,
  },
});

const Project = mongoose.model("Project", projectSchema);

module.exports = { Project };
