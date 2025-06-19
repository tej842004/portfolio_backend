const Joi = require("joi");
const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: new mongoose.Schema({
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        name: {
          type: String,
          minlength: 5,
          maxlength: 255,
          required: true,
        },
        email: {
          type: String,
          minlength: 5,
          maxlength: 255,
          required: true,
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
      }),
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.index({ user: 1, blog: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);

const validateLike = (like) => {
  const schema = Joi.object({
    blog: Joi.string().hex().length(24).required().label("Blog"),
  });

  return schema.validate(like);
};

exports.Like = Like;
exports.validate = validateLike;
