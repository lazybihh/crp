const express = require("express");
const HomeContent = require("../models/HomeContent");
const Notice = require("../models/Notice");
const Facility = require("../models/Facility");
const Event = require("../models/Event");
const AboutUsInstitute = require("../models/AboutUsInstitute");

const router = express.Router();
const BOARD_SIZE = 8;
const getLatestNotices = () =>
  Notice.find({ published: { $ne: false } }).sort({ date: -1, order: 1, createdAt: -1 }).limit(BOARD_SIZE).lean();

// Home page content for visitors AND the admin editor.
// Besides the saved fields it adds two ready-to-show lists:
//   notices       the chosen notices (or the newest ones when none are chosen)
//   facilityTiles the chosen facilities with the image already picked from the facility's 3 photos
router.get("/", async (req, res) => {
  try {
    // the first time, the record is created from the model's starting content
    let home = (await HomeContent.findOne().lean()) || (await HomeContent.create({})).toObject();
    // Update the old built-in sample images while preserving any Admin-selected images.
    const defaultImageUpdates = {};
    if (home.highlights?.some((panel) => panel.id === "events" && panel.image === "/images/events.jpg")) {
      defaultImageUpdates["highlights.$[events].image"] = "/images/orientation-2025.jpg";
    }
    if (home.highlights?.some((panel) => panel.id === "placement" && panel.image === "/images/placement-activities.jpg")) {
      defaultImageUpdates["highlights.$[placement].image"] = "/images/facilities/placement-cell-1.jpg";
    }
    if (home.highlights?.some((panel) => panel.id === "achievements" && panel.image === "/images/achievements.jpg")) {
      defaultImageUpdates["highlights.$[achievements].image"] = "https://crprohtak.ac.in/media/Gallery/ade1a472-4615-4c38-972b-32ad8c05afa2.jpeg";
    }
    if (Object.keys(defaultImageUpdates).length) {
      const arrayFilters = [];
      if (defaultImageUpdates["highlights.$[events].image"]) arrayFilters.push({ "events.id": "events", "events.image": "/images/events.jpg" });
      if (defaultImageUpdates["highlights.$[placement].image"]) arrayFilters.push({ "placement.id": "placement", "placement.image": "/images/placement-activities.jpg" });
      if (defaultImageUpdates["highlights.$[achievements].image"]) arrayFilters.push({ "achievements.id": "achievements", "achievements.image": "/images/achievements.jpg" });
      await HomeContent.updateOne({ _id: home._id }, { $set: defaultImageUpdates }, { arrayFilters });
      home = await HomeContent.findById(home._id).lean();
    }

    const principalPage = await AboutUsInstitute.findOne({ key: "principal-message" }).lean();
    const principal = principalPage?.content?.principal;
    const ids = home.noticeIds || [];
    let notices;
    if (ids.length) {
      const rows = await Notice.find({ _id: { $in: ids }, published: { $ne: false } }).lean();
      notices = ids.map((id) => rows.find((row) => String(row._id) === String(id))).filter(Boolean);
      if (notices.length === 0) {
        notices = await getLatestNotices();
      }
    } else {
      notices = await getLatestNotices();
    }

    const tiles = home.facilities || [];
    const facilities = await Facility.find({ _id: { $in: tiles.map((tile) => tile.facility) } }).lean();
    const facilityTiles = tiles
      .map((tile) => {
        const facility = facilities.find((item) => String(item._id) === String(tile.facility));
        if (!facility) return null;
        return {
          id: facility.slug,
          name: facility.label,
          text: tile.text || "",
          image: facility.photos[0] || "",
        };
      })
      .filter(Boolean);

    const eventIds = home.eventIds || [];
    const eventRows = eventIds.length ? await Event.find({ _id: { $in: eventIds }, published: { $ne: false } }).lean() : [];
    const selectedEvents = eventIds.map((id) => eventRows.find((row) => String(row._id) === String(id))).filter(Boolean);
    const highlights = (home.highlights || []).map((panel) => panel.id === "events" ? {
      ...panel,
      items: selectedEvents.map((event) => ({ date: event.date || event.kind || "", text: event.title, photo: event.photo || "" })),
      image: selectedEvents[0]?.photo || panel.image,
    } : panel);
    res.json({ ...home, principal: principal ? { eyebrow: "From the Principal's desk", ...principal, link: { label: "Read the full message", to: "/about/principal-message" } } : home.principal, highlights, notices, facilityTiles });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch Home Page content", error: error.message });
  }
});

// What the admin can choose from: every notice and every facility that exists on their own pages.
router.get("/options", async (req, res) => {
  try {
    const notices = await Notice.find({ published: { $ne: false } })
      .sort({ date: -1, order: 1, createdAt: -1 })
      .select("title category date file")
      .lean();
    const latestNotices = notices.slice(0, BOARD_SIZE);
    const facilities = await Facility.find().sort({ order: 1, _id: 1 }).select("slug label photos").lean();
    const events = await Event.find({ published: { $ne: false } }).sort({ date: -1, order: 1 }).select("title kind date photo").lean();
    res.json({ notices, latestNotices, facilities, events });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch the choices", error: error.message });
  }
});

// Save the Home page (the admin editor sends the whole page).
router.put("/", async (req, res) => {
  try {
    const { notices, facilityTiles, principal, _id, __v, createdAt, updatedAt, ...fields } = req.body; // the extra lists are never stored
    const home = await HomeContent.findOneAndUpdate({}, { $set: fields }, { new: true, upsert: true, runValidators: true });
    res.json({ message: "Home Page updated successfully", home });
  } catch (error) {
    res.status(500).json({ message: "Failed to update Home Page", error: error.message });
  }
});

module.exports = router;
