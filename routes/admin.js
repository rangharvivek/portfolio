const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");

const Project = require("../models/Project");
const Admin = require("../models/Admin");
const isAuthenticated = require("../middleware/auth");

// ------------------- Multer config -------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ------------------- Auth Routes -------------------

// Login - GET
router.get("/login", (req, res) => {
  if (req.session?.admin) return res.redirect("/admin/dashboard");
  res.render("admin/login", { title: "Admin Login", error: req.flash("error") });
});

// Login - POST
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      req.flash("error", "Invalid credentials");
      return res.redirect("/admin/login");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      req.flash("error", "Invalid credentials");
      return res.redirect("/admin/login");
    }

    req.session.admin = { id: admin._id, username: admin.username };
    req.flash("success", "Logged in successfully");
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/admin/login");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/admin/login");
  });
});

// ------------------- Dashboard -------------------
router.get("/dashboard", isAuthenticated, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.render("admin/dashboard", {
      title: "Dashboard",
      projects,
      success: req.flash("success"),
      error: req.flash("error")
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to load dashboard");
    res.redirect("/admin/login");
  }
});

// ------------------- Project Routes -------------------

// Add - GET
router.get("/add", isAuthenticated, (req, res) => {
  res.render("admin/add-project", { title: "Add Project", success: req.flash("success"), error: req.flash("error") });
});

// Add - POST
router.post("/add", isAuthenticated, upload.single("image"), async (req, res) => {
  try {
    const { title, description, github, demo, tech } = req.body;

    await Project.create({
      title,
      description,
      github,
      demo,
      tech: tech ? tech.split(",").map(s => s.trim()) : [],
      image: req.file ? "/uploads/" + req.file.filename : "/images/project1.jpg"
    });

    req.flash("success", "Project added successfully");
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to add project");
    res.redirect("/admin/add");
  }
});

// Edit - GET
router.get("/edit/:id", isAuthenticated, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      req.flash("error", "Project not found");
      return res.redirect("/admin/dashboard");
    }
    res.render("admin/edit-project", { title: "Edit Project", project, success: req.flash("success"), error: req.flash("error") });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/admin/dashboard");
  }
});

// Edit - POST
router.post("/edit/:id", isAuthenticated, upload.single("image"), async (req, res) => {
  try {
    const { title, description, github, demo, tech } = req.body;

    const update = {
      title,
      description,
      github,
      demo,
      tech: tech ? tech.split(",").map(s => s.trim()) : []
    };
    if (req.file) update.image = "/uploads/" + req.file.filename;

    await Project.findByIdAndUpdate(req.params.id, update);

    req.flash("success", "Project updated successfully");
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error", "Update failed");
    res.redirect(`/admin/edit/${req.params.id}`);
  }
});

// Delete - POST
router.post("/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    req.flash("success", "Project deleted successfully");
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    req.flash("error", "Delete failed");
    res.redirect("/admin/dashboard");
  }
});

module.exports = router;
