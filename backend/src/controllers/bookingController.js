const Booking = require("../models/Booking");
const generateEndTime = require("../utils/slotGenerator");
const checkSlotAvailability = require("../utils/slotValidator");
const sendNotifications = require("../services/notificationService");



exports.createBooking = async (req,res)=>{

try{

const {name,phone,email,date,start_time,slots,experience_level,ride_type} = req.body;

const end_time = generateEndTime(start_time,slots);

const clashCount = await Booking.countDocuments({
  date,
  $or:[
    {
      start_time: {$lt: end_time},
      end_time: {$gt: start_time}
    }
  ]
});

if(clashCount >= 10){
return res.status(400).json({
message:"Selected slot is fully booked (Max 10 members)"
});
}

const booking = await Booking.create({
name,
phone,
email,
date,
start_time,
end_time,
slots,
experience_level: experience_level || 'Beginner',
ride_type: ride_type || 'Arena Training'
});

try {
  await sendNotifications(booking);
} catch (notifErr) {
  console.log("Notification failed but booking was created", notifErr);
}

res.status(201).json(booking);

}catch(err){
res.status(500).json({error:err.message});
}
};

exports.getAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });

    // Fetch all bookings for that date
    const bookingsForDate = await Booking.find({ date });
    
    // Create a map of slot times to number of bookings.
    // Assuming each booking takes a specific start_time.
    // If slots span multiple hours we might need more complex logic, but here start_time is the reference slot.
    const slotCounts = {};
    bookingsForDate.forEach(b => {
      slotCounts[b.start_time] = (slotCounts[b.start_time] || 0) + 1;
    });

    res.json(slotCounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getAllBookings = async(req,res)=>{

const bookings = await Booking.find().sort({createdAt:-1});

res.json(bookings);

};


exports.deleteBooking = async(req,res)=>{

await Booking.findByIdAndDelete(req.params.id);

res.json({message:"Booking deleted"});

};


exports.cancelBooking = async(req,res)=>{

const booking = await Booking.findByIdAndUpdate(
req.params.id,
{status:"cancelled"},
{new:true}
);

res.json(booking);

};


exports.getBookingStats = async(req,res)=>{

const total = await Booking.countDocuments();

const today = new Date();
today.setHours(0,0,0,0);

const todayBookings = await Booking.countDocuments({
createdAt:{$gte:today}
});

const week = new Date();
week.setDate(week.getDate()-7);

const weeklyBookings = await Booking.countDocuments({
createdAt:{$gte:week}
});

res.json({
total,
todayBookings,
weeklyBookings
});

};