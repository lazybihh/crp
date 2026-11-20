const express = require("express");
const Media = require("../models/Media");
const SiteSettings = require("../models/SiteSettings");
const { removeUnused } = require("../utils/uploads");

const router = express.Router();
const PHOTO_CATEGORIES = Media.photoCategories;
const SOCIAL_PLATFORMS = Media.socialPlatforms;
const text = (value) => String(value ?? "").trim();
const httpsUrl = (value) => {
  const url = text(value);
  if (!url) throw new Error("A link is required.");
  let parsed;
  try { parsed = new URL(url); } catch { throw new Error("Enter a valid link."); }
  if (parsed.protocol !== "https:") throw new Error("Links must start with https://");
  return parsed.toString();
};

async function getOrCreate() {
  let media = await Media.findOne();
  if (!media) {
    const settings = await SiteSettings.findOne().lean();
    await Media.seed(settings?.socialLinks || []);
    media = await Media.findOne();
  }
  return media;
}

router.get("/", async (_req, res) => {
  try {
    const media = await getOrCreate();
    res.json({ media });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to load media." });
  }
});

// Each Media page owns its banner independently. Empty src removes the DB field.
router.put("/banners/:page", async (req, res) => {
  try {
    const page = text(req.params.page);
    const allowedPages = ["gallery", "videos", "socialLinks"];
    if (!allowedPages.includes(page)) {
      return res.status(404).json({ message: "Unknown Media page." });
    }

    const src = text(req.body.src);
    if (src && !/^\/uploads\/[A-Za-z0-9._-]+$/.test(src)) {
      return res.status(400).json({ message: "Upload a banner image using the image uploader." });
    }

    const media = await getOrCreate();
    const previous = media.toObject();
    const field = `banners.${page}`;

    if (src) {
      await Media.updateOne({ _id: media._id }, { $set: { [field]: src } });
    } else {
      // Remove the selected banner field. If no other page has a banner, remove
      // the entire banners object from MongoDB as well.
      const remaining = ["gallery", "videos", "socialLinks"]
        .filter((key) => key !== page)
        .some((key) => Boolean(media.banners?.[key]));
      await Media.updateOne(
        { _id: media._id },
        remaining
          ? { $unset: { [field]: 1 } }
          : { $unset: { banners: 1 } }
      );
    }

    const updated = await Media.findById(media._id);
    await removeUnused(previous, updated);
    res.json({ message: src ? "Page banner updated." : "Page banner removed.", banner: updated?.banners?.[page] || "" });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to update page banner." });
  }
});

// Rename the existing photo categories. The list length is fixed: admins cannot add or delete categories.
router.put("/photo-categories", async (req, res) => {
  try {
    if (!Array.isArray(req.body.categories)) {
      return res.status(400).json({ message: "Categories must be a list." });
    }

    const media = await getOrCreate();
    const current = [...(media.photoCategories || PHOTO_CATEGORIES)];
    const categories = req.body.categories.map((value) => text(value));

    if (categories.length !== current.length) {
      return res.status(400).json({ message: "Existing categories can be renamed, but cannot be added or removed." });
    }
    if (categories.some((name) => !name)) {
      return res.status(400).json({ message: "Category names cannot be empty." });
    }
    if (new Set(categories.map((name) => name.toLowerCase())).size !== categories.length) {
      return res.status(400).json({ message: "Each category must have a unique name." });
    }

    const renamed = new Map(current.map((oldName, index) => [oldName, categories[index]]));
    media.photos = media.photos.map((photo) => ({
      ...photo.toObject(),
      category: renamed.get(photo.category) || photo.category,
    }));
    media.photoCategories = categories;
    await media.save();

    res.json({ message: "Photo categories updated successfully.", categories: media.photoCategories, photos: media.photos });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to update photo categories." });
  }
});

router.put("/photos", async (req, res) => {
  try {
    if (!Array.isArray(req.body.photos)) return res.status(400).json({ message: "Photos must be a list." });
    const media = await getOrCreate();
    const allowedCategories = media.photoCategories || PHOTO_CATEGORIES;
    const photos = req.body.photos.map((photo, index) => {
      const src = text(photo.src);
      const title = text(photo.title);
      const category = text(photo.category);
      if (!src || !title) throw new Error("Every photo needs an image and a title.");
      if (!src.startsWith("/images/") && !src.startsWith("/uploads/")) throw new Error("Photos must use an existing site image or an uploaded image.");
      if (!allowedCategories.includes(category)) throw new Error(`Choose one of the existing photo categories: ${allowedCategories.join(", ")}.`);
      return { ...(photo._id ? { _id: photo._id } : {}), src, title, category, order: index };
    });

    const previous = media.toObject();
    media.photos = photos;
    await media.save();
    await removeUnused(previous, media);
    res.json({ message: "Photos updated successfully.", photos: media.photos });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to save photos." });
  }
});

router.put("/videos", async (req, res) => {
  try {
    if (!Array.isArray(req.body.videos)) return res.status(400).json({ message: "Videos must be a list." });
    const videos = req.body.videos.map((video, index) => {
      const title = text(video.title);
      const url = httpsUrl(video.url);
      const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
      if (!title) throw new Error("Every video needs a title.");
      if (!(["youtube.com", "m.youtube.com", "youtu.be", "youtube-nocookie.com", "vimeo.com", "player.vimeo.com"].includes(host))) {
        throw new Error("Use a YouTube or Vimeo video link. Video file uploads are not supported.");
      }
      return {
        ...(video._id ? { _id: video._id } : {}),
        title,
        text: text(video.text),
        url,
        poster: text(video.poster),
        published: video.published !== false,
        order: index,
      };
    });

    const media = await getOrCreate();
    media.videos = videos;
    await media.save();
    res.json({ message: "Video links updated successfully.", videos: media.videos });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to save video links." });
  }
});

router.put("/social-links", async (req, res) => {
  try {
    if (!Array.isArray(req.body.socialLinks)) return res.status(400).json({ message: "Social links must be a list." });
    const socialLinks = req.body.socialLinks.map((item, index) => {
      const platform = text(item.platform).toLowerCase();
      const label = text(item.label);
      if (!SOCIAL_PLATFORMS.includes(platform)) throw new Error("Choose one of the available social platforms.");
      if (!label) throw new Error("Every social link needs a label.");
      return {
        ...(item._id ? { _id: item._id } : {}),
        platform,
        label,
        url: httpsUrl(item.url),
        handle: text(item.handle),
        description: text(item.description),
        topics: Array.isArray(item.topics) ? item.topics.map(text).filter(Boolean).slice(0, 4) : [],
        accent: item.accent === "orange" ? "orange" : "sky",
        cta: text(item.cta) || "Visit page",
        published: item.published !== false,
        order: index,
      };
    });

    const media = await getOrCreate();
    media.socialLinks = socialLinks;
    await media.save();

    // Keep the global footer/header/contact social icons in sync with Media > Social Links.
    await SiteSettings.findOneAndUpdate({}, {
      $set: { socialLinks: socialLinks.map(({ platform, label, url }) => ({ platform, label, url })) },
    }, { upsert: true, new: true, setDefaultsOnInsert: true });

    res.json({ message: "Social links updated successfully.", socialLinks: media.socialLinks });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to save social links." });
  }
});

module.exports = router;
