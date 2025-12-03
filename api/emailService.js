// === api/emailService.js ===
const nodemailer =  require("nodemailer");

const  sendEmail =  async function({to, subject, text, html}) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.BREVO_SMTP_SERVER,
      port: process.env.BREVO_SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_LOGIN,
        pass: process.env.BREVO_SMTP_KEY
      }
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"IBC Tank" <ibctank.team@gmail.com>`,
      to,
      subject,
      text,
      html
    });

    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

module.exports = {
  sendEmail
};
