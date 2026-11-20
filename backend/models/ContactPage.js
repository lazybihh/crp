const mongoose = require("mongoose");

const ContactPageSchema = new mongoose.Schema(
  {
    bannerImage: { type: String, default: "/images/pages-banner.png" },
    intro: {
      eyebrow: { type: String, default: "About us" },
      title: { type: String, default: "Contact us" },
      lead: { type: String, default: "Call, write or visit the institute office. Everything you need to find us is on this page." },
    },
    topics: { type: [String], default: () => ["Admissions", "Courses and fees", "Results and exams", "Something else"] },
  },
  { timestamps: true }
);

ContactPageSchema.statics.seed = async function () {
  if (await this.countDocuments()) {
    const existing = await this.findOne();
    const saved = existing?.toObject() || {};
    const missing = {};
    for (const [key, value] of [
      ["intro.eyebrow", "About us"],
      ["intro.title", "Contact us"],
      ["intro.lead", "Call, write or visit the institute office. Everything you need to find us is on this page."],
      ["bannerImage", "/images/pages-banner.png"],
      ["topics", ["Admissions", "Courses and fees", "Results and exams", "Something else"]],
    ]) {
      const parts = key.split(".");
      const actual = parts.reduce((object, part) => object?.[part], saved);
      if (actual === undefined) missing[key] = value;
    }
    if (Object.keys(missing).length) await this.updateOne({}, { $set: missing });
    return;
  }
  await this.create({});
};

module.exports = mongoose.model("ContactPage", ContactPageSchema);
