const Gallery = require("../models/Gallery");
const cloudinary = require("../config/cloudinary");

exports.uploadImage = async(req,res)=>{

try{

const result = await cloudinary.uploader.upload_stream(
{folder:"horse_club_gallery"},
async(error,result)=>{

if(error) return res.status(500).json(error);

const image = await Gallery.create({
image_url: result.secure_url,
title: req.body.title || "New Image"
});

res.json(image);

}
).end(req.file.buffer);

}catch(err){

res.status(500).json(err);

}
};

exports.getGallery = async(req,res)=>{
const images = await Gallery.find().sort({createdAt: -1});
res.json(images);
};

exports.updateImage = async(req,res)=>{
try {
  const updated = await Gallery.findByIdAndUpdate(req.params.id, {
    title: req.body.title
  }, {new: true});
  res.json(updated);
} catch (err) {
  res.status(500).json(err);
}
};

exports.deleteImage = async(req,res)=>{
try {
  // Option: delete from cloudinary as well
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({message: "Image deleted"});
} catch (err) {
  res.status(500).json(err);
}
};