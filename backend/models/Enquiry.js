const mongoose = require("mongoose");

// One collection for everything people send us through the website:
//   kind "contact"                 - the Contact page form (older records use "enquiry")
//   kind "admission-form"          - the shared admission request form
//   kind "course-enquiry"           - a course-card enquiry
//   kind "anti-ragging"            - the Anti-Ragging complaint form
//   kind "anti-sexual-harassment"  - the Anti-Sexual Harassment complaint form
// Complaints can be anonymous; public contact, admission and course requests require name and phone.
const kinds = ["enquiry", "contact", "admission-form", "course-enquiry", "anti-ragging", "anti-sexual-harassment"];
const isPublicRequest = function () { return ["enquiry", "contact", "admission-form", "course-enquiry"].includes(this.kind); };

const EnquirySchema = new mongoose.Schema(
  {
    kind: { type: String, enum: kinds, default: "contact" },
    name: { type: String, required: isPublicRequest, trim: true, maxlength: 100, default: "" },
    phone: { type: String, required: isPublicRequest, trim: true, default: "" },
    email: { type: String, trim: true, maxlength: 150, default: "" },
    role: { type: String, trim: true, default: "" },          // enquiry: who they are / complaint: "You are a"
    department: { type: String, trim: true, default: "" },
    topic: { type: String, trim: true, default: "" },
    qualification: { type: String, trim: true, maxlength: 120, default: "" },
    admissionSession: { type: String, trim: true, maxlength: 20, default: "" },
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
