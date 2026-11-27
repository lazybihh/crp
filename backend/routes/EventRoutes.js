const express = require("express");
const mongoose = require("mongoose");
const Event = require("../models/Event");
const { EventsPage } = Event;
const { removeUnused } = require("../utils/uploads");

const router = express.Router();

const text = (value) => String(value ?? "").trim();
const KINDS = ["Event", "Activity"];
const validBanner = (value) => value === "" || /^\/(?:images|uploads)\/[A-Za-z0-9._/-]+$/.test(value) || /^https:\/\/\S+$/i.test(value);

// Same order as the page: dated events newest first, then the rest by their position.
const sortRows = (rows) =>
  rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => (b.row.date || "").localeCompare(a.row.date || "") || (a.row.order ?? 0) - (b.row.order ?? 0) || a.index - b.index)
    .map((entry) => entry.row);

// "2025-07-31" -> true; "2025-02-30" or "31/07/2025" -> false. An empty date is allowed.
const validDate = (value) => {
  if (!value) return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
};

router.get("/page/banner", async (req, res) => {
  try {
    const page = (await EventsPage.findOne().lean()) || { bannerImage: "/images/campus-3.jpg" };
    res.json({ page });
  } catch (error) {
    res.status(500).json({ message: "Failed to load the Events banner", error: error.message });
  }
});

router.put("/page/banner", async (req, res) => {
  try {
    const image = typeof req.body?.image === "string" ? req.body.image.trim() : null;
    if (image === null || !validBanner(image)) return res.status(400).json({ message: "Choose an image path, an https:// address, or use the default banner." });
    const before = await EventsPage.findOne();
    const page = await EventsPage.findOneAndUpdate(
      {},
      { $set: { bannerImage: image || "/images/campus-3.jpg" } },
      { new: true, upsert: true, runValidators: true }
    );
    await removeUnused(before, page);
    res.json({ message: "Events banner updated successfully", page });
  } catch (error) {
    res.status(500).json({ message: "Failed to update the Events banner", error: error.message });
  }
});

// Read and check the fields of one event. Returns { error } or { fields }. The id, order and timestamps are never taken from the request.
const readFields = (body) => {
  const title = text(body?.title).slice(0, 200);
  if (!title) return { error: "The event needs a title." };
  const kind = KINDS.includes(body?.kind) ? body.kind : "Event";
  const date = text(body?.date);
  if (!validDate(date)) return { error: "The date must be a real date (year-month-day)." };
  const photo = text(body?.photo);
  if (photo && !/^(\/|https:\/\/)/.test(photo)) return { error: "The photo is not a valid picture path." };
  return {
    fields: {
      title,
      kind,
      date,
      place: text(body?.place).slice(0, 200),
      text: text(body?.text).slice(0, 800),
      photo,
      published: body?.published !== false,
    },
  };
};

// Events for visitors: only the published ones, in page order.
router.get("/", async (req, res) => {
  try {
    const rows = await Event.find({ published: { $ne: false } }).lean();
    res.json({ events: sortRows(rows) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
});

// Events for the admin editor: all of them, hidden ones too. (Fixed path BEFORE "/:id".)
router.get("/all", async (req, res) => {
  try {
    const rows = await Event.find().lean();
    res.json({ events: sortRows(rows) });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch events", error: error.message });
  }
});

// Add an event. It gets the smallest position, so it appears first among events without a date.
router.post("/", async (req, res) => {
  try {
    const { error, fields } = readFields(req.body);
    if (error) return res.status(400).json({ message: error });
    const first = await Event.findOne().sort({ order: 1 }).lean();
    const event = await Event.create({ ...fields, order: first ? (first.order ?? 0) - 1 : 1 });
    res.status(201).json({ message: "Event added successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Failed to add the event", error: error.message });
  }
});

// Edit one event.
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Event not found" });
    const { error, fields } = readFields(req.body);
    if (error) return res.status(400).json({ message: error });
    const before = await Event.findById(req.params.id);
    if (!before) return res.status(404).json({ message: "Event not found" });
    const event = await Event.findByIdAndUpdate(req.params.id, { $set: fields }, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    await removeUnused(before, event);
    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Failed to update the event", error: error.message });
  }
});

// Delete one event. No other page uses events, so nothing else needs cleaning.
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Event not found" });
    const before = await Event.findById(req.params.id);
    if (!before) return res.status(404).json({ message: "Event not found" });
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    await removeUnused(before, {});
    res.json({ message: "Event deleted successfully", id: event._id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete the event", error: error.message });
  }
});

module.exports = router;
