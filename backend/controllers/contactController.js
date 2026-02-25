import nodemailer from "nodemailer";

export const sendMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    // Send email notification only (no database)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const toAddress = process.env.EMAIL_TO || process.env.EMAIL_USER;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      replyTo: email,
      to: toAddress,
      subject: `Portfolio Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });

    res.json({ success: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!", details: error.message });
  }
};
