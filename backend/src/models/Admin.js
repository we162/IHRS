const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["super_admin", "staff_admin"],
      default: "staff_admin"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);