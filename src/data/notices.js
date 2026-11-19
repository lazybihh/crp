// notices.js - the ONE list of notices used by the Notices page (/notices) AND the notice board on the Home page.
// Add / edit / remove a notice HERE and both pages update. Later the admin panel will replace these two lists with data
// fetched from the server in the same shape:  { id, title, category, file, date, note }
//   id        unique number
//   category  one of the ids in `categories` (activities ignore it)
//   file      file name inside public/docs/notices/ (".pdf .jpg .jpeg .png .docx .xlsx"), or "" for no file
//   date      optional "YYYY-MM-DD" - when set, the row shows it, the list sorts newest first, and the Home board marks it NEW for 30 days
//   note      optional one-line text under the title
// Every `file` lives in FILE_FOLDER (public/docs/notices/).

export const FILE_FOLDER = "/docs/notices/";

// Category chips (notices tab only). Add a new one here, then use its id in `category`.
export const categories = [
  { id: "admissions", label: "Admissions" },
  { id: "exams", label: "Exams" },
  { id: "scholarships", label: "Scholarships" },
  { id: "events", label: "Holidays & events" },
  { id: "tenders", label: "Tenders" },
  { id: "other", label: "Other" },
];

// REAL - the live "Notices" table, in order.
export const notices = [
  { id: 1, title: "Tender", category: "tenders", file: "d436029d-7b43-4fd1-8f24-edaee6853c9b.jpeg", date: "", note: "" },
  { id: 2, title: "DET-L MERIT LIST 2026", category: "admissions", file: "Det-L_merit_list_26.pdf", date: "", note: "" },
  { id: 3, title: "DET MERIT LIST 2026", category: "admissions", file: "DET_MERIT_LIST_26.pdf", date: "", note: "" },
  { id: 4, title: "Admission Notice 2026", category: "admissions", file: "23face6d-e7bd-4d5c-97d5-ea9814f050ca.jpeg", date: "", note: "" },
  { id: 5, title: "Reappear Internal Assessments", category: "exams", file: "f2804319-cd4a-45a1-976f-3a5c51c71822.jpeg", date: "", note: "" },
  { id: 6, title: "Fee Submission Update", category: "other", file: "5f80d130-3131-454b-af1e-f5a4b62a2563.jpeg", date: "", note: "" },
  { id: 7, title: "Scholarship Update", category: "scholarships", file: "04d8f828-9833-47b5-9c0b-4d0d88c47ec8.jpeg", date: "", note: "" },
  { id: 8, title: "Institute Level Manual Counselling 2025-26", category: "admissions", file: "manual_admissions.jpeg", date: "", note: "" },
  { id: 9, title: "Documents required for Verification", category: "admissions", file: "document_list.docx", date: "", note: "" },
  { id: 10, title: "First Counselling Details", category: "admissions", file: "admission_CsweCeS.pdf", date: "", note: "" },
  { id: 11, title: "Documents Required for Admission", category: "admissions", file: "f90e3923-35d3-4c6c-b874-bde5f48fe733.jpeg", date: "", note: "" },
  { id: 12, title: "Schedule for Admissions 2025-26", category: "admissions", file: "admission2.jpeg", date: "", note: "" },
  { id: 13, title: "Scholarship for SC students", category: "scholarships", file: "1966d634-759e-435b-bd88-3635884bbbfd.jpeg", date: "", note: "" },
  { id: 14, title: "Reappear Sessional Datesheet", category: "exams", file: "c32069ad-5a6d-43aa-a1d1-47e15b537e58.jpeg", date: "", note: "" },
  { id: 15, title: "Reappear Internal Assessment Exam from 14/10/2024 to 18/10/2024", category: "exams", file: "d94d2520-d761-4519-97f9-f0fd1a527e25.jpeg", date: "", note: "" },
  { id: 16, title: "MERIT LIST - DET-L 2024-25", category: "admissions", file: "DET-L_MERIT_LIST.pdf", date: "", note: "" },
  { id: 17, title: "MERIT LIST - DET 2024-25", category: "admissions", file: "DET_MERIT_LIST.pdf", date: "", note: "" },
  { id: 18, title: "List of Documents Required for Admission", category: "admissions", file: "d0a7ebbb-d7b6-4459-96ab-4d95f1dc18d0.jpeg", date: "", note: "" },
  { id: 19, title: "Verification for SC/BC students for PMS scholarship", category: "scholarships", file: "2a77d92d-5282-4891-adcf-26dbbc3533d4.jpeg", date: "", note: "" },
  { id: 20, title: "Christmas Leave", category: "events", file: "Holiday.pdf", date: "", note: "" },
  { id: 21, title: "Hawan Ceremony and Hockey Tournament on 24th November 2023", category: "events", file: "77a58295-08fe-4465-9a34-abd2afbde8f1.jpeg", date: "", note: "" },
  { id: 22, title: "Parents Teacher Meeting", category: "events", file: "e2b35a9e-5dbc-42d6-a75e-6e6234cd5b6e.jpeg", date: "", note: "" },
  { id: 23, title: "Decision of UMC Examination Committee", category: "exams", file: "Decision_of_UMC_Committee_Meeting_July_2023.pdf", date: "", note: "" },
  { id: 24, title: "Documents required for admission", category: "admissions", file: "56fec8a8-7693-449e-acf9-151f6e5d8391.jpeg", date: "", note: "" },
  { id: 25, title: "DET result / rank manual counselling", category: "admissions", file: "2445824119.pdf", date: "", note: "" },
  { id: 26, title: "Directions for manual counselling", category: "admissions", file: "", date: "", note: "Candidates on the rank / merit list report on 24.8.23 at 9:00 AM with documents and the admission fee." },
  { id: 27, title: "DET-L manual counselling merit / rank", category: "admissions", file: "72221ccb-2278-4b4f-8378-743a065f5dcf.jpeg", date: "", note: "Candidates on the rank / merit list report on 24.8.23 at 9:00 AM with documents." },
  { id: 28, title: "Manual Counselling for Admission in Diploma (DET/DET-L)", category: "admissions", file: "7a1bc903-19a8-4ab6-b294-d82cd0f44b1d_3r0gEWN.jpeg", date: "", note: "" },
  { id: 29, title: "Manual Counselling for Admission in Diploma (DET/DET-L)", category: "admissions", file: "7a1bc903-19a8-4ab6-b294-d82cd0f44b1d.jpeg", date: "", note: "" },
  { id: 30, title: "Revised Datesheet", category: "exams", file: "Revised_Datesheet_for_Diploma_HSBTE_Exam_July__2023.xlsx", date: "", note: "" },
  { id: 31, title: "Final Datesheet for diploma HSBTE exam July 2023", category: "exams", file: "Final_Datesheet_for_Diploma_HSBTE_Exam_July__2023_N4epya9.xlsx", date: "", note: "" },
  { id: 32, title: "Steps to generate Admit Card", category: "exams", file: "UM_Admit_Card.pdf", date: "", note: "" },
  { id: 33, title: "Holiday on account of Id-uz-Zuha", category: "events", file: "8d62f936-fadc-44b2-ac69-7b34b82ce312.jpeg", date: "", note: "" },
  { id: 34, title: "Annual Function: special fine of Rs 500 on absentees", category: "events", file: "30c39a79-4656-4a3e-baf1-1815b7589f6b.jpeg", date: "", note: "" },
  { id: 35, title: "Parents Teacher Meeting on 18.04.2023", category: "events", file: "ptm.jpg", date: "", note: "" },
  { id: 36, title: "62nd Annual Athletic Meet", category: "events", file: "IMG-20230325-WA0000.jpg", date: "", note: "" },
  { id: 37, title: "Internal complaints committee", category: "other", file: "WhatsApp_Image_2023-02-22_at_12.48.57_PM.jpeg", date: "", note: "" },
  { id: 38, title: "Parents Teacher Meeting", category: "events", file: "IMG-20221207-WA0011.jpg", date: "", note: "" },
  { id: 39, title: "Admission Notice 2022", category: "admissions", file: "63296657ccb561894fbcf421.pdf", date: "", note: "" },
  { id: 40, title: "Inviting Tender for Supply of Manpower", category: "tenders", file: "", date: "", note: "" },
];

// REAL - the live "Activities" table, in order. (category is not used on this tab)
export const activities = [
  { id: 1, title: "CR Celebration 21 January 2026", category: "activities", file: "b4e6daee-f286-42db-a0a8-47b131b76db3.jpeg", date: "", note: "" },
  { id: 2, title: "CR Celebration 22 January 2026", category: "activities", file: "8e6be03e-2230-4beb-9064-684b11b63e77.jpeg", date: "", note: "" },
  { id: 3, title: "Application Form", category: "activities", file: "Application_Form.pdf", date: "", note: "" },
  { id: 4, title: "Advertisement", category: "activities", file: "Advertisement_.pdf", date: "", note: "" },
  { id: 5, title: "Manual Counselling for vacant / leftover seat at C.R. Polytechnic", category: "activities", file: "f67d424b-9fd8-4af9-b20a-ba663c510577.jpeg", date: "", note: "" },
  { id: 6, title: "External practicals for Regular & Reappear students", category: "activities", file: "443bab90-6862-4bba-a193-0d9fb727f079.jpeg", date: "", note: "" },
  { id: 7, title: "Er. Jaisingh Dabas Best Sportsperson Award 2024", category: "activities", file: "Sports_award.pdf", date: "", note: "" },
  { id: 8, title: "I card distribution of Life Members of Jat Education Society", category: "activities", file: "1049420e-96d6-4b43-a521-60512a5f879d.jpeg", date: "", note: "" },
  { id: 9, title: "Name struck off", category: "activities", file: "4ecececc-eb37-412d-ba7e-0116f53e5728.jpeg", date: "", note: "" },
  { id: 10, title: "Dead voter list", category: "activities", file: "Dead_voter-list.pdf", date: "", note: "" },
];

export const sortRows = (rows) =>
  rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => (b.row.date || "").localeCompare(a.row.date || "") || a.index - b.index)
    .map((entry) => entry.row);

// the link for a notice, or "" when it has no file
export const fileUrl = (row) => (row.file ? `${FILE_FOLDER}${row.file}` : "");

// a notice is NEW for 30 days after its date (notices without a date are never marked NEW)
export const isNew = (row) => {
  if (!row.date) return false;
  const age = Date.now() - new Date(`${row.date}T00:00:00`).getTime();
  return age >= 0 && age <= 30 * 24 * 60 * 60 * 1000;
};