const mongoose = require("mongoose");

const sub = (fields) => new mongoose.Schema(fields, { _id: false });

const SiteSettingsSchema = new mongoose.Schema(
  {
    institute: {
      name: { type: String, default: "Chhotu Ram Polytechnic" },
      city: { type: String, default: "Rohtak" },
      cityLine: { type: String, default: "Rohtak, Haryana" },
      tagline: { type: String, default: "Government Polytechnic, Rohtak, Haryana" },
      approvedBy: { type: String, default: "Approved by AICTE, New Delhi" },
      affiliatedTo: { type: String, default: "Affiliated to HSBTE, Panchkula" },
      establishedYear: { type: String, default: "1956" },
    },
    contact: {
      phones: { type: [String], default: () => ["01262-274667", "01262-285667"] },
      email: { type: String, default: "crprohtak@hry.nic.in" },
      alumniEmail: { type: String, default: "crprohtak1956@gmail.com" },
      addressLines: { type: [String], default: () => ["Delhi Road, Rohtak", "Haryana 124001"] },
      mapUrl: { type: String, default: "https://www.google.com/maps?q=28.885496,76.617082" },
      directionsUrl: { type: String, default: "https://goo.gl/maps/ZZ6ig9cBYNjbWiL4A" },
      mapEmbed: { type: String, default: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13973.729633770752!2d76.617082!3d28.885496!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x18a060d271041f6f!2sC+R+Polytechnic!5e0!3m2!1sen!2sin!4v1433765486525" },
    },
    socialLinks: {
      type: [sub({ platform: String, label: String, url: String })],
      default: () => [
        { platform: "facebook", label: "Facebook", url: "https://www.facebook.com/C.R.POLYTECHNIC.ROHTAK" },
        { platform: "instagram", label: "Instagram", url: "https://www.instagram.com/crprohtak/" },
      ],
    },
    links: {
      payFee: { type: String, default: "https://sbcollect.sbi.bank.in/sbicollect/icollecthome.htm" },
      admissionPortal: { type: String, default: "https://techadmissionshry.gov.in/" },
      hsbte: { type: String, default: "https://hsbte.org.in/" },
      hstes: { type: String, default: "https://hstes.org.in/" },
      aicte: { type: String, default: "https://www.aicte-india.org/" },
      hrms: { type: String, default: "https://intrahry.gov.in" },
      facultyFeedbackForm: { type: String, default: "https://forms.gle/2RFW2T8tyHKo6xef7" },
      studentFeedbackForm: { type: String, default: "https://forms.gle/uDDtofTbuHvyN7QU9" },
      grievanceForm: { type: String, default: "https://forms.gle/59a69DF2cuMYr7vy7" },
    },
    images: {
      logo: { type: String, default: "/logo.png" },
      loadingAnimation: { type: String, default: "/images/crlogogif.gif" },
      tabIcon: { type: String, default: "" },
    },
    headerButton: {
      label: { type: String, default: "Admissions Open" },
      link: { type: String, default: "/admissions" },
      show: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

SiteSettingsSchema.statics.seed = async function () {
  if (await this.countDocuments()) {
    const missing = {};
    const backfill = [
      ["institute.name", "Chhotu Ram Polytechnic"], ["institute.city", "Rohtak"],
      ["institute.cityLine", "Rohtak, Haryana"], ["institute.tagline", "Government Polytechnic, Rohtak, Haryana"],
      ["institute.approvedBy", "Approved by AICTE, New Delhi"], ["institute.affiliatedTo", "Affiliated to HSBTE, Panchkula"],
      ["institute.establishedYear", "1956"], ["contact.phones", ["01262-274667", "01262-285667"]],
      ["contact.email", "crprohtak@hry.nic.in"], ["contact.alumniEmail", "crprohtak1956@gmail.com"],
      ["contact.addressLines", ["Delhi Road, Rohtak", "Haryana 124001"]],
      ["contact.mapUrl", "https://www.google.com/maps?q=28.885496,76.617082"],
      ["contact.directionsUrl", "https://goo.gl/maps/ZZ6ig9cBYNjbWiL4A"],
      ["contact.mapEmbed", "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13973.729633770752!2d76.617082!3d28.885496!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x18a060d271041f6f!2sC+R+Polytechnic!5e0!3m2!1sen!2sin!4v1433765486525"],
      ["images.logo", "/logo.png"], ["images.loadingAnimation", "/images/crlogogif.gif"],
      ["headerButton.label", "Admissions Open"], ["headerButton.link", "/admissions"], ["headerButton.show", true],
      ["links.payFee", "https://sbcollect.sbi.bank.in/sbicollect/icollecthome.htm"],
      ["links.admissionPortal", "https://techadmissionshry.gov.in/"],
      ["links.hsbte", "https://hsbte.org.in/"], ["links.hstes", "https://hstes.org.in/"],
      ["links.aicte", "https://www.aicte-india.org/"], ["links.hrms", "https://intrahry.gov.in"],
      ["links.facultyFeedbackForm", "https://forms.gle/2RFW2T8tyHKo6xef7"],
      ["links.studentFeedbackForm", "https://forms.gle/uDDtofTbuHvyN7QU9"],
      ["links.grievanceForm", "https://forms.gle/59a69DF2cuMYr7vy7"],
      ["images.tabIcon", ""],
      ["socialLinks", [
        { platform: "facebook", label: "Facebook", url: "https://www.facebook.com/C.R.POLYTECHNIC.ROHTAK" },
        { platform: "instagram", label: "Instagram", url: "https://www.instagram.com/crprohtak/" },
      ]],
    ];
    const existing = await this.findOne();
    const saved = existing?.toObject() || {};
    for (const [path, value] of backfill) {
      const parts = path.split(".");
      const actual = parts.reduce((object, key) => object?.[key], saved);
      if (actual === undefined) missing[path] = value;
    }
    if (Object.keys(missing).length) await this.updateOne({}, { $set: missing });
    return;
  }
  await this.create({});
  console.log("Site settings added");
};

module.exports = mongoose.model("SiteSettings", SiteSettingsSchema);
