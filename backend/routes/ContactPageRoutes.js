const express = require("express");
const ContactPage = require("../models/ContactPage");

const router = express.Router();
const text = (value) => String(value ?? "").trim();
const { removeUnused } = require("../utils/uploads");
const validBanner = (value) => value === "" || /^\/(?:images|uploads)\/[A-Za-z0-9._/-]+$/.test(value) || /^https:\/\/\S+$/i.test(value);

router.get("/", async (req, res) => {
  try {
    const page = (await ContactPage.findOne().lean()) || (await ContactPage.create({})).toObject();
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: "Failed to load the Contact page" });
  }
});

router.put("/banner", async (req, res) => {
  try {
    const image = typeof req.body?.image === "string" ? req.body.image.trim() : null;
    if (image === null || !validBanner(image)) return res.status(400).json({ message: "Choose an image path, an https:// address, or use the default banner." });
    const before = await ContactPage.findOne();
    const page = await ContactPage.findOneAndUpdate(
      {},
      { $set: { bannerImage: image || "/images/pages-banner.png" } },
      { new: true, upsert: true, runValidators: true }
    );
    await removeUnused(before, page);
    res.json({ message: "Contact banner updated successfully", page });
  } catch (error) {
    res.status(500).json({ message: "Failed to update the Contact banner", error: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const body = req.body || {};
    const intro = body.intro || {};
    const topics = (Array.isArray(body.topics) ? body.topics : []).map(text).filter(Boolean).slice(0, 8);
    const fields = {
      intro: {
        eyebrow: text(intro.eyebrow),
        title: text(intro.title),
        lead: text(intro.lead),
      },
      topics,
    };
    const page = await ContactPage.findOneAndUpdate({}, { $set: fields }, { new: true, upsert: true, runValidators: true });
    res.json({ message: "Contact page updated successfully", page });
  } catch (error) {
    res.status(400).json({ message: "Failed to update the Contact page" });
  }
});

module.exports = router;
