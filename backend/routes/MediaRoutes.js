const express = require("express");
const Media = require("../models/Media");
const SiteSettings = require("../models/SiteSettings");
const { removeUnused } = require("../utils/uploads");

const router = express.Router();
const PHOTO_CATEGORIES = Media.photoCategories;
const OTHER_PHOTO_CATEGORY = Media.otherPhotoCategory;
const MAX_PHOTO_CATEGORIES = Media.maxPhotoCategories;
const SOCIAL_PLATFORMS = Media.socialPlatforms;
const text = (value) => String(value ?? "").trim();
const normalizedName = (value) => text(value).toLocaleLowerCase();

function cleanStoredCategories(value) {
  const seen = new Set();
  const categories = [];
  for (const entry of Array.isArray(value) ? value : PHOTO_CATEGORIES) {
    const name = text(entry);
    const key = normalizedName(name);
    if (!name || key === normalizedName(OTHER_PHOTO_CATEGORY) || seen.has(key)) continue;
    seen.add(key);
    categories.push(name);
    if (categories.length === MAX_PHOTO_CATEGORIES) break;
  }
  return categories;
}

async function normalizePhotoData(media) {
  let changed = false;
  // Replace only the exact original untouched seed set; keep Admin-managed galleries intact.
  const photoSources = media.photos.map((photo) => text(photo.src)).sort();
  const knownDefaultSets = [Media.legacySeedPhotoSources, Media.previousVerifiedSeedPhotoSources]
    .map((sources) => [...sources].sort());
  if (knownDefaultSets.some((sources) =>
    photoSources.length === sources.length &&
    photoSources.every((src, index) => src === sources[index])
  )) {
    media.photos = Media.defaultGalleryPhotos;
    changed = true;
  }

  const stored = Array.isArray(media.photoCategories) ? media.photoCategories : PHOTO_CATEGORIES;
  const categories = cleanStoredCategories(stored);
  if (JSON.stringify(stored) !== JSON.stringify(categories)) {
    media.photoCategories = categories;
    changed = true;
  }

  for (const photo of media.photos) {
    const current = text(photo.category);
    const next = normalizedName(current) === normalizedName(OTHER_PHOTO_CATEGORY)
      ? OTHER_PHOTO_CATEGORY
      : categories.includes(current) ? current : OTHER_PHOTO_CATEGORY;
    if (photo.category !== next) {
      photo.category = next;
      changed = true;
    }
  }

  if (changed) await media.save();
  return media;
}

function categoryName(value) {
  const name = text(value);
  if (!name) throw new Error("Category names cannot be empty.");
  if (name.length > 40) throw new Error("Category names must be 40 characters or fewer.");
  if (normalizedName(name) === normalizedName(OTHER_PHOTO_CATEGORY)) {
    throw new Error("Other is a fixed category and cannot be renamed or added.");
  }
  return name;
}

function validateCategoryList(value) {
  if (!Array.isArray(value)) throw new Error("Categories must be a list.");
  if (value.length > MAX_PHOTO_CATEGORIES) throw new Error(`You can have up to ${MAX_PHOTO_CATEGORIES} editable categories. Other is fixed.`);
  const categories = value.map(categoryName);
  if (new Set(categories.map(normalizedName)).size !== categories.length) {
    throw new Error("Each category must have a unique name.");
  }
  return categories;
}
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
    const media = await normalizePhotoData(await getOrCreate());
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

// Replace the editable category list. Removed categories send their photos to fixed Other.
router.put("/photo-categories", async (req, res) => {
  try {
    const categories = validateCategoryList(req.body.categories);
    const media = await normalizePhotoData(await getOrCreate());
    const removed = new Set(media.photoCategories.filter((name) => !categories.includes(name)));
    media.photos = media.photos.map((photo) => ({
      ...photo.toObject(),
      category: removed.has(photo.category) ? OTHER_PHOTO_CATEGORY : photo.category,
    }));
    media.photoCategories = categories;
    await media.save();

    res.json({ message: "Photo categories updated successfully.", categories: media.photoCategories, photos: media.photos });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to update photo categories." });
  }
});

router.post("/photo-categories", async (req, res) => {
  try {
    const name = categoryName(req.body.name);
    const media = await normalizePhotoData(await getOrCreate());
    if (media.photoCategories.length >= MAX_PHOTO_CATEGORIES) {
      return res.status(409).json({ message: `You can have up to ${MAX_PHOTO_CATEGORIES} editable categories. Other is fixed.` });
    }
    if (media.photoCategories.some((item) => normalizedName(item) === normalizedName(name))) {
      return res.status(409).json({ message: "A category with that name already exists." });
    }
    media.photoCategories.push(name);
    await media.save();
    res.status(201).json({ message: "Photo category added.", categories: media.photoCategories, photos: media.photos });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to add photo category." });
  }
});

router.patch("/photo-categories/:category", async (req, res) => {
  try {
    const oldName = text(req.params.category);
    if (normalizedName(oldName) === normalizedName(OTHER_PHOTO_CATEGORY)) {
      return res.status(400).json({ message: "Other is fixed and cannot be renamed." });
    }
    const name = categoryName(req.body.name);
    const media = await normalizePhotoData(await getOrCreate());
    if (!media.photoCategories.includes(oldName)) return res.status(404).json({ message: "Photo category not found." });
    if (media.photoCategories.some((item) => item !== oldName && normalizedName(item) === normalizedName(name))) {
      return res.status(409).json({ message: "A category with that name already exists." });
    }

    media.photoCategories = media.photoCategories.map((item) => item === oldName ? name : item);
    media.photos = media.photos.map((photo) => ({
      ...photo.toObject(),
      category: photo.category === oldName ? name : photo.category,
    }));
    await media.save();
    res.json({ message: "Photo category renamed.", categories: media.photoCategories, photos: media.photos });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to rename photo category." });
  }
});

router.delete("/photo-categories/:category", async (req, res) => {
  try {
    const name = text(req.params.category);
    if (normalizedName(name) === normalizedName(OTHER_PHOTO_CATEGORY)) {
      return res.status(400).json({ message: "Other is fixed and cannot be deleted." });
    }
    const media = await normalizePhotoData(await getOrCreate());
    if (!media.photoCategories.includes(name)) return res.status(404).json({ message: "Photo category not found." });

    let movedPhotos = 0;
    media.photoCategories = media.photoCategories.filter((item) => item !== name);
    media.photos = media.photos.map((photo) => {
      if (photo.category !== name) return photo.toObject();
      movedPhotos += 1;
      return { ...photo.toObject(), category: OTHER_PHOTO_CATEGORY };
    });
    await media.save();
    res.json({
      message: `Category deleted. ${movedPhotos} photo${movedPhotos === 1 ? "" : "s"} moved to Other.`,
      categories: media.photoCategories,
      photos: media.photos,
      movedPhotos,
    });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to delete photo category." });
  }
});

router.put("/photos", async (req, res) => {
  try {
    if (!Array.isArray(req.body.photos)) return res.status(400).json({ message: "Photos must be a list." });
    const media = await normalizePhotoData(await getOrCreate());
    const allowedCategories = media.photoCategories || [];
    const photos = req.body.photos.map((photo, index) => {
      const src = text(photo.src);
      const title = text(photo.title);
      const requestedCategory = text(photo.category);
      const category = allowedCategories.includes(requestedCategory) || normalizedName(requestedCategory) === normalizedName(OTHER_PHOTO_CATEGORY)
        ? (normalizedName(requestedCategory) === normalizedName(OTHER_PHOTO_CATEGORY) ? OTHER_PHOTO_CATEGORY : requestedCategory)
        : OTHER_PHOTO_CATEGORY;
      if (!src || !title) throw new Error("Every photo needs an image and a title.");
      if (!src.startsWith("/images/") && !src.startsWith("/uploads/")) throw new Error("Photos must use an existing site image or an uploaded image.");
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
