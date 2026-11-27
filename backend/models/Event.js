const mongoose = require("mongoose");

// Everything the Events page stores, in this one file: ONE row per event (src/pages/events/Events.jsx).
// The page-level banner is stored in the EventsPage model below.
//   title      required
//   kind       "Event" or "Activity" (a label on the card)
//   date       optional, "YYYY-MM-DD" or "". Dated events are sorted newest first; a future date gets an "Upcoming" badge on the page.
//   place      optional      text   optional short description
//   photo      one picture: "/uploads/xxx.jpg" (uploaded in the admin) or "/images/xxx.jpg" (website folder). "" = "Photo coming soon" tile.
//   order      position among events without a date (a new event gets the smallest number, so it comes first)
//   published  false = hidden from visitors, still in the admin
// (Events.jsx keeps a copy of the same starting list to show while loading or when the server is down - keep them in step.)
const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    kind: { type: String, enum: ["Event", "Activity"], default: "Event" },
    date: { type: String, default: "" },
    place: { type: String, default: "" },
    text: { type: String, default: "" },
    photo: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// The events of the Events page today (taken from Events.jsx). They are added once, when the collection is empty.
const events = [
  {"title":"Orientation Program 2025","kind":"Event","date":"","place":"","text":"","photo":"/images/orientation-2025.jpg","order":1,"published":true},
  {"title":"Rangoli Competition","kind":"Activity","date":"","place":"","text":"","photo":"/images/rangoli.jpg","order":2,"published":true},
  {"title":"एनसीसी प्रथम वर्ष के लिए चयन प्रक्रिया","kind":"Activity","date":"","place":"","text":"","photo":"/images/ncc-selection.jpg","order":3,"published":true}
];

// 1) empty collection -> add the starting events.
// 2) a collection that already has rows -> only add the fields a row does not have yet. Nothing that was saved is overwritten.
EventSchema.statics.seed = async function () {
  if (!(await this.countDocuments())) {
    await this.insertMany(events);
    console.log(`Events added: ${events.length}`);
    return;
  }
  await this.updateMany({ published: { $exists: false } }, { $set: { published: true } });
  await this.updateMany({ order: { $exists: false } }, { $set: { order: 0 } });
};

const Event = mongoose.model("Event", EventSchema);

const EventsPageSchema = new mongoose.Schema(
  {
    bannerImage: { type: String, default: "/images/campus-3.jpg" },
  },
  { timestamps: true }
);

EventsPageSchema.statics.seed = async function () {
  if (!(await this.countDocuments())) {
    await this.create({});
    return;
  }
  await this.updateOne({ bannerImage: { $exists: false } }, { $set: { bannerImage: "/images/campus-3.jpg" } });
};

const EventsPage = mongoose.model("EventsPage", EventsPageSchema);

module.exports = Event;
module.exports.EventsPage = EventsPage;
