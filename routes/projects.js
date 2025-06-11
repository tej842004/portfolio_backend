const express = require("express");
const { Project } = require("../models/project");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const offset = parseInt(req.query.offset) || 0;
    const limit = parseInt(req.query.limit) || 4;

    const total_count = await Project.countDocuments();
    const projects = await Project.find().skip(offset).limit(limit);

    res.send({
      data: projects,
      meta: {
        message: "Projects fetched successfully",
      },
      pagination: {
        total_count,
        count: projects.length,
        offset,
      },
    });
  } catch (error) {
    res.status(500).send({
      meta: { message: "Internal server error" },
      error: error.message,
    });
  }
});

module.exports = router;
