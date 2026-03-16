const Booking = require("../models/Booking");

const checkSlotAvailability = async (date, start_time, end_time) => {
  const clashCount = await Booking.countDocuments({
    date,
    $or:[
      {
        start_time: {$lt: end_time},
        end_time: {$gt: start_time}
      }
    ]
  });

  return clashCount >= 10;
};

module.exports = checkSlotAvailability;