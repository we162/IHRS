const sendWhatsappMessage = async(phone,message)=>{
  if (!process.env.TWILIO_SID || !process.env.TWILIO_TOKEN) {
    console.log("No twilio credentials configured");
    return;
  }
  const twilio = require("twilio");
  const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
  );
  
  await client.messages.create({
    from:"whatsapp:+14155238886",
    to:`whatsapp:${phone}`,
    body:message
  });
};

module.exports = sendWhatsappMessage;
