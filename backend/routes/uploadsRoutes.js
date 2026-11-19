const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const folder = path.join(__dirname, "..", "uploads");
fs.mkdirSync(folder, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: folder,
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname).toLowerCase()}`);
    },
  }),
  fileFilter: (req, file, cb) => cb(file.mimetype.startsWith("image/") ? null : new Error("Only image files are allowed!"), file.mimetype.startsWith("image/")),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Upload one image -> { imageUrl: "/uploads/123.jpg" }
router.post("/", (req, res) => {
  upload.single("image")(req, res, (error) => {
    if (error) return res.status(400).json({ message: error.message });
    if (!req.file) return res.status(400).json({ message: "Please select an image" });
    res.json({ message: "Image uploaded successfully", imageUrl: `/uploads/${req.file.filename}` });
  });
});

module.exports = router;