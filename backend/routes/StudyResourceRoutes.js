const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Resource = require("../models/StudyResource");
const { removeUnused } = require("../utils/uploads");

const router = express.Router();
const folder = path.join(__dirname, "..", "uploads");
fs.mkdirSync(folder, { recursive: true });

const allowed = new Set([".pdf", ".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx", ".txt", ".zip"]);
const upload = multer({
  storage: multer.diskStorage({
    destination: folder,
    filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`),
  }),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(allowed.has(ext) ? null : new Error("Upload a PDF, Word, PowerPoint, Excel, TXT or ZIP file."), allowed.has(ext));
  },
  limits: { fileSize: 30 * 1024 * 1024 },
});

const cleanText = (value) => typeof value === "string" ? value.trim() : "";
function clean(body) {
  return {
    name: cleanText(body.name),
    order: Number(body.order) || 0,
    intro: {
      eyebrow: cleanText(body.intro?.eyebrow),
      title: cleanText(body.intro?.title),
      subtitle: cleanText(body.intro?.subtitle),
      lead: cleanText(body.intro?.lead),
    },
    heroImage: cleanText(body.heroImage),
    aboutLink: cleanText(body.aboutLink),
    related: (Array.isArray(body.related) ? body.related : []).map((item) => ({
      label: cleanText(item.label), text: cleanText(item.text), href: cleanText(item.href),
      to: cleanText(item.to), external: Boolean(item.external),
    })).filter((item) => item.label),
    tabs: (Array.isArray(body.tabs) ? body.tabs : []).map((tab, index) => ({
      id: cleanText(tab.id) || `category-${index + 1}`,
      label: cleanText(tab.label),
      filters: (Array.isArray(tab.filters) ? tab.filters : []).map((filter) => ({
        value: Number(filter.value) || 0,
        label: cleanText(filter.label),
      })).filter((filter) => filter.label),
      files: (Array.isArray(tab.files) ? tab.files : []).map((file) => ({
        name: cleanText(file.name),
        semester: Number(file.semester) || 0,
        file: cleanText(file.file),
        source: cleanText(file.source),
      })).filter((file) => file.name && file.file),
    })).filter((tab) => tab.id && tab.label),
  };
}

router.get("/", async (req, res) => {
  try { res.json(await Resource.find().sort({ order: 1 }).lean()); }
  catch (error) { res.status(500).json({ message: "Could not load study resources", error: error.message }); }
});
router.get("/:slug", async (req, res) => {
  try {
    const row = await Resource.findOne({ slug: req.params.slug }).lean();
    if (!row) return res.status(404).json({ message: "Study resources not found" });
    res.json(row);
  } catch (error) { res.status(500).json({ message: "Could not load study resources", error: error.message }); }
});
router.put("/:slug", async (req, res) => {
  try {
    const before = await Resource.findOne({ slug: req.params.slug });
    if (!before) return res.status(404).json({ message: "Study resources not found" });
    const data = clean(req.body || {});
    if (!data.name) return res.status(400).json({ message: "Department name is required" });
    const after = await Resource.findOneAndUpdate({ slug: req.params.slug }, data, { new: true, runValidators: true }).lean();
    await removeUnused(before, after);
    res.json(after);
  } catch (error) { res.status(500).json({ message: "Could not save study resources", error: error.message }); }
});
router.post("/:slug/reset", async (req, res) => {
  try {
    const original = Resource.startingData.find((item) => item.slug === req.params.slug);
    if (!original) return res.status(404).json({ message: "Study resources not found" });
    const before = await Resource.findOne({ slug: req.params.slug });
    const after = await Resource.findOneAndUpdate({ slug: req.params.slug }, original, { new: true, upsert: true }).lean();
    await removeUnused(before, after);
    res.json(after);
  } catch (error) { res.status(500).json({ message: "Could not reset study resources", error: error.message }); }
});
router.post("/upload", (req, res) => {
  upload.single("file")(req, res, (error) => {
    if (error) return res.status(400).json({ message: error.message });
    if (!req.file) return res.status(400).json({ message: "Choose a file to upload" });
    res.json({ message: "Resource file uploaded", fileUrl: `/uploads/${req.file.filename}`, originalName: req.file.originalname });
  });
});
module.exports = router;
