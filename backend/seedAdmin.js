require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("./src/models/Admin");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB, checking for admin...");
    const existing = await Admin.findOne({ email: "admin@horseclub.com" });
    if (!existing) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await Admin.create({
        email: "admin@horseclub.com",
        password: hashedPassword,
        role: "super_admin"
      });
      console.log("Admin seeded.");
    } else {
      console.log("Admin already exists.");
      // Just update password to ensure it matches
      existing.password = await bcrypt.hash("admin123", 10);
      await existing.save();
      console.log("Admin password ensured.");
    }
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
