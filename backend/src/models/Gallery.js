const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({

image_url:String,

title:String

},{timestamps:true});

module.exports = mongoose.model("Gallery",gallerySchema);