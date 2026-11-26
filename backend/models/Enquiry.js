const mongoose = require("mongoose");

// One collection for everything people send us through the website:
//   kind "enquiry"                 - the Contact page form
//   kind "anti-ragging"            - the Anti-Ragging complaint form
//   kind "anti-sexual-harassment"  - the Anti-Sexual Harassment complaint form
// Complaints can be anonymous, so name and phone are only required for an enquiry.
const kinds = ["enquiry", "anti-ragging", "anti-sexual-harassment"];
const isEnquiry = function () { return this.kind === "enquiry"; };

const EnquirySchema = new mongoose.Schema(
  {
    kind: { type: String, enum: kinds, default: "enquiry" },
    name: { type: String, required: isEnquiry, trim: true, maxlength: 100, default: "" },
    phone: { type: String, required: isEnquiry, trim: true, default: "" },
    email: { type: String, trim: true, maxlength: 150, default: "" },
    role: { type: String, trim: true, default: "" },          // enquiry: who they are / complaint: "You are a"
    department: { type: String, trim: true, default: "" },
    topic: { type: String, trim: true, default: "" },
    message: { type: String, required: true, trim: true, maxlength: 3000 },
    // complaint forms only
    contact: { type: String, trim: true, maxlength: 150, default: "" },            // phone or email typed in the form
    incidentDate: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, maxlength: 200, default: "" },
    involved: { type: String, trim: true, maxlength: 300, default: "" },           // person(s) involved / respondent
    contactPreference: { type: String, trim: true, default: "" },
    status: { type: String, enum: ["new", "read", "replied", "archived"], default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", EnquirySchema);
