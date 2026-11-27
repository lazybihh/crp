const express = require("express");
const mongoose = require("mongoose");
const Facility = require("../models/Facility");
const { FacilitiesPage } = Facility; // both models live in models/Facility.js
const HomeContent = require("../models/HomeContent");
const { removeUnused } = require("../utils/uploads");

const router = express.Router();

const text = (value) => String(value ?? "").trim();
const list = (value) => (Array.isArray(value) ? value : []).map(text).filter(Boolean);
const pairs = (value, first, second) =>
  (Array.isArray(value) ? value : []).map((item) => ({ [first]: text(item?.[first]), [second]: text(item?.[second]) })).filter((item) => item[first] || item[second]);
const validBanner = (value) => value === "" || /^\/(?:images|uploads)\/[A-Za-z0-9._/-]+$/.test(value) || /^https:\/\/\S+$/i.test(value);

// Facilities page content for visitors AND the admin editor: { page, facilities }.
router.get("/", async (req, res) => {
  try {
    // the first time, the page text is created from the model's starting content
    const page = (await FacilitiesPage.findOne().lean()) || (await FacilitiesPage.create({})).toObject();
    const facilities = await Facility.find().sort({ order: 1, _id: 1 }).lean();
    res.json({ page, facilities });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the Facilities page", error: error.message });
  }
});

// Save the page-level text (title block, number cards, headings, labels).
router.put("/page", async (req, res) => {
  try {
    const { intro, stats, explore, panel, closingStats } = req.body;
    const fields = {
      intro: { eyebrow: text(intro?.eyebrow), title: text(intro?.title), lead: text(intro?.lead) },
      stats: pairs(stats, "value", "label"),
      explore: { eyebrow: text(explore?.eyebrow), titleStart: text(explore?.titleStart), titleHighlight: text(explore?.titleHighlight) },
      panel: { aboutHeading: text(panel?.aboutHeading), factsHeading: text(panel?.factsHeading), photoPlaceholder: text(panel?.photoPlaceholder) },
      closingStats: pairs(closingStats, "value", "label"),
    };
    const page = await FacilitiesPage.findOneAndUpdate({}, { $set: fields }, { new: true, upsert: true, runValidators: true });
    res.json({ message: "Facilities page text updated successfully", page });
  } catch (error) {
    res.status(500).json({ message: "Failed to update the Facilities page text", error: error.message });
  }
});

router.put("/page/banner", async (req, res) => {
  try {
    const image = typeof req.body?.image === "string" ? req.body.image.trim() : null;
    if (image === null || !validBanner(image)) return res.status(400).json({ message: "Choose an image path, an https:// address, or use the default banner." });
    const before = await FacilitiesPage.findOne();
    const page = await FacilitiesPage.findOneAndUpdate(
      {},
      { $set: { bannerImage: image || "/images/campus-2.jpg" } },
      { new: true, upsert: true, runValidators: true }
    );
    await removeUnused(before, page);
    res.json({ message: "Facilities banner updated successfully", page });
  } catch (error) {
    res.status(500).json({ message: "Failed to update the Facilities banner", error: error.message });
  }
});

// Edit one facility. Only its text and its 3 photo slots can change (the slug and the icon never change, and the number of photos stays 3).
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Facility not found" });
    const { label, headline, text: description, points, more, facts, photos } = req.body;
    if (!text(label)) return res.status(400).json({ message: "The facility needs a tab name." });

    const update = {
      label: text(label),
      headline: text(headline),
      text: text(description),
      points: list(points).slice(0, 8),
      more: list(more).slice(0, 6),
      facts: pairs(facts, "label", "value").slice(0, 6),
      photos: [0, 1, 2].map((index) => text(Array.isArray(photos) ? photos[index] : "")), // always exactly 3 slots, an empty one shows "Photo coming soon"
    };
    const before = await Facility.findById(req.params.id);
    if (!before) return res.status(404).json({ message: "Facility not found" });
    const facility = await Facility.findByIdAndUpdate(req.params.id, { $set: update }, { new: true, runValidators: true });
    if (!facility) return res.status(404).json({ message: "Facility not found" });
    await removeUnused(before, facility);
    res.json({ message: "Facility updated successfully", facility });
  } catch (error) {
    res.status(500).json({ message: "Failed to update the facility", error: error.message });
  }
});

// Delete one facility. Home page tiles that pointed to it are removed too, so the Home page never shows a broken tile.
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: "Facility not found" });
    const before = await Facility.findById(req.params.id);
    if (!before) return res.status(404).json({ message: "Facility not found" });
    const facility = await Facility.findByIdAndDelete(req.params.id);
    if (!facility) return res.status(404).json({ message: "Facility not found" });
    await HomeContent.updateMany({}, { $pull: { facilities: { facility: facility._id } } });
    await removeUnused(before, {});
    res.json({ message: "Facility deleted successfully", id: facility._id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete the facility", error: error.message });
  }
});

module.exports = router;