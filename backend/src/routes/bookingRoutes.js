const express = require("express");

const {createBooking , getAllBookings , deleteBooking , cancelBooking , getBookingStats, getAvailability} = require("../controllers/bookingController");

const router = express.Router();

router.post("/",createBooking);

router.get("/availability", getAvailability);

router.get("/",getAllBookings);

router.delete("/:id",deleteBooking);

router.patch("/cancel/:id",cancelBooking);

router.get("/stats",getBookingStats);

module.exports = router;