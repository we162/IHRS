const sendBookingEmail = require("./ emailService");
const sendWhatsappMessage = require("./whatsappService");

const sendNotifications = async (booking) => {

  try {
    if (process.env.BREVO_API_KEY) {
      await sendBookingEmail(booking.email, booking);
    } else {
      console.log("⚠️  Skipping email notification — BREVO_API_KEY not set");
    }

    const message = `

  Horse Riding Booking Confirmed 🐎

  Date: ${booking.date}
  Time: ${booking.start_time} - ${booking.end_time}

  Location:
  Google Maps Link

  `;

    if (process.env.TWILIO_SID && process.env.TWILIO_TOKEN) {
      await sendWhatsappMessage(booking.phone, message);
    } else {
      console.log("Skipping whatsapp notification, missing config");
    }
  } catch (e) {
    console.log("Notification service error:", e);
  }

};

module.exports = sendNotifications;