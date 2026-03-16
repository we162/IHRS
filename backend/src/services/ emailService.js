const sendBookingEmail = async(email,booking)=>{

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("No email credentials configured");
    return;
  }
  
  const nodemailer = require("nodemailer");
  
  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:process.env.EMAIL_USER,
      pass:process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from:process.env.EMAIL_USER,
    to:email,
    subject:"Horse Riding Booking Confirmation",
    html:`
      <h2>Booking Confirmed 🐎</h2>
      <p>Date: ${booking.date}</p>
      <p>Time: ${booking.start_time} - ${booking.end_time}</p>
      <p>Slots: ${booking.slots}</p>
      <p>Please arrive 10 minutes early.</p>
    `
  });
};

module.exports = sendBookingEmail;