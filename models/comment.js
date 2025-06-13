const mongoose = require("mongoose");
const Joi = require("joi");

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    minlength: 1,
    required: true,
  },
  user: {
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
  blog: {
    type: new mongoose.Schema({
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
      content: {
        type: String,
        required: true,
        minlength: 5,
      },
    }),
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

const validateComment = (comment) => {
  const schema = Joi.object({
    comment: Joi.string().required().min(1).label("Comment"),
    userId: Joi.string().hex().length(24).required().label("UserId"),
    blogId: Joi.string().hex().length(24).required().label("BlogId"),
  });

  return schema.validate(comment);
};

exports.Comment = Comment;
exports.validate = validateComment;
