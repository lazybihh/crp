const mongoose = require("mongoose");

// Everything editable on the Home page (one document). Icons and the banner tags stay in the code.
// Images are saved as "/uploads/xxx.jpg" (uploaded) or "/images/xxx.jpg" (already in the website's public folder).
const HomeContentSchema = new mongoose.Schema(
  {
    banners: [{ image: String, alt: String }],

    sectionContent: {
      whyChooseUs: { eyebrow: String, title: String, description: String },
      leadership: { eyebrow: String, title: String },
      notices: { eyebrow: String, title: String },
      highlights: { eyebrow: String, title: String },
      facilities: { eyebrow: String, title: String, description: String },
      courses: { eyebrow: String, title: String, description: String },
      recruiters: { eyebrow: String, title: String },
    },

    latestNews: [{ text: String, lang: String, to: String }],
    stats: [{ value: String, label: String }],
    reasons: [{ title: String, text: String }],

    principal: {
      eyebrow: String,
      quote: String,
      paragraphs: [String],
      name: String,
      role: String,
      photo: String,
      link: { label: String, to: String },
    },

    news: { tag: String, title: String, text: String, image: String },

    dignitaries: [{ name: String, role: String, text: String, image: String, initials: String }],

    // notices shown on the Home board: only rows that already exist on the Notices page, in this order
    noticeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notice" }],

    // facility tiles: a facility of the Facilities page + which of its 3 photos (0, 1 or 2) + the tile's own text
    facilities: [
      {
        facility: { type: mongoose.Schema.Types.ObjectId, ref: "Facility" },
        photo: { type: Number, default: 0, min: 0, max: 2 },
        name: String,
        text: String,
      },
    ],

    highlights: [
      {
        id: String,
        title: String,
        image: String,
        items: [{ date: String, text: String }],
      },
    ],

    courses: [{ id: String, name: String, seats: Number, tag: String, text: String }],

    recruiters: [{ name: String, logo: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("HomeContent", HomeContentSchema);