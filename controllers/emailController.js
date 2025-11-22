import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
export const sendEmail = async (req, res) => {
  try {
    const { name, email, service, message } = req.body;

    if (!name || !email || !service || !message) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    // Mail options
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: "digitallab514@gmail.com",
      subject: `New Service Request: ${service}`,
      html: `
        <h2>New Inquiry from Digital Lab Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message||"Failed to send email" });
  }
};
