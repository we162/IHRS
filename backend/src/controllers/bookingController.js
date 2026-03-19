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


exports.updateStatus = async (req, res) => {
  try {
    const { status, amount } = req.body;
    const validStatuses = ['confirmed', 'pending', 'cancelled', 'ride_completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updateData = { status };
    if (status === 'ride_completed' && amount) {
      updateData.amount = Number(amount);
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getBookingStats = async (req, res) => {
  try {
    const now = new Date();

    // Today range
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const todayEnd   = new Date(now); todayEnd.setHours(23, 59, 59, 999);

    // Yesterday range
    const yestStart = new Date(todayStart); yestStart.setDate(yestStart.getDate() - 1);
    const yestEnd   = new Date(todayEnd);   yestEnd.setDate(yestEnd.getDate() - 1);

    // This week (last 7 days, Mon→Sun)
    const weekStart = new Date(todayStart); weekStart.setDate(weekStart.getDate() - 6);

    // This month
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [total, todayBookings, yesterdayBookings, weeklyBookings, monthlyBookings] =
      await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ createdAt: { $gte: todayStart, $lte: todayEnd } }),
        Booking.countDocuments({ createdAt: { $gte: yestStart,  $lte: yestEnd  } }),
        Booking.countDocuments({ createdAt: { $gte: weekStart,  $lte: todayEnd } }),
        Booking.countDocuments({ createdAt: { $gte: monthStart, $lte: todayEnd } }),
      ]);

    // Real revenue: sum of amount where status = ride_completed
    const revenueAgg = await Booking.aggregate([
      { $match: { status: 'ride_completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAgg.length ? revenueAgg[0].total : 0;

    // Last 7 days bookings count per day for chart
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(todayStart); dayStart.setDate(dayStart.getDate() - i);
      const dayEnd   = new Date(dayStart);   dayEnd.setHours(23, 59, 59, 999);
      const count = await Booking.countDocuments({ createdAt: { $gte: dayStart, $lte: dayEnd } });
      const label = dayStart.toLocaleDateString('en-IN', { weekday: 'short' });
      last7.push({ name: label, bookings: count });
    }

    // Ride type distribution
    const rideTypeAgg = await Booking.aggregate([
      { $group: { _id: '$ride_type', count: { $sum: 1 } } }
    ]);
    const rideTypes = rideTypeAgg.map(r => ({ name: r._id || 'Unknown', value: r.count }));

    // Status distribution
    const statusAgg = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statusDist = statusAgg.map(s => ({ status: s._id, count: s.count }));

    res.json({
      total,
      todayBookings,
      yesterdayBookings,
      weeklyBookings,
      monthlyBookings,
      totalRevenue,
      last7DaysChart: last7,
      rideTypeDistribution: rideTypes,
      statusDistribution: statusDist,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};