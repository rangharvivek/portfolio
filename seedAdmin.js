// seedAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolio";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async ()=> {
    const username = "admin";
    const password = "admin123"; // change after first login
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const exists = await Admin.findOne({ username });
    if (exists) {
      console.log("Admin already exists");
      process.exit(0);
    }
    await Admin.create({ username, password: hashed });
    console.log("Admin created -> username:", username, "password:", password);
    process.exit(0);
  })
  .catch(err => console.error(err));
