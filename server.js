const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

const portfolioRoutes = require("./routes/portfolio");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://viveksinghranghar:uBzaSPeRwkM1WdHn@cluster0.z2j6ycw.mongodb.net/portfolio";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success"); // array
  res.locals.error = req.flash("error");     // array
  res.locals.admin = req.session.admin || null;
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", portfolioRoutes);
app.use("/admin", adminRoutes);   // 👈 yeh add karo

app.use("/admin", adminRoutes);   
app.listen(PORT, ()=> console.log(`🚀 Server running: http://localhost:${PORT}`));
