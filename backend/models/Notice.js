const mongoose = require("mongoose");

// One row of the Notices page. The Home page only points to these rows (it never copies them).
const NoticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: String, // admissions | exams | scholarships | events | tenders | other
    file: String, // file name inside public/docs/notices/ ("" = no file)
    date: String, // "YYYY-MM-DD" or ""
    note: String,
    order: Number, // position on the Notices page
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notice", NoticeSchema);