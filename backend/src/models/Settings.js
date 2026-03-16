const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  clubName: { type: String, default: "IHRS Club" },
  email: { type: String, default: "hello@ihrsclub.com" },
  phone: { type: String, default: "+1 (555) 123-4567" },
  mapLink: { type: String, default: "https://www.google.com/maps/embed?pb=..." },
  address: { type: String, default: "Dundigal, Domara Pocham Pally, Telangana 500043, India" },
  morningStart: { type: String, default: "06:00" },
  morningEnd: { type: String, default: "11:00" },
  eveningStart: { type: String, default: "16:00" },
  eveningEnd: { type: String, default: "19:00" },
  slotDuration: { type: Number, default: 45 }
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
