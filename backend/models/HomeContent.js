const mongoose = require("mongoose");

// Everything editable on the Home page (one document). Icons and the two banner tags stay in the code.
// The "default" values are the starting content: the first time the Home page is requested, the record is created from them.
// (Home.jsx keeps a copy of the same text to show while loading or when the server is down - keep the two in step.)
// Images are saved as "/uploads/xxx.jpg" (uploaded) or "/images/xxx.jpg" (already in the website's public folder).
const sub = (fields) => new mongoose.Schema(fields, { _id: false });

const HomeContentSchema = new mongoose.Schema(
  {
    banners: { type: [sub({ image: String, alt: String })], default: () => ([
      { image: "/images/campus-workshop.jpg", alt: "Chhotu Ram Polytechnic campus" },
      { image: "/images/campus-2.jpg", alt: "Chhotu Ram Polytechnic campus" },
      { image: "/images/campus-3.jpg", alt: "Chhotu Ram Polytechnic campus" }
    ]) },

    sectionContent: {
      whyChooseUs: {
        eyebrow: { type: String, default: "The Chhotu Ram advantage" },
        title: { type: String, default: "Why choose Us?" },
        description: { type: String, default: "A learning environment that brings technical knowledge, practical experience and student growth together." },
      },
      leadership: {
        eyebrow: { type: String, default: "Our leadership" },
        title: { type: String, default: "Guided by vision and leadership" },
      },
      notices: {
        eyebrow: { type: String, default: "Stay informed" },
        title: { type: String, default: "News & notices" },
      },
      highlights: {
        eyebrow: { type: String, default: "Life at the campus" },
        title: { type: String, default: "Events, achievements & placements" },
      },
      facilities: {
        eyebrow: { type: String, default: "Campus" },
        title: { type: String, default: "Facilities that support every student" },
        description: { type: String, default: "Hostels, labs, a library, sports and a hands-on workshop - everything a diploma student needs on one campus." },
      },
      courses: {
        eyebrow: { type: String, default: "Programmes" },
        title: { type: String, default: "Our courses" },
        description: { type: String, default: "Six three-year diplomas approved by DTE Haryana and AICTE, supported by two foundation departments." },
      },
      recruiters: {
        eyebrow: { type: String, default: "Placements" },
        title: { type: String, default: "Our recruiters" },
      },
    },

    latestNews: { type: [sub({ text: String, lang: String, to: String })], default: () => ([
      { text: "छोटू राम पॉलीटेक्निक में प्रदर्शनी, प्रधान गुलाब दिमाना व प्राचार्य सितेंद्र पावड़िया ने बढ़ाया छात्रों का हौसला", lang: "hi", to: "" }
    ]) },

    stats: { type: [sub({ value: String, label: String })], default: () => ([
      { value: "6", label: "Diploma programmes" },
      { value: "342", label: "Approved seats" },
      { value: "1956", label: "Serving students since" },
      { value: "1949", label: "NCC unit instituted" }
    ]) },

    reasons: { type: [sub({ title: String, text: String })], default: () => ([
      { title: "Practical learning", text: "Build skills through workshops, laboratories and hands-on diploma training." },
      { title: "Industry exposure", text: "Connect classroom learning with industrial visits, training and placement activities." },
      { title: "A supportive campus", text: "Learn in a campus community with student activities, facilities and guidance." },
      { title: "A proud legacy", text: "Be part of an institute with a long-standing contribution to technical education." }
    ]) },


    news: {
      tag: { type: String, default: "Latest news" },
      title: { type: String, default: "Students and guests at the institute's annual exhibition" },
      text: { type: String, default: "The institute's exhibition drew students, faculty and guests, who were encouraged by the President and the Principal to keep building and presenting their work." },
      image: { type: String, default: "/images/news-1.jpg" },
    },

    dignitaries: {
      type: [sub({ name: String, role: String, text: String, image: String, initials: String })],
      default: () => ([
      { name: "Deenbandhu Sir Chhotu Ram", role: "The Messiah of Farmers", text: "A great statesman, social reformer and the voice of the farmers. His vision for rural upliftment and education continues to inspire us.", image: "/images/leader-chhotu-ram.jpg", initials: "CR" },
      { name: "Sh. Gulab Singh", role: "President, JES Society (Regd.)", text: "Committed to providing better academic and infrastructure facilities for the overall growth of our students.", image: "/images/leader-gulab-singh.jpg", initials: "GS" },
      { name: "Dr. Sitender Kumar", role: "Principal, Chhotu Ram Polytechnic", text: "Dedicated to maintaining high standards of technical education and ensuring a bright and successful future for our students.", image: "/images/principal.png", initials: "SK" }
    ]),
    },

    // notices shown on the Home board: only rows that already exist on the Notices page, in this order
    // (empty = the newest notices are shown automatically)
    noticeIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notice" }],

    eventIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],

    // facility tiles: a facility of the Facilities page + which of its 3 photos (0, 1 or 2) + the tile's own text
    // (npm run seed fills the first five; empty = Home.jsx shows its own five)
    facilities: [sub({ facility: { type: mongoose.Schema.Types.ObjectId, ref: "Facility" }, photo: { type: Number, default: 0, min: 0, max: 2 }, name: String, text: String })],

    highlights: {
      type: [sub({ id: String, title: String, image: String, items: [sub({ date: String, text: String })] })],
      default: () => ([
      {
        id: "events",
        title: "Upcoming events",
        image: "/images/events.jpg",
        items: [
          { date: "Dec 2026", text: "Annual technical exhibition" },
          { date: "Jan 2027", text: "Republic Day parade and NCC display" },
          { date: "Feb 2027", text: "Cultural fest" }
        ]
      },
      {
        id: "achievements",
        title: "Achievements",
        image: "/images/achievements.jpg",
        items: [
          { date: "2026", text: "NCC cadets selected for state camp" },
          { date: "2026", text: "Students win inter-polytechnic sports meet" },
          { date: "2025", text: "Project showcase recognised by industry guests" }
        ]
      },
      {
        id: "placement",
        title: "Placement activities",
        image: "/images/placement-activities.jpg",
        items: [
          { date: "23 Feb 2026", text: "Campus drive by VVDN Technologies, Manesar, in the Conference Hall" },
          { date: "2026", text: "Industrial visits for 3rd and 5th semester students" }
        ]
      }
    ]),
    },

    courses: {
      type: [sub({ id: String, name: String, seats: Number, tag: String, text: String })],
      default: () => ([
      { id: "civil", name: "Civil Engineering", seats: 60, tag: "", text: "One of the broadest engineering fields - buildings, roads, water and the structures around us." },
      { id: "computer", name: "Computer Engineering", seats: 54, tag: "", text: "Software development and testing, networking and hardware." },
      { id: "electrical", name: "Electrical Engineering", seats: 60, tag: "", text: "Power, machines and control, taught with a mission of high-quality education." },
      { id: "electronics", name: "Electronics & Communication", seats: 54, tag: "", text: "The study and application of physics to design and operate electronic devices." },
      { id: "mechanical", name: "Mechanical Engineering", seats: 60, tag: "", text: "Design, development, building and testing of things that move." },
      { id: "plastic", name: "Plastic Technology", seats: 54, tag: "", text: "How plastics replace everyday and engineering items - materials, moulding and processing." },
      { id: "applied-science", name: "Applied Sciences", seats: 0, tag: "Foundation", text: "Communication skills, physics, chemistry and mathematics in the first two semesters." },
      { id: "workshop", name: "Workshop Department", seats: 0, tag: "Practical", text: "An intensive, short-duration hands-on learning experience." }
    ]),
    },

    recruiters: { type: [sub({ name: String, logo: String })], default: () => ([
      { name: "HCL", logo: "/images/recruiter-hcl.jpg" },
      { name: "Jindal Steel & Power", logo: "/images/recruiter-jindal-steel-power.jpg" },
      { name: "Tata Motors", logo: "/images/recruiter-tata-motors.jpg" },
      { name: "Tech Mahindra", logo: "/images/recruiter-tech-mahindra.jpg" }
    ]) },
  },
  { timestamps: true }
);

// The first five facility tiles of the Home page: each points to a facility by its slug; photo 0 = the facility's large photo.
const homeTiles = [
  {slug: "hostels", name: "Hostels", text: "Separate boys' and girls' hostels with spacious rooms, a kitchen and a mess."},
  {slug: "labs", name: "Computer labs", text: "Five labs for software, networking and hardware."},
  {slug: "library", name: "Library", text: "Books, journals and newspapers in a quiet, central space."},
  {slug: "sports", name: "Sports", text: "Volleyball, football, basketball, badminton and kho kho."},
  {slug: "workshop", name: "Workshop", text: "Hands-on sessions that build practical skills and teamwork."},
];

// Creates the Home record with the starting tiles, or fills only an empty facility list on an existing record.
// Run it after Facility.seed(), because the tiles point to facility rows.
HomeContentSchema.statics.seed = async function () {
  const facilities = await mongoose.model("Facility").find({ slug: { $in: homeTiles.map((tile) => tile.slug) } });
  const tiles = homeTiles
    .map((tile) => ({ facility: facilities.find((item) => item.slug === tile.slug)?._id, photo: 0, name: tile.name, text: tile.text }))
    .filter((tile) => tile.facility);

  const existingHome = await this.findOne();
  if (existingHome) {
    if ((!Array.isArray(existingHome.facilities) || existingHome.facilities.length === 0) && tiles.length > 0) {
      await this.updateOne(
        {
          _id: existingHome._id,
          $or: [
            { facilities: { $size: 0 } },
            { facilities: { $exists: false } },
            { facilities: null },
          ],
        },
        { $set: { facilities: tiles } }
      );
      console.log(`Home page facility tiles added with ${tiles.length} defaults`);
    }
    return;
  }

  await this.create({ facilities: tiles });
  console.log(`Home page added with ${tiles.length} facility tiles`);
};

module.exports = mongoose.model("HomeContent", HomeContentSchema);