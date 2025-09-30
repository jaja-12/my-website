import nodemailer from "nodemailer";
import Message from "../models/message.js";

export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    // Save message to MongoDB
    const newMessage = new Message({ name, email, message });
    await newMessage.save();

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER, 
      subject: `Portfolio Contact from ${name}`,
      text: message,
    });

    res.json({ success: "Message saved and sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!", details: error.message });
  }
};
