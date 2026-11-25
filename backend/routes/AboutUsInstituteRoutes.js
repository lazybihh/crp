// AboutUsInstituteRoutes.js - the routes of the AboutUsInstitute model (History, Principal message, Rank & accreditation, Alumni).
// Pages cannot be created here: a page must already exist (the model seeds them), so a wrong key gives "not found".
const express = require("express");
const AboutUsInstitute = require("../models/AboutUsInstitute");

const router = express.Router();

// every page of this model
router.get("/", async (req, res) => {
  try {
    res.json(await AboutUsInstitute.find().lean());
  } catch (error) {
    res.status(500).json({ message: "Could not load About Us content", error: error.message });
  }
});

// one page
router.get("/:key", async (req, res) => {
  try {
    const row = await AboutUsInstitute.findOne({ key: req.params.key }).lean();
    if (!row) return res.status(404).json({ message: `About Us content not found for key: ${req.params.key}` });
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: "Could not load About Us content", error: error.message });
  }
});

// save one page (the admin editor)
router.put("/:key", async (req, res) => {
  try {
    const content = req.body?.content ?? req.body;
    if (!content || typeof content !== "object" || Array.isArray(content)) {
      return res.status(400).json({ message: "A valid content object is required." });
    }
    const row = await AboutUsInstitute.findOneAndUpdate(
      { key: req.params.key },
      { $set: { content: { ...content, key: req.params.key } } },
      { new: true, runValidators: true }
    ).lean();
    if (!row) return res.status(404).json({ message: `About Us content not found for key: ${req.params.key}` });
    res.json({ message: "About Us content saved successfully.", ...row });
  } catch (error) {
    res.status(400).json({ message: error.message || "Could not save About Us content." });
  }
});

module.exports = router;
