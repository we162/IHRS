const mongoose = require("mongoose");

const instagramSchema = new mongoose.Schema({

url:String

},{timestamps:true});

module.exports = mongoose.model("Instagram",instagramSchema);