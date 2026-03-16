const express = require("express");

const upload = require("../middleware/uploadMiddleware");

const {uploadImage,getGallery,updateImage,deleteImage} = require("../controllers/galleryController");

const router = express.Router();

router.post("/",upload.single("image"),uploadImage);
router.get("/",getGallery);
router.put("/:id", updateImage);
router.delete("/:id", deleteImage);

module.exports = router;