const express = require("express");
const HomeContent = require("../models/HomeContent");
const Notice = require("../models/Notice");
const Facility = require("../models/Facility");

const router = express.Router();
const BOARD_SIZE = 8;

// Home page content for visitors AND the admin editor.
// Besides the saved fields it adds two ready-to-show lists:
//   notices       the chosen notices (or the newest ones when none are chosen)
//   facilityTiles the chosen facilities with the image already picked from the facility's 3 photos
router.get("/", async (req, res) => {
  try {
    // the first time, the record is created from the model's starting content
    const home = (await HomeContent.findOne().lean()) || (await HomeContent.create({})).toObject();

    const ids = home.noticeIds || [];
    let notices;
    if (ids.length) {
      const rows = await Notice.find({ _id: { $in: ids }, published: { $ne: false } }).lean();
      notices = ids.map((id) => rows.find((row) => String(row._id) === String(id))).filter(Boolean);
    } else {
      notices = await Notice.find({ published: { $ne: false } }).sort({ date: -1, order: 1 }).limit(BOARD_SIZE).lean();
    }

    const tiles = home.facilities || [];
    const facilities = await Facility.find({ _id: { $in: tiles.map((tile) => tile.facility) } }).lean();
    const facilityTiles = tiles
      .map((tile) => {
        const facility = facilities.find((item) => String(item._id) === String(tile.facility));
        if (!facility) return null;
        return {
          id: facility.slug,
          name: tile.name || facility.label,
          text: tile.text || "",
          image: facility.photos[tile.photo] || facility.photos[0] || "",
        };
      })
      .filter(Boolean);

    res.json({ ...home, notices, facilityTiles });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Home Page content", error: error.message });
  }
});

// What the admin can choose from: every notice and every facility that exists on their own pages.
router.get("/options", async (req, res) => {
  try {
    const notices = await Notice.find({ published: { $ne: false } }).sort({ order: 1 }).select("title category date file").lean();
    const facilities = await Facility.find().select("slug label photos").lean();
    res.json({ notices, facilities });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the choices", error: error.message });
  }
});

// Save the Home page (the admin editor sends the whole page).
router.put("/", async (req, res) => {
  try {
    const { notices, facilityTiles, _id, __v, createdAt, updatedAt, ...fields } = req.body; // the extra lists are never stored
    const home = await HomeContent.findOneAndUpdate({}, { $set: fields }, { new: true, upsert: true, runValidators: true });
    res.json({ message: "Home Page updated successfully", home });
  } catch (error) {
    res.status(500).json({ message: "Failed to update Home Page", error: error.message });
  }
});

module.exports = router;