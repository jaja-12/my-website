import nodemailer from "nodemailer";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const submissionTracker = new Map();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const looksLikePlaceholder = (value) =>
  typeof value !== "string" ||
  value.trim() === "" ||
  /your[_-]|example\.com|placeholder|change[_-]?me|insert[_-]?here/i.test(value);

const getClientIp = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.ip || req.socket.remoteAddress || "unknown";
};

const isRateLimited = (ip) => {
  const now = Date.now();
  const entry = submissionTracker.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    submissionTracker.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  entry.count += 1;
  submissionTracker.set(ip, entry);
  return false;
};

export const sendMessage = async (req, res) => {
  const { name, email, message, website } = req.body;
  const trimmedName = typeof name === "string" ? name.trim() : "";
  const trimmedEmail = typeof email === "string" ? email.trim() : "";
  const trimmedMessage = typeof message === "string" ? message.trim() : "";
  const honeypot = typeof website === "string" ? website.trim() : "";
  const clientIp = getClientIp(req);

  if (honeypot) {
    return res.status(200).json({ success: "Message sent successfully!" });
  }

  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  if (trimmedName.length < 2 || trimmedName.length > 80) {
    return res.status(400).json({ error: "Name must be between 2 and 80 characters." });
  }

  if (!EMAIL_PATTERN.test(trimmedEmail) || trimmedEmail.length > 120) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  if (trimmedMessage.length < 10 || trimmedMessage.length > 2000) {
    return res.status(400).json({ error: "Message must be between 10 and 2000 characters." });
  }

  try {
    if (
      looksLikePlaceholder(process.env.EMAIL_USER) ||
      looksLikePlaceholder(process.env.EMAIL_PASS) ||
      looksLikePlaceholder(process.env.EMAIL_TO)
    ) {
      return res.status(503).json({
        error:
          "The contact form is temporarily unavailable. Please email me directly or reach out via GitHub."
      });
    }

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
      replyTo: trimmedEmail,
      to: toAddress,
      subject: `Portfolio Contact from ${trimmedName}`,
      text: `Name: ${trimmedName}\nEmail: ${trimmedEmail}\nIP: ${clientIp}\n\nMessage:\n${trimmedMessage}`
    });

    res.json({ success: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact form email error:", error);
    res.status(500).json({ error: "Something went wrong while sending your message." });
  }
};
