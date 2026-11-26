const express = require("express");
const mongoose = require("mongoose");
const Enquiry = require("../models/Enquiry");

const router = express.Router();
const complaintKinds = {
  "anti-ragging": "Anti-ragging complaint",
  "anti-sexual-harassment": "Anti-sexual harassment complaint",
};
const text = (value) => String(value ?? "").trim();
const limits = new Map();
const statuses = ["new", "read", "replied", "archived"];
const cleanupLimit = (key, now) => {
  const timestamps = (limits.get(key) || []).filter((time) => now - time < 60 * 60 * 1000);
  if (timestamps.length) limits.set(key, timestamps);
  else limits.delete(key);
  return timestamps;
};

// 5 messages per hour for the same phone number (enquiries) and for the same IP address (all forms).
const tooMany = (req, extraKey) => {
  const ip = req.ip || req.socket?.remoteAddress || "unknown";
  const now = Date.now();
  const keys = [extraKey, `ip:${ip}`].filter(Boolean);
  if (keys.some((key) => cleanupLimit(key, now).length >= 5)) return true;
  keys.forEach((key) => limits.set(key, [...cleanupLimit(key, now), now]));
  return false;
};

router.post("/", async (req, res) => {
  try {
    if (text(req.body?.website)) return res.status(201).json({ message: "Message sent successfully" });

    const name = text(req.body?.name).slice(0, 100);
    const phone = text(req.body?.phone).replace(/[^\d]/g, "");
    const email = text(req.body?.email).slice(0, 150);
    const role = text(req.body?.role).slice(0, 100);
    const department = text(req.body?.department).slice(0, 100);
    const topic = text(req.body?.topic).slice(0, 100);
    const message = text(req.body?.message).slice(0, 1000);

    if (!name) return res.status(400).json({ message: "Enter your name." });
    if (phone.length < 10 || phone.length > 13) return res.status(400).json({ message: "Enter a phone number with at least 10 digits." });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: "Enter a valid email address, or leave it empty." });
    if (message.length < 10) return res.status(400).json({ message: "Write your message (at least 10 characters)." });

    if (tooMany(req, `phone:${phone}`)) return res.status(429).json({ message: "Too many enquiries. Please try again later." });

    await Enquiry.create({ name, phone: text(req.body?.phone).slice(0, 50), email, role, department, topic, message, status: "new" });
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(400).json({ message: "Please check the enquiry details and try again." });
  }
});

// The two complaint forms (Faculty > Anti-Ragging and Anti-Sexual Harassment). Name and contact are optional.
router.post("/complaint", async (req, res) => {
  try {
    if (text(req.body?.website)) return res.status(201).json({ message: "Complaint submitted successfully" });

    const kind = text(req.body?.kind);
    if (!complaintKinds[kind]) return res.status(400).json({ message: "Unknown complaint form." });
    const message = text(req.body?.description).slice(0, 3000);
    if (message.length < 10) return res.status(400).json({ message: "Describe the concern (at least 10 characters)." });
    if (tooMany(req)) return res.status(429).json({ message: "Too many submissions. Please try again later." });

    await Enquiry.create({
      kind,
      topic: complaintKinds[kind],
      name: text(req.body?.fullName).slice(0, 100) || "Anonymous",
      role: text(req.body?.relationship).slice(0, 100),
      department: text(req.body?.department).slice(0, 100),
      contact: text(req.body?.contact).slice(0, 150),
      incidentDate: text(req.body?.incidentDate).slice(0, 20),
      location: text(req.body?.location).slice(0, 200),
      involved: text(req.body?.involved || req.body?.respondent).slice(0, 300),
      contactPreference: text(req.body?.contactPreference).slice(0, 50),
      message,
      status: "new",
    });
    res.status(201).json({ message: "Complaint submitted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Please check the details and try again." });
  }
});

router.get("/", async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();
    res.json(enquiries);
  } catch (error) {
    res.status(500).json({ message: "Failed to load enquiries" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Enquiry not found" });
    const status = text(req.body?.status);
    if (!statuses.includes(status)) return res.status(400).json({ message: "Invalid enquiry status" });
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true, runValidators: true });
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json({ message: "Enquiry status updated", enquiry });
  } catch (error) {
    res.status(400).json({ message: "Failed to update the enquiry" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Enquiry not found" });
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });
    res.json({ message: "Enquiry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete the enquiry" });
  }
});

module.exports = router;
