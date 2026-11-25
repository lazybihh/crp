const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, default: "other" },
  file: { type: String, default: "" },
  link: { type: String, default: "" },
  date: { type: String, default: "" },
  note: { type: String, default: "" },
  order: { type: Number, default: 0 },
  published: { type: Boolean, default: true },
}, { timestamps: true });

// Keep the original starter notices.
// They are inserted only when the collection is empty.
const starterNotices = [
  ["Tender", "tenders", "d436029d-7b43-4fd1-8f24-edaee6853c9b.jpeg"],
  ["DET-L MERIT LIST 2026", "admissions", "Det-L_merit_list_26.pdf"],
  ["DET MERIT LIST 2026", "admissions", "DET_MERIT_LIST_26.pdf"],
  ["Admission Notice 2026", "admissions", "23face6d-e7bd-4d5c-97d5-ea9814f050ca.jpeg"],
  ["Reappear Internal Assessments", "exams", "f2804319-cd4a-45a1-976f-3a5c51c71822.jpeg"],
  ["Fee Submission Update", "other", "5f80d130-3131-454b-af1e-f5a4b62a2563.jpeg"],
  ["Scholarship Update", "scholarships", "04d8f828-9833-47b5-9c0b-4d0d88c47ec8.jpeg"],
  ["Institute Level Manual Counselling 2025-26", "admissions", "manual_admissions.jpeg"],
  ["Documents required for Verification", "admissions", "document_list.docx"],
  ["First Counselling Details", "admissions", "admission_CsweCeS.pdf"],
  ["Documents Required for Admission", "admissions", "f90e3923-35d3-4c6c-b874-bde5f48fe733.jpeg"],
  ["Schedule for Admissions 2025-26", "admissions", "admission2.jpeg"],
  ["Scholarship for SC students", "scholarships", "1966d634-759e-435b-bd88-3635884bbbfd.jpeg"],
  ["Reappear Sessional Datesheet", "exams", "c32069ad-5a6d-43aa-a1d1-47e15b537e58.jpeg"],
  ["Reappear Internal Assessment Exam from 14/10/2024 to 18/10/2024", "exams", "d94d2520-d761-4519-97f9-f0fd1a527e25.jpeg"],
  ["MERIT LIST - DET-L 2024-25", "admissions", "DET-L_MERIT_LIST.pdf"],
  ["MERIT LIST - DET 2024-25", "admissions", "DET_MERIT_LIST.pdf"],
  ["List of Documents Required for Admission", "admissions", "d0a7ebbb-d7b6-4459-96ab-4d95f1dc18d0.jpeg"],
  ["Verification for SC/BC students for PMS scholarship", "scholarships", "2a77d92d-5282-4891-adcf-26dbbc3533d4.jpeg"],
  ["Christmas Leave", "events", "Holiday.pdf"],
  ["Hawan Ceremony and Hockey Tournament on 24th November 2023", "events", "77a58295-08fe-4465-9a34-ab2bafbde8f1.jpeg"],
  ["Parents Teacher Meeting", "events", "e2b35a9e-5dbc-42d6-a75e-6e6234cd5b6e.jpeg"],
  ["Decision of UMC Examination Committee", "exams", "Decision_of_UMC_Committee_Meeting_July_2023.pdf"],
  ["Documents required for admission", "admissions", "56fec8a8-7693-449e-acf9-151f6e5d8391.jpeg"],
  ["DET result / rank manual counselling", "admissions", "2445824119.pdf"],
  ["Directions for manual counselling", "admissions", ""],
  ["DET-L manual counselling merit / rank", "admissions", "72221ccb-2278-4b4f-8378-743a065f5dcf.jpeg"],
  ["Manual Counselling for Admission in Diploma (DET/DET-L)", "admissions", "7a1bc903-19a8-4ab6-b294-d82cd0f44b1d_3r0gEWN.jpeg"],
  ["Manual Counselling for Admission in Diploma (DET/DET-L)", "admissions", "7a1bc903-19a8-4ab6-b294-d82cd0f44b1d.jpeg"],
  ["Revised Datesheet", "exams", "Revised_Datesheet_for_Diploma_HSBTE_Exam_July__2023.xlsx"],
  ["Final Datesheet for diploma HSBTE exam July 2023", "exams", "Final_Datesheet_for_Diploma_HSBTE_Exam_July__2023_N4epya9.xlsx"],
  ["Steps to generate Admit Card", "exams", "UM_Admit_Card.pdf"],
  ["Holiday on account of Id-uz-Zuha", "events", "8d62f936-fadc-44b2-ac69-7b34b82ce312.jpeg"],
  ["Annual Function: special fine of Rs 500 on absentees", "events", "30c39a79-4656-4a3e-baf1-1815b7589f6b.jpeg"],
  ["Parents Teacher Meeting on 18.04.2023", "events", "ptm.jpg"],
  ["62nd Annual Athletic Meet", "events", "IMG-20230325-WA0000.jpg"],
  ["Internal complaints committee", "other", "WhatsApp_Image_2023-02-22_at_12.48.57_PM.jpeg"],
  ["Parents Teacher Meeting", "events", "IMG-20221207-WA0011.jpg"],
  ["Admission Notice 2022", "admissions", "63296657ccb561894fbcf421.pdf"],
  ["Inviting Tender for Supply of Manpower", "tenders", ""]
];

NoticeSchema.statics.seed = async function () {
  if (await this.countDocuments()) {
    await this.updateMany(
      { published: { $exists: false } },
      { $set: { published: true } }
    );

    await this.updateMany(
      { order: { $exists: false } },
      { $set: { order: 0 } }
    );

    await this.updateMany(
      { category: { $exists: false } },
      { $set: { category: "other" } }
    );

    return;
  }

  await this.insertMany(
    starterNotices.map(([title, category, file], order) => ({
      title,
      category,
      file,
      date: "",
      note: "",
      order,
      published: true
    }))
  );

  console.log(`Notices added: ${starterNotices.length}`);
};

const Notice = mongoose.model("Notice", NoticeSchema);


// Page-level content for the Notices page.
// Following the same pattern as FacilitiesPage in Facility.js.

const NoticePageSchema = new mongoose.Schema({
  banner: { type: String, default: "/images/pages-banner.png" },
  eyebrow: { type: String, default: "Latest updates" },
  title: { type: String, default: "Notices" },
  lead: {
    type: String,
    default: "Admission lists, exam datesheets, scholarships, holidays and other announcements from the institute."
  },
  leftTag: { type: String, default: "Government Polytechnic" },
  rightTag: { type: String, default: "Rohtak (Haryana)" },
  glanceTitle: { type: String, default: "At a glance" },
  noticesLabel: { type: String, default: "Notices" },
  activitiesLabel: { type: String, default: "Activities" },
  latestLabel: { type: String, default: "Latest notice" },
  browseEyebrow: { type: String, default: "Browse" },
  listTitle: { type: String, default: "All announcements" },
  searchPlaceholder: { type: String, default: "Search by title" },
  helpTitle: { type: String, default: "Can't find a notice?" },
  helpText: {
    type: String,
    default: "Ask the institute office. Some older notices may not be on this page."
  },
  homeBreadcrumb: { type: String, default: "Home" },
  noticesBreadcrumb: { type: String, default: "Notices" },
  allLabel: { type: String, default: "All" },
  chooseCategoryLabel: { type: String, default: "Choose a category" },
  fileMissingLabel: { type: String, default: "File coming soon" },
  openFileLabel: { type: String, default: "Open" },
  emptyMessage: {
    type: String,
    default: "No notices match your search. Try a different word or choose All."
  },
  showMoreLabel: { type: String, default: "Show more" },
  showingLabel: { type: String, default: "Showing" },
  categoryAdmissions: { type: String, default: "Admissions" },
  categoryExams: { type: String, default: "Exams" },
  categoryScholarships: { type: String, default: "Scholarships" },
  categoryEvents: { type: String, default: "Holidays & events" },
  categoryTenders: { type: String, default: "Tenders" },
  categoryOther: { type: String, default: "Other" },
  published: { type: Boolean, default: true }
}, { timestamps: true });

const NoticePage =
  mongoose.models.NoticePage ||
  mongoose.model("NoticePage", NoticePageSchema);


// Export both models from the same file.
module.exports = Notice;
module.exports.NoticePage = NoticePage;