const express = require("express");

const { createBooking, getAllBookings, deleteBooking, getBookingStats, getAvailability, updateStatus } = require("../controllers/bookingController");

const router = express.Router();

router.post("/", createBooking);
router.get("/availability", getAvailability);
router.get("/stats", getBookingStats);
router.get("/", getAllBookings);
router.delete("/:id", deleteBooking);
router.patch("/:id/status", updateStatus);

module.exports = router;