const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Notice = require("../models/Notice");
const { NoticePage } = Notice;

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads");

fs.mkdirSync(uploadDir, { recursive: true });

const allowed = new Set([
  ".pdf", ".doc", ".docx", ".xls", ".xlsx",
  ".csv", ".ppt", ".pptx", ".txt", ".rtf",
  ".odt", ".ods", ".odp", ".jpg", ".jpeg",
  ".png", ".webp"
]);

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    cb(
      null,
      `notice-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`
    );
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) =>
    allowed.has(path.extname(file.originalname).toLowerCase())
      ? cb(null, true)
      : cb(new Error("Unsupported file type. Upload PDF, Office, text, CSV or image files."))
});

const safeDelete = async (url) => {
  if (!url || !url.startsWith("/uploads/")) return;

  const name = path.basename(url);

  if (!name.startsWith("notice-")) return;

  if (await Notice.exists({ file: url })) return;
  if (await NoticePage.exists({ banner: url })) return;

  const target = path.join(uploadDir, name);

  if (fs.existsSync(target)) {
    fs.unlinkSync(target);
  }
};

const clean = (body) => ({
  title: String(body.title || "").trim(),
  category: body.category || "other",
  file: body.file || "",
  date: body.date || "",
  note: body.note || "",
  published: body.published !== false
});


// Get published notices for public page.
router.get("/", async (_req, res) => {
  try {
    const notices = await Notice.find({ published: true })
      .sort({ date: -1, order: 1, createdAt: -1 });

    res.json({ notices });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


// Get all notices for admin.
router.get("/all", async (_req, res) => {
  try {
    const notices = await Notice.find()
      .sort({ order: 1, createdAt: -1 });

    res.json({ notices });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


// Upload notice file.
router.post("/upload", (req, res) =>
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Choose a file first." });
    }

    res.json({
      fileUrl: `/uploads/${req.file.filename}`,
      originalName: req.file.originalname
    });
  })
);


// Get Notices page content.
router.get("/page", async (_req, res) => {
  try {
    let page = await NoticePage.findOne();

    if (!page) {
      page = await NoticePage.create({});
    }

    res.json({ page });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});


// Update Notices page content.
router.put("/page", async (req, res) => {
  try {
    let page = await NoticePage.findOne();

    if (!page) {
      page = new NoticePage();
    }

    const oldBanner = page.banner;

    const fields = [
      "banner",
      "eyebrow",
      "title",
      "lead",
      "leftTag",
      "rightTag",
      "glanceTitle",
      "noticesLabel",
      "activitiesLabel",
      "latestLabel",
      "browseEyebrow",
      "listTitle",
      "searchPlaceholder",
      "helpTitle",
      "helpText",
      "homeBreadcrumb",
      "noticesBreadcrumb",
      "allLabel",
      "chooseCategoryLabel",
      "fileMissingLabel",
      "openFileLabel",
      "emptyMessage",
      "showMoreLabel",
      "showingLabel",
      "categoryAdmissions",
      "categoryExams",
      "categoryScholarships",
      "categoryEvents",
      "categoryTenders",
      "categoryOther",
      "published"
    ];

    fields.forEach((key) => {
      if (req.body[key] !== undefined) {
        page[key] = req.body[key];
      }
    });

    await page.save();

    if (req.body.banner !== undefined && oldBanner !== page.banner) {
      await safeDelete(oldBanner);
    }

    res.json({ page });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});


// Create notice.
router.post("/", async (req, res) => {
  try {
    const data = clean(req.body);

    if (!data.title) {
      return res.status(400).json({
        message: "Notice title is required."
      });
    }

    const notice = await Notice.create({
      ...data,
      order: -Date.now()
    });

    res.status(201).json({ notice });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});


// Update notice.
router.put("/:id", async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found."
      });
    }

    const oldFile = notice.file;

    Object.assign(
      notice,
      clean({ ...notice.toObject(), ...req.body })
    );

    await notice.save();

    if (req.body.file !== undefined && oldFile !== notice.file) {
      await safeDelete(oldFile);
    }

    res.json({ notice });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});


// Delete notice.
router.delete("/:id", async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({
        message: "Notice not found."
      });
    }

    await safeDelete(notice.file);

    res.json({ message: "Notice deleted." });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;