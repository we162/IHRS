const express = require("express");

const {addPost,getPosts,deletePost} = require("../controllers/instagramController");

const router = express.Router();

router.post("/",addPost);

router.get("/",getPosts);

router.delete("/:id",deletePost);

module.exports = router;