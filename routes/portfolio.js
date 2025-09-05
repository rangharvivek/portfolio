const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Home - show projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.render("index", { title: "My Portfolio", projects });
  } catch (err) {
    console.error(err);
    res.render("index", { title: "My Portfolio", projects: [] });
  }
});

module.exports = router;
