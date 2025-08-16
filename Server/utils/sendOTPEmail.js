const nodemailer = require('nodemailer');

const sendOTPEmail = async (email, otp) => {
  try {
        console.log(`[Email] Sending OTP to ${email}`);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // from .env
        pass: process.env.EMAIL_PASS  // app password
      }
    });

    const mailOptions = {
      from: `"SafeTrack OTP" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      html: `<h2>Your OTP is: ${otp}</h2><p>Soon Your OTP Will Be Expired.</p>`
    };

    await transporter.sendMail(mailOptions);
    console.log(` OTP sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send OTP:`, error);
    throw error;
  }
};

module.exports = sendOTPEmail;
