// StudentSupportRoutes.js - the routes of the StudentSupport model (Students pages: Admissions, Academic calendar, Online learning, Helpline, Grievance, E-services).
// Pages cannot be created here: a page must already exist (the model seeds them), so a wrong key gives "not found".
const express = require("express");
const StudentSupport = require("../models/StudentSupport");
const { removeUnused } = require("../utils/uploads");

const router = express.Router();

// every page of this model
router.get("/", async (req, res) => {
  try {
    res.json(await StudentSupport.find().lean());
  } catch (error) {
    res.status(500).json({ message: "Could not load Students content", error: error.message });
  }
});

// one page
router.get("/:key", async (req, res) => {
  try {
    const row = await StudentSupport.findOne({ key: req.params.key }).lean();
    if (!row) return res.status(404).json({ message: "Students page not found" });
    res.json(row);
  } catch (error) {
    res.status(500).json({ message: "Could not load Students page", error: error.message });
  }
});

// save one page (the admin editor); uploads that are no longer used are removed
router.put("/:key", async (req, res) => {
  try {
    const content = req.body?.content;
    if (!content || typeof content !== "object" || Array.isArray(content)) {
      return res.status(400).json({ message: "Content must be an object" });
    }
    const before = await StudentSupport.findOne({ key: req.params.key }).lean();
    if (!before) return res.status(404).json({ message: "Students page not found" });
    const after = await StudentSupport.findOneAndUpdate(
      { key: req.params.key },
      { $set: { content: { ...content, key: req.params.key } } },
      { new: true, runValidators: true }
    );
    await removeUnused(before, after);
    res.json(after);
  } catch (error) {
    res.status(500).json({ message: "Could not save Students page", error: error.message });
  }
});

module.exports = router;
