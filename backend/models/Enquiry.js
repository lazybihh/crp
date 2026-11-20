const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, maxlength: 150, default: "" },
    role: { type: String, trim: true, default: "" },
    department: { type: String, trim: true, default: "" },
    topic: { type: String, trim: true, default: "" },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    status: { type: String, enum: ["new", "read", "replied", "archived"], default: "new" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Enquiry", EnquirySchema);
