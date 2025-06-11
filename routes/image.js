const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../cloudinary");

const upload = multer({ storage: multer.memoryStorage() });

// Upload image route
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "blogs" }, (error, result) => {
          if (error || !result) reject(error || new Error("Upload failed"));
          else resolve(result);
        })
        .end(req.file.buffer);
    });

    res.json({ imageUrl: result.secure_url, public_id: result.public_id });
  } catch (error) {
    res.status(500).json({ error: "Upload failed", details: error.message });
  }
});

// Delete image route
router.delete("/", async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) {
    return res.status(400).json({ error: "public_id is required" });
  }

  // Optional: protect deletion to only 'blogs/' folder
  if (!public_id.startsWith("blogs/")) {
    return res.status(403).json({ error: "Unauthorized deletion attempt" });
  }

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    if (result.result !== "ok") {
      return res.status(400).json({ error: "Failed to delete image" });
    }
    res.json({ message: "Image deleted successfully", result });
  } catch (error) {
    res.status(500).json({ error: "Deletion failed", details: error.message });
  }
});

module.exports = router;
