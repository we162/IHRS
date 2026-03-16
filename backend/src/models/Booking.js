const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
{
name: String,
phone: String,
email: String,
date: String,
start_time: String,
end_time: String,
slots: Number,
experience_level: { type: String, default: 'Beginner' },
ride_type: { type: String, default: 'Arena Training' },
status: {
type: String,
default: "confirmed"
}
},
{ timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);