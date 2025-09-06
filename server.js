const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const Admin = require("./models/Admin");

const portfolioRoutes = require("./routes/portfolio");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 3000;


// const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://viveksinghranghar:uBzaSPeRwkM1WdHn@cluster0.z2j6ycw.mongodb.net/portfolio";

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(async () => {
//     console.log("✅ MongoDB connected");

//     // Seed admin if it doesn't exist
//     const exists = await Admin.findOne({ username: "admin" });
//     if (!exists) {
//       const salt = await bcrypt.genSalt(10);
//       const hashed = await bcrypt.hash("admin123", salt);
//       await Admin.create({ username: "admin", password: hashed });
//       console.log("Admin created -> username: admin, password: admin123");
//     } else {
//       console.log("Admin already exists");
//     }
//   })
//   .catch(err => console.error("❌ MongoDB connection error:", err));


const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://viveksinghranghar:uBzaSPeRwkM1WdHn@cluster0.z2j6ycw.mongodb.net/portfolio";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
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

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.admin = req.session.admin || null;
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/", portfolioRoutes);


app.use("/admin", adminRoutes);   // 👈 yeh add karo




app.listen(PORT, ()=> console.log(`🚀 Server running: http://localhost:${PORT}`));
