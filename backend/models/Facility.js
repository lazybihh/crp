const mongoose = require("mongoose");

// One facility of the main Facilities page. `photos` always holds its 3 images:
// [large, top-right, bottom-right]. The Home page picks one of them.
const FacilitySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true }, // same id as the Facilities page ("labs", "library"...)
    label: String,
    headline: String,
    text: String,
    photos: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Facility", FacilitySchema);