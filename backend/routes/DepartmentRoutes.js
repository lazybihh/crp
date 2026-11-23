const express = require("express");
const Department = require("../models/Department");

const router = express.Router();

// the fixed layouts of the page: always exactly this many
const COLLAGE = 3;
const TILES = 3;
const HIGHLIGHTS = 4;
const LABEL_FIELDS = ["eyebrow", "bannerTagLeft", "bannerTagRight", "breadcrumb", "switcherLabel", "aboutTab", "staffTab", "searchAbout", "searchStaff", "qualificationLabel", "interestLabel", "highlightsEyebrow", "highlightsTitle", "highlightsTitleHighlight", "photoPlaceholder"];

const text = (value) => (typeof value === "string" ? value.trim() : "");
const list = (value) => (Array.isArray(value) ? value.map(text).filter(Boolean) : []);
const fixed = (value, size, make) => Array.from({ length: size }, (_, i) => make((Array.isArray(value) && value[i]) || {}));

// keep only the known fields, in the right shape
function clean(body) {
  const labels = Object.fromEntries(LABEL_FIELDS.map((key) => [key, text(body.labels?.[key])]));
  return {
    labels,
    shortName: text(body.shortName),
    banner: text(body.banner),
    title: text(body.title),
    titleLine2: text(body.titleLine2),
    lead: text(body.lead),
    facts: (Array.isArray(body.facts) ? body.facts : []).map((fact) => ({ text: text(fact.text) })).filter((fact) => fact.text),
    image: text(body.image),
    imageAlt: text(body.imageAlt),
    collage: fixed(body.collage, COLLAGE, (item) => ({ src: text(item.src), alt: text(item.alt) })),
    tiles: fixed(body.tiles, TILES, (item) => ({ value: text(item.value), label: text(item.label) })),
    about: (Array.isArray(body.about) ? body.about : []).map((section, i) => ({
      id: text(section.id) || `section-${i + 1}`,
      title: text(section.title),
      view: ["text", "chips", "list"].includes(section.view) ? section.view : "text",
      wide: Boolean(section.wide),
      paragraphs: list(section.paragraphs),
      items: list(section.items),
      closing: list(section.closing),
    })),
    staff: (Array.isArray(body.staff) ? body.staff : []).map((person) => ({
      name: text(person.name),
      role: text(person.role),
      photo: text(person.photo),
      qualification: text(person.qualification),
      interest: text(person.interest),
      email: text(person.email),
    })),
    highlights: fixed(body.highlights, HIGHLIGHTS, (item) => ({ value: text(item.value), label: text(item.label), image: text(item.image), text: text(item.text) })),
  };
}

// all departments in order (the public pages and the admin editor)
router.get("/", async (req, res) => {
  try {
    res.json(await Department.find().sort({ order: 1 }).lean());
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the departments", error: error.message });
  }
});

// one department
router.get("/:slug", async (req, res) => {
  try {
    const department = await Department.findOne({ slug: req.params.slug }).lean();
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the department", error: error.message });
  }
});

// save one department (the admin editor). Departments cannot be added or deleted here - the 9 pages are fixed.
router.put("/:slug", async (req, res) => {
  try {
    const data = clean(req.body || {});
    if (!data.title) return res.status(400).json({ message: "The title cannot be empty" });
    if (!data.shortName) return res.status(400).json({ message: "The switcher name cannot be empty" });
    const department = await Department.findOneAndUpdate({ slug: req.params.slug }, data, { new: true, runValidators: true }).lean();
    if (!department) return res.status(404).json({ message: "Department not found" });
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: "Failed to save the department", error: error.message });
  }
});

// bring back the starting content of one department
router.post("/:slug/reset", async (req, res) => {
  try {
    const original = Department.startData.find((row) => row.slug === req.params.slug);
    if (!original) return res.status(404).json({ message: "Department not found" });
    const department = await Department.findOneAndUpdate({ slug: req.params.slug }, original, { new: true, upsert: true }).lean();
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: "Failed to restore the department", error: error.message });
  }
});

module.exports = router;