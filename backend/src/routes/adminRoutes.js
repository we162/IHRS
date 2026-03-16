const express = require("express");

const { loginAdmin, createAdmin, getAdmins, deleteAdmin } = require("../controllers/adminController");

const router = express.Router();

router.post("/login", loginAdmin);
router.post("/users", createAdmin);
router.get("/users", getAdmins);
router.delete("/users/:id", deleteAdmin);

module.exports = router;