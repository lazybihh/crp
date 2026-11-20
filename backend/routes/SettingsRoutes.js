const express = require("express");
const SiteSettings = require("../models/SiteSettings");
const Media = require("../models/Media");
const { removeUnused } = require("../utils/uploads");

const router = express.Router();
const text = (value) => String(value ?? "").trim();
const list = (value) => (Array.isArray(value) ? value : []).map(text).filter(Boolean);
const httpUrl = (value) => {
  const valueText = text(value);
  if (!valueText) return "";
  if (!/^https:\/\//i.test(valueText)) throw new Error("Links must use https://");
  return valueText;
};

router.get("/", async (req, res) => {
  try {
    const settings = (await SiteSettings.findOne().lean()) || (await SiteSettings.create({})).toObject();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch site settings", error: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const body = req.body || {};
    const institute = body.institute || {};
    const contact = body.contact || {};
    const links = body.links || {};
    const images = body.images || {};
    const headerButton = body.headerButton || {};
    const email = text(contact.email);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Main email is not valid" });
    }
    const alumniEmail = text(contact.alumniEmail);
    if (alumniEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(alumniEmail)) {
      return res.status(400).json({ message: "Alumni email is not valid" });
    }

    const linkFields = ["payFee", "admissionPortal", "hsbte", "hstes", "aicte", "hrms", "facultyFeedbackForm", "studentFeedbackForm", "grievanceForm"];
    for (const field of linkFields) links[field] = httpUrl(links[field]);
    contact.mapUrl = httpUrl(contact.mapUrl);
    contact.directionsUrl = httpUrl(contact.directionsUrl);
    contact.mapEmbed = httpUrl(contact.mapEmbed);
    if (headerButton.link) headerButton.link = text(headerButton.link).startsWith("/") ? text(headerButton.link) : httpUrl(headerButton.link);

    const fields = {
      institute: {
        name: text(institute.name),
        city: text(institute.city),
        cityLine: text(institute.cityLine),
        tagline: text(institute.tagline),
        approvedBy: text(institute.approvedBy),
        affiliatedTo: text(institute.affiliatedTo),
        establishedYear: text(institute.establishedYear),
      },
      contact: {
        phones: list(contact.phones),
        email,
        alumniEmail,
        addressLines: list(contact.addressLines),
        mapUrl: contact.mapUrl,
        directionsUrl: contact.directionsUrl,
        mapEmbed: contact.mapEmbed,
      },
      socialLinks: (Array.isArray(body.socialLinks) ? body.socialLinks : [])
        .map((item) => ({ platform: text(item?.platform), label: text(item?.label), url: httpUrl(item?.url) }))
        .filter((item) => item.platform && item.label && item.url),
      links,
      images: {
        logo: text(images.logo),
        loadingAnimation: text(images.loadingAnimation),
        tabIcon: text(images.tabIcon),
      },
      headerButton: {
        label: text(headerButton.label),
        link: text(headerButton.link),
        show: headerButton.show !== false,
      },
    };
    const before = await SiteSettings.findOne();
    const settings = await SiteSettings.findOneAndUpdate({}, { $set: fields }, { new: true, upsert: true, runValidators: true });
    // Keep the Media > Social Links collection aligned with global social links.
    const media = await Media.findOne();
    if (media && Array.isArray(fields.socialLinks)) {
      const previousByPlatform = new Map(media.socialLinks.map((item) => [item.platform, item.toObject()]));
      media.socialLinks = fields.socialLinks.map((item, index) => ({
        ...(previousByPlatform.get(item.platform) || {}),
        platform: ["facebook", "instagram", "youtube", "twitter", "linkedin", "whatsapp", "other"].includes(item.platform) ? item.platform : "other",
        label: item.label,
        url: item.url,
        order: index,
      }));
      await media.save();
    }
    await removeUnused(before, settings);
    res.json({ message: "Site settings updated successfully", settings });
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to update site settings" });
  }
});

module.exports = router;
