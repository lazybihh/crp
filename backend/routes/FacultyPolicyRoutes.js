const express = require("express");
const router = express.Router();
const Model = require("../models/FacultyPolicy");

router.get("/", async (req, res) => {
  try { res.json(await Model.find().lean()); }
  catch (error) { res.status(500).json({ message: "Could not load faculty content", error: error.message }); }
});

router.get("/:key", async (req, res) => {
  try {
    const row = await Model.findOne({ key: req.params.key }).lean();
    if (!row) return res.status(404).json({ message: `Faculty content not found for key: ${req.params.key}` });
    return res.json(row);
  } catch (error) {
    return res.status(500).json({ message: "Could not load faculty content", error: error.message });
  }
});

router.put("/:key", async (req, res) => {
  try {
    const content = req.body?.content ?? req.body;
    if (!content || typeof content !== "object" || Array.isArray(content)) {
      return res.status(400).json({ message: "A valid faculty content object is required." });
    }
    const row = await Model.findOneAndUpdate(
      { key: req.params.key },
      { $set: { content } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    ).lean();
    return res.json({ message: "Faculty content saved successfully.", ...row });
  } catch (error) {
    return res.status(400).json({ message: error.message || "Could not save faculty content." });
  }
});

module.exports = router;
