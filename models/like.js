const Joi = require("joi");
const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
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
  },
});

const Like = mongoose.model("Like", likeSchema);

const validateLike = (like) => {
  const schema = Joi.object({
    user: Joi.string().hex().length(24).required().label("user"),
  });

  return schema.validate(like);
};

exports.Like = Like;
exports.validate = validateLike;
