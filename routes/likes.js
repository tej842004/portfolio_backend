// const auth = require("../middleware/auth");
// const { Like } = require("../models/like");
// const express = require("express");
// const router = express.Router();

// router.post("/", auth, async (req, res) => {
//   const like = new Like({
//     user: {
//       _id: req.user._id,
//       name: req.user.name,
//       email: req.user.email,
//     },
//   });

//   await like.save();

//   res.status(201).send(like);
// });

// router.delete("/", auth, async (req, res) => {
//   const like = await Like.findOne({ "user._id": req.user._id });
//   if (!like)
//     return res.status(400).send("You don't have permission to unlike.");

//   const deleteLike = await Like.findByIdAndDelete(like._id);
//   res.send(deleteLike);
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { Like } = require("../models/like");

// POST /api/likes
router.post("/", auth, async (req, res) => {
  const { postId } = req.body;
  if (!postId) return res.status(400).send("postId is required.");

  try {
    const existingLike = await Like.findOne({
      user: req.user._id,
      post: postId,
    });
    if (existingLike)
      return res.status(400).send("You already liked this post.");

    const like = new Like({ user: req.user._id, post: postId });
    await like.save();
    res.status(201).send(like);
  } catch (err) {
    res.status(500).send("Something went wrong.");
  }
});

// DELETE /api/likes
router.delete("/", auth, async (req, res) => {
  const { postId } = req.body;
  if (!postId) return res.status(400).send("postId is required.");

  try {
    const like = await Like.findOneAndDelete({
      user: req.user._id,
      post: postId,
    });
    if (!like) return res.status(400).send("Like not found.");
    res.send(like);
  } catch (err) {
    res.status(500).send("Something went wrong.");
  }
});

module.exports = router;

