const mongoose = require("mongoose");

const PHOTO_CATEGORIES = ["Campus", "Workshop", "Events", "Labs", "Library", "Hostels", "Sports", "Placements"];
const OTHER_PHOTO_CATEGORY = "Other";
const SOCIAL_PLATFORMS = ["facebook", "instagram", "youtube", "twitter", "linkedin", "whatsapp", "other"];
const DEFAULT_GALLERY_PHOTOS = [
  { src: "/images/facilities/girls-common-room-2.jpg", title: "Student gathering", category: "Events", order: 0 },
  { src: "/images/orientation-2025.jpg", title: "Student orientation", category: "Events", order: 1 },
  { src: "/images/rangoli.jpg", title: "Rangoli activity", category: "Events", order: 2 },
  { src: "/images/facilities/hostels-3.jpg", title: "Hostel building", category: "Hostels", order: 3 },
  { src: "/images/facilities/hostels-2.jpg", title: "Hostel grounds", category: "Hostels", order: 4 },
  { src: "/images/facilities/facility-library.jpg", title: "Students in the library", category: "Library", order: 5 },
  { src: "/images/facilities/facility-sports.jpg", title: "Basketball on campus", category: "Sports", order: 6 },
  { src: "/images/facilities/placement-cell-1.jpg", title: "Micron campus placement drive", category: "Placements", order: 7 },
  { src: "/images/facilities/industrial-visits-1.jpg", title: "Industrial visit to Amul", category: "Events", order: 8 },
  { src: "/images/facilities/conference-hall-1.jpg", title: "Student seminar", category: "Campus", order: 9 },
];
const LEGACY_SEED_PHOTO_SRCS = [
  "/images/campus-2.jpg", "/images/campus-3.jpg", "/images/campus-workshop.jpg",
  "/images/events.jpg", "/images/facilities/communication-lab-1.jpg",
  "/images/facilities/facility-computer-labs.jpg", "/images/facilities/library-2.jpg",
  "/images/facilities/facility-hostels.jpg", "/images/facilities/facility-sports.jpg",
  "/images/placement-activities.jpg",
];
const PREVIOUS_VERIFIED_SEED_PHOTO_SRCS = [
  "/images/events.jpg", "/images/orientation-2025.jpg", "/images/rangoli.jpg",
  "/images/facilities/facility-hostels.jpg", "/images/facilities/hostels-2.jpg",
  "/images/facilities/facility-library.jpg", "/images/facilities/facility-sports.jpg",
  "/images/facilities/placement-cell-1.jpg", "/images/facilities/industrial-visits-1.jpg",
  "/images/facilities/conference-hall-1.jpg",
];

const PhotoSchema = new mongoose.Schema({
  src: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true, default: OTHER_PHOTO_CATEGORY },
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

  const photos = DEFAULT_GALLERY_PHOTOS;

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
MediaSchema.statics.otherPhotoCategory = OTHER_PHOTO_CATEGORY;
MediaSchema.statics.maxPhotoCategories = 8;
MediaSchema.statics.socialPlatforms = SOCIAL_PLATFORMS;
MediaSchema.statics.defaultGalleryPhotos = DEFAULT_GALLERY_PHOTOS;
MediaSchema.statics.legacySeedPhotoSources = LEGACY_SEED_PHOTO_SRCS;
MediaSchema.statics.previousVerifiedSeedPhotoSources = PREVIOUS_VERIFIED_SEED_PHOTO_SRCS;

module.exports = mongoose.models.Media || mongoose.model("Media", MediaSchema);
