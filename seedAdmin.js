

  const mongoose = require("mongoose");
const Admin = require("./models/Admin");

const MONGO_URI = "mongodb+srv://viveksinghranghar:uBzaSPeRwkM1WdHn@cluster0.z2j6ycw.mongodb.net/portfolio";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const exists = await Admin.findOne({ username: "admin" });
    if (!exists) {
      await Admin.create({ username: "admin", password: "admin123" });
      console.log("✅ Admin created -> username: admin, password: admin123");
    } else {
      console.log("ℹ️ Admin already exists");
    }
    process.exit(0);
  })
  .catch(err => console.error(err));
