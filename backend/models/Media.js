const mongoose = require("mongoose");

const PHOTO_CATEGORIES = ["Campus", "Workshop", "Events", "Labs", "Library", "Hostels", "Sports", "Placements"];
const SOCIAL_PLATFORMS = ["facebook", "instagram", "youtube", "twitter", "linkedin", "whatsapp", "other"];

const PhotoSchema = new mongoose.Schema({
  src: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true, default: "Campus" },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const VideoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  text: { type: String, default: "", trim: true },
  url: { type: String, required: true, trim: true },
  poster: { type: String, default: "" },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const SocialLinkSchema = new mongoose.Schema({
  platform: { type: String, enum: SOCIAL_PLATFORMS, default: "other" },
  label: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  handle: { type: String, default: "", trim: true },
  description: { type: String, default: "", trim: true },
  topics: { type: [String], default: [] },
  accent: { type: String, enum: ["orange", "sky"], default: "sky" },
  cta: { type: String, default: "Visit page", trim: true },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const PageBannersSchema = new mongoose.Schema({
  gallery: { type: String, default: undefined },
  videos: { type: String, default: undefined },
  socialLinks: { type: String, default: undefined },
}, { _id: false });

const MediaSchema = new mongoose.Schema({
  // No banner is seeded. Admins upload each page banner when ready.
  banners: { type: PageBannersSchema, default: undefined },
  photoCategories: { type: [String], default: () => [...PHOTO_CATEGORIES] },
  photos: { type: [PhotoSchema], default: [] },
  videos: { type: [VideoSchema], default: [] },
  socialLinks: { type: [SocialLinkSchema], default: [] },
}, { timestamps: true });

MediaSchema.statics.seed = async function (siteSocialLinks = []) {
  const existing = await this.findOne();
  if (existing) return;

  const photos = [
    { src: "/images/campus-2.jpg", title: "Main campus", category: "Campus", order: 0 },
    { src: "/images/campus-3.jpg", title: "Campus grounds", category: "Campus", order: 1 },
    { src: "/images/campus-workshop.jpg", title: "Workshop session", category: "Workshop", order: 2 },
    { src: "/images/events.jpg", title: "College events", category: "Events", order: 3 },
    { src: "/images/facilities/communication-lab-1.jpg", title: "Communication lab", category: "Labs", order: 4 },
    { src: "/images/facilities/facility-computer-labs.jpg", title: "Computer lab", category: "Labs", order: 5 },
    { src: "/images/facilities/library-2.jpg", title: "Library", category: "Library", order: 6 },
    { src: "/images/facilities/facility-hostels.jpg", title: "Hostel premises", category: "Hostels", order: 7 },
    { src: "/images/facilities/facility-sports.jpg", title: "Sports facilities", category: "Sports", order: 8 },
    { src: "/images/placement-activities.jpg", title: "Placement activities", category: "Placements", order: 9 },
  ];

  const videos = [{
    title: "Welcome to C.R. Polytechnic",
    text: "An introduction to the institute.",
    url: "https://www.youtube.com/watch?v=91vKQc6-W5o",
    poster: "/images/campus-workshop.jpg",
    published: true,
    order: 0,
  }];

  const fallbackSocial = [
    { platform: "facebook", label: "Facebook", url: "https://www.facebook.com/C.R.POLYTECHNIC.ROHTAK", handle: "C.R. Polytechnic Rohtak", description: "The official page for news, notices and event updates from the institute.", topics: ["Notices", "News", "Event updates"], accent: "sky", cta: "Visit our Facebook page", order: 0 },
    { platform: "instagram", label: "Instagram", url: "https://www.instagram.com/crprohtak/", handle: "@crprohtak", description: "Photos and short stories from campus life, events and celebrations.", topics: ["Campus life", "Events", "Student moments"], accent: "orange", cta: "Follow on Instagram", order: 1 },
  ];

  const socialLinks = Array.isArray(siteSocialLinks) && siteSocialLinks.length
    ? siteSocialLinks.map((item, order) => {
      const platform = String(item.platform || "other").toLowerCase();
      const fallback = fallbackSocial.find((entry) => entry.platform === platform) || {};
      return {
        ...fallback,
        platform: SOCIAL_PLATFORMS.includes(platform) ? platform : "other",
        label: item.label || fallback.label || "Official page",
        url: item.url || fallback.url || "",
        handle: fallback.handle || "",
        description: fallback.description || "Visit the institute's official page for updates.",
        topics: fallback.topics || ["Updates"],
        accent: fallback.accent || "sky",
        cta: fallback.cta || "Visit page",
        order,
      };
    }).filter((item) => item.url)
    : fallbackSocial;

  await this.create({ photos, videos, socialLinks });
  console.log("Media content added");
};

MediaSchema.statics.photoCategories = PHOTO_CATEGORIES;
MediaSchema.statics.socialPlatforms = SOCIAL_PLATFORMS;

module.exports = mongoose.models.Media || mongoose.model("Media", MediaSchema);
