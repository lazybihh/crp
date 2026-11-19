// Fills the database with the rows that already exist on the website, so the Home page has something to choose from.
// Run once:  npm run seed      (safe to run again - a collection that already has rows is left alone)
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Notice = require("./models/Notice");
const Facility = require("./models/Facility");

dotenv.config();

// the Notices page (src/data/notices.js)
const notices = [
  {"id":1,"title":"Tender","category":"tenders","file":"d436029d-7b43-4fd1-8f24-edaee6853c9b.jpeg","date":"","note":""},
  {"id":2,"title":"DET-L MERIT LIST 2026","category":"admissions","file":"Det-L_merit_list_26.pdf","date":"","note":""},
  {"id":3,"title":"DET MERIT LIST 2026","category":"admissions","file":"DET_MERIT_LIST_26.pdf","date":"","note":""},
  {"id":4,"title":"Admission Notice 2026","category":"admissions","file":"23face6d-e7bd-4d5c-97d5-ea9814f050ca.jpeg","date":"","note":""},
  {"id":5,"title":"Reappear Internal Assessments","category":"exams","file":"f2804319-cd4a-45a1-976f-3a5c51c71822.jpeg","date":"","note":""},
  {"id":6,"title":"Fee Submission Update","category":"other","file":"5f80d130-3131-454b-af1e-f5a4b62a2563.jpeg","date":"","note":""},
  {"id":7,"title":"Scholarship Update","category":"scholarships","file":"04d8f828-9833-47b5-9c0b-4d0d88c47ec8.jpeg","date":"","note":""},
  {"id":8,"title":"Institute Level Manual Counselling 2025-26","category":"admissions","file":"manual_admissions.jpeg","date":"","note":""},
  {"id":9,"title":"Documents required for Verification","category":"admissions","file":"document_list.docx","date":"","note":""},
  {"id":10,"title":"First Counselling Details","category":"admissions","file":"admission_CsweCeS.pdf","date":"","note":""},
  {"id":11,"title":"Documents Required for Admission","category":"admissions","file":"f90e3923-35d3-4c6c-b874-bde5f48fe733.jpeg","date":"","note":""},
  {"id":12,"title":"Schedule for Admissions 2025-26","category":"admissions","file":"admission2.jpeg","date":"","note":""},
  {"id":13,"title":"Scholarship for SC students","category":"scholarships","file":"1966d634-759e-435b-bd88-3635884bbbfd.jpeg","date":"","note":""},
  {"id":14,"title":"Reappear Sessional Datesheet","category":"exams","file":"c32069ad-5a6d-43aa-a1d1-47e15b537e58.jpeg","date":"","note":""},
  {"id":15,"title":"Reappear Internal Assessment Exam from 14/10/2024 to 18/10/2024","category":"exams","file":"d94d2520-d761-4519-97f9-f0fd1a527e25.jpeg","date":"","note":""},
  {"id":16,"title":"MERIT LIST - DET-L 2024-25","category":"admissions","file":"DET-L_MERIT_LIST.pdf","date":"","note":""},
  {"id":17,"title":"MERIT LIST - DET 2024-25","category":"admissions","file":"DET_MERIT_LIST.pdf","date":"","note":""},
  {"id":18,"title":"List of Documents Required for Admission","category":"admissions","file":"d0a7ebbb-d7b6-4459-96ab-4d95f1dc18d0.jpeg","date":"","note":""},
  {"id":19,"title":"Verification for SC/BC students for PMS scholarship","category":"scholarships","file":"2a77d92d-5282-4891-adcf-26dbbc3533d4.jpeg","date":"","note":""},
  {"id":20,"title":"Christmas Leave","category":"events","file":"Holiday.pdf","date":"","note":""},
  {"id":21,"title":"Hawan Ceremony and Hockey Tournament on 24th November 2023","category":"events","file":"77a58295-08fe-4465-9a34-abd2afbde8f1.jpeg","date":"","note":""},
  {"id":22,"title":"Parents Teacher Meeting","category":"events","file":"e2b35a9e-5dbc-42d6-a75e-6e6234cd5b6e.jpeg","date":"","note":""},
  {"id":23,"title":"Decision of UMC Examination Committee","category":"exams","file":"Decision_of_UMC_Committee_Meeting_July_2023.pdf","date":"","note":""},
  {"id":24,"title":"Documents required for admission","category":"admissions","file":"56fec8a8-7693-449e-acf9-151f6e5d8391.jpeg","date":"","note":""},
  {"id":25,"title":"DET result / rank manual counselling","category":"admissions","file":"2445824119.pdf","date":"","note":""},
  {"id":26,"title":"Directions for manual counselling","category":"admissions","file":"","date":"","note":"Candidates on the rank / merit list report on 24.8.23 at 9:00 AM with documents and the admission fee."},
  {"id":27,"title":"DET-L manual counselling merit / rank","category":"admissions","file":"72221ccb-2278-4b4f-8378-743a065f5dcf.jpeg","date":"","note":"Candidates on the rank / merit list report on 24.8.23 at 9:00 AM with documents."},
  {"id":28,"title":"Manual Counselling for Admission in Diploma (DET/DET-L)","category":"admissions","file":"7a1bc903-19a8-4ab6-b294-d82cd0f44b1d_3r0gEWN.jpeg","date":"","note":""},
  {"id":29,"title":"Manual Counselling for Admission in Diploma (DET/DET-L)","category":"admissions","file":"7a1bc903-19a8-4ab6-b294-d82cd0f44b1d.jpeg","date":"","note":""},
  {"id":30,"title":"Revised Datesheet","category":"exams","file":"Revised_Datesheet_for_Diploma_HSBTE_Exam_July__2023.xlsx","date":"","note":""},
  {"id":31,"title":"Final Datesheet for diploma HSBTE exam July 2023","category":"exams","file":"Final_Datesheet_for_Diploma_HSBTE_Exam_July__2023_N4epya9.xlsx","date":"","note":""},
  {"id":32,"title":"Steps to generate Admit Card","category":"exams","file":"UM_Admit_Card.pdf","date":"","note":""},
  {"id":33,"title":"Holiday on account of Id-uz-Zuha","category":"events","file":"8d62f936-fadc-44b2-ac69-7b34b82ce312.jpeg","date":"","note":""},
  {"id":34,"title":"Annual Function: special fine of Rs 500 on absentees","category":"events","file":"30c39a79-4656-4a3e-baf1-1815b7589f6b.jpeg","date":"","note":""},
  {"id":35,"title":"Parents Teacher Meeting on 18.04.2023","category":"events","file":"ptm.jpg","date":"","note":""},
  {"id":36,"title":"62nd Annual Athletic Meet","category":"events","file":"IMG-20230325-WA0000.jpg","date":"","note":""},
  {"id":37,"title":"Internal complaints committee","category":"other","file":"WhatsApp_Image_2023-02-22_at_12.48.57_PM.jpeg","date":"","note":""},
  {"id":38,"title":"Parents Teacher Meeting","category":"events","file":"IMG-20221207-WA0011.jpg","date":"","note":""},
  {"id":39,"title":"Admission Notice 2022","category":"admissions","file":"63296657ccb561894fbcf421.pdf","date":"","note":""},
  {"id":40,"title":"Inviting Tender for Supply of Manpower","category":"tenders","file":"","date":"","note":""},
];

// the Facilities page (src/pages/about/Facilities.jsx) - photos: [large, top-right, bottom-right]
const facilities = [
  {"slug":"labs","label":"Labs","headline":"Hands-On Technical Labs","text":"The Computer Engineering department has five computer labs, including software, networking and hardware labs. All other departments also have highly equipped labs.","photos":["/images/facility-computer-labs.jpg","/images/facilities/labs-2.jpg","/images/facilities/labs-3.jpg"]},
  {"slug":"library","label":"Library","headline":"A Quiet Place to Read","text":"A collection of books, journals, newspapers and other print media that students can use. The library sits in the heart of the institute.","photos":["/images/facility-library.jpg","/images/facilities/library-2.jpg","/images/facilities/library-3.jpg"]},
  {"slug":"workshop","label":"Workshop","headline":"Learning by Doing","text":"The workshop gives students an interactive learning session focused on practical skills, with hands-on activities and collaborative problem-solving.","photos":["/images/facility-workshop.jpg","/images/facilities/workshop-2.jpg","/images/facilities/workshop-3.jpg"]},
  {"slug":"smart-classrooms","label":"Smart Classrooms","headline":"Technology-Led Teaching","text":"Learning spaces enhanced with educational technology, designed to improve the teaching and learning experience.","photos":["/images/facilities/smart-classrooms-1.jpg","/images/facilities/smart-classrooms-2.jpg","/images/facilities/smart-classrooms-3.jpg"]},
  {"slug":"communication-lab","label":"Communication Lab","headline":"Find Your Voice","text":"A lab designed to improve students' communication skills in written, oral and visual forms.","photos":["/images/facilities/communication-lab-1.jpg","/images/facilities/communication-lab-2.jpg","/images/facilities/communication-lab-3.jpg"]},
  {"slug":"conference-hall","label":"Conference Hall","headline":"Built for Seminars","text":"A formal setting for meetings, seminars and professional gatherings, equipped with audio-visual facilities and a podium for presentations.","photos":["/images/facilities/conference-hall-1.jpg","/images/facilities/conference-hall-2.jpg","/images/facilities/conference-hall-3.jpg"]},
  {"slug":"internet","label":"Internet","headline":"Connected Across Campus","text":"Internet access is provided throughout the campus, including classrooms, labs, the library and even the hostels.","photos":["/images/facilities/internet-1.jpg","/images/facilities/internet-2.jpg","/images/facilities/internet-3.jpg"]},
  {"slug":"placement-cell","label":"Placement Cell","headline":"Where Careers Begin","text":"The placement cell has the full infrastructure and a dedicated team, including an auditorium and smart classrooms for tests and interviews.","photos":["/images/facilities/placement-cell-1.jpg","/images/facilities/placement-cell-2.jpg","/images/facilities/placement-cell-3.jpg"]},
  {"slug":"hostels","label":"Hostels","headline":"A Home Away from Home","text":"The institute has one boys' hostel and one girls' hostel. Each is well equipped, with highly spacious rooms and a nicely designed kitchen and mess.","photos":["/images/facility-hostels.jpg","/images/facilities/hostels-2.jpg","/images/facilities/hostels-3.jpg"]},
  {"slug":"girls-common-room","label":"Girls' Common Room","headline":"A Space of Their Own","text":"A designated space for female students, offering a comfortable and safe environment to relax, study and socialise between classes.","photos":["/images/facilities/girls-common-room-1.jpg","/images/facilities/girls-common-room-2.jpg","/images/facilities/girls-common-room-3.jpg"]},
  {"slug":"sports","label":"Sports","headline":"Play Hard, Stay Fit","text":"Students can play volleyball, football, basketball, badminton, kho kho and more.","photos":["/images/facility-sports.jpg","/images/facilities/sports-2.jpg","/images/facilities/sports-3.jpg"]},
  {"slug":"canteen","label":"Canteen","headline":"A Lively Place to Eat","text":"A lively canteen serving hot and cold beverages and packed, hygienic food.","photos":["/images/facilities/canteen-1.jpg","/images/facilities/canteen-2.jpg","/images/facilities/canteen-3.jpg"]},
  {"slug":"parking","label":"Parking","headline":"Easy, Orderly Parking","text":"Designated parking areas for two-wheelers and four-wheelers, with separate areas for students and staff.","photos":["/images/facilities/parking-1.jpg","/images/facilities/parking-2.jpg","/images/facilities/parking-3.jpg"]},
  {"slug":"industrial-visits","label":"Industrial Visits","headline":"Learning Beyond the Classroom","text":"Educational trips take students to companies and organisations, where they see their academic learning applied in practice and bridge the gap between theory and the real world.","photos":["/images/facilities/industrial-visits-1.jpg","/images/facilities/industrial-visits-2.jpg","/images/facilities/industrial-visits-3.jpg"]},
  {"slug":"ncc","label":"NCC","headline":"Discipline and Service","text":"The National Cadet Corps was instituted in 1949. It is the largest youth organisation in the world, contributing to the development of young people across the country.","photos":["/images/facilities/ncc-1.jpg","/images/facilities/ncc-2.jpg","/images/facilities/ncc-3.jpg"]},
  {"slug":"cultural","label":"Cultural Activities","headline":"Celebrate Together","text":"Cultural activities cover a wide range of events and practices that reflect traditions, beliefs and artistic expression, such as celebrations, festivals and rituals.","photos":["/images/facilities/cultural-1.jpg","/images/facilities/cultural-2.jpg","/images/facilities/cultural-3.jpg"]},
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  if (await Notice.countDocuments()) console.log("Notices already in the database - skipped");
  else console.log(`Notices added: ${(await Notice.insertMany(notices.map((row, index) => ({ ...row, order: index })))).length}`);

  if (await Facility.countDocuments()) console.log("Facilities already in the database - skipped");
  else console.log(`Facilities added: ${(await Facility.insertMany(facilities)).length}`);

  await mongoose.disconnect();
}

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});