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

exports.Like = Like;

