const Instagram = require("../models/Instagram");

exports.addPost = async(req,res)=>{

const {url} = req.body;

const post = await Instagram.create({url});

res.json(post);

};

exports.getPosts = async(req,res)=>{

const posts = await Instagram.find();

res.json(posts);

};

exports.deletePost = async(req,res)=>{

await Instagram.findByIdAndDelete(req.params.id);

res.json({message:"Deleted"});

};