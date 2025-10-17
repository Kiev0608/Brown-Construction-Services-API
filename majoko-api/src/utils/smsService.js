let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  const twilio = require('twilio');
  twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

exports.sendSms = async (to, body) => {
  if (!twilioClient) {
    console.log(`[sms disabled] Would send SMS to ${to} — ${body}`);
    return;
  }
  try {
    await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
    console.log('SMS sent to', to);
  } catch (err) {
    console.error('SMS error', err.message);
  }
};
