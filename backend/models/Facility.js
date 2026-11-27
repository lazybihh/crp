const mongoose = require("mongoose");

// Everything the Facilities page stores, in this one file:
//   1) Facility      one row per facility (16 rows today) - its text and its 3 photos
//   2) FacilitiesPage  ONE record with the page-level text and Facilities banner
// (Facilities.jsx keeps a copy of the same starting text to show while loading or when the server is down - keep them in step.)
//
// ---- 1) FACILITY: one facility of the main Facilities page (src/pages/about/Facilities.jsx).
//   photos  always holds its 3 images: [large, top-right, bottom-right]. An empty string = that slot is empty (a "Photo coming soon" tile shows).
//           The Home page picks one of them for its facility tile.
//   points  the highlight rows (up to 8), more = paragraphs under "About this facility" (up to 6), facts = "At a glance" tiles (up to 6).
//   order   position on the Facilities page.
// The icon of each facility stays in the front end (it is chosen by the slug).
const Pair = new mongoose.Schema({ label: String, value: String }, { _id: false });

const FacilitySchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true }, // same id as the Facilities page ("labs", "library"...)
    order: Number,
    label: String,
    headline: String,
    text: String,
    points: [String],
    more: [String],
    facts: [Pair],
    photos: [String],
  },
  { timestamps: true }
);

// The facilities of the Facilities page today. They are added once, when the collection is empty.
const facilities = [
  {"slug": "labs", "order": 1, "label": "Labs", "headline": "Hands-On Technical Labs", "text": "The Computer Engineering department has five computer labs, including software, networking and hardware labs. All other departments also have highly equipped labs.", "points": ["Five labs in the Computer Engineering department", "Software, networking and hardware labs", "Well-equipped labs in every department", "Practical sessions alongside theory classes"], "more": ["Practical work is at the heart of a diploma. The labs let students apply what they learn in class on real equipment and software, building the confidence they need on the job.", "Each department maintains its own labs for its core subjects. In Computer Engineering, the five labs cover software development, networking and hardware."], "facts": [{"label": "Computer labs", "value": "5"}, {"label": "Lab types", "value": "Software, networking, hardware"}, {"label": "Other departments", "value": "Highly equipped labs"}], "photos": ["/images/facility-computer-labs.jpg", "/images/facilities/labs-2.jpg", "/images/facilities/labs-3.jpg"]},
  {"slug": "library", "order": 2, "label": "Library", "headline": "A Quiet Place to Read", "text": "A collection of books, journals, newspapers and other print media that students can use. The library sits in the heart of the institute.", "points": ["Books and journals", "Newspapers and other print media", "Located in the heart of the institute", "A calm space for reading and self-study"], "more": ["The library gives students a quiet place to read, revise and research. Its collection of books, journals and newspapers supports both course work and wider reading.", "The library is in the heart of the institute, making it easy to reach between classes. Its central location supports self-study and group discussion."], "facts": [{"label": "Collection", "value": "Books, journals, newspapers"}, {"label": "Location", "value": "Heart of the institute"}, {"label": "Access", "value": "Open for student use"}], "photos": ["/images/facility-library.jpg", "/images/facilities/library-2.jpg", "/images/facilities/library-3.jpg"]},
  {"slug": "workshop", "order": 3, "label": "Workshop", "headline": "Learning by Doing", "text": "The workshop gives students an interactive learning session focused on practical skills, with hands-on activities and collaborative problem-solving.", "points": ["Practical skill building", "Hands-on activities", "Collaborative problem-solving", "Prepares students for industry practice"], "more": ["The workshop turns classroom theory into skill. Students work with their hands, learn safe practice with tools and machines, and see how a design becomes a finished piece.", "Interactive sessions and group tasks encourage students to solve problems together. This habit carries into their work in industry."], "facts": [{"label": "Focus", "value": "Practical skills"}, {"label": "Format", "value": "Interactive sessions"}, {"label": "Approach", "value": "Hands-on and collaborative"}], "photos": ["/images/facility-workshop.jpg", "/images/facilities/workshop-2.jpg", "/images/facilities/workshop-3.jpg"]},
  {"slug": "smart-classrooms", "order": 4, "label": "Smart Classrooms", "headline": "Technology-Led Teaching", "text": "Learning spaces enhanced with educational technology, designed to improve the teaching and learning experience.", "points": ["Technology-enhanced classrooms", "Improves teaching and learning", "Also used for placement tests and interviews", "Supports modern, interactive lessons"], "more": ["Smart classrooms combine teaching with educational technology, so lessons can include visuals, demonstrations and digital resources alongside the teacher's explanation.", "These rooms are also used on campus for placement tests and interviews, which gives students a familiar, well-equipped setting for important events."], "facts": [{"label": "Type", "value": "Technology-enhanced"}, {"label": "Purpose", "value": "Better teaching and learning"}, {"label": "Also used for", "value": "Placement tests, interviews"}], "photos": ["/images/facilities/smart-classrooms-1.jpg", "/images/facilities/smart-classrooms-2.jpg", "/images/facilities/smart-classrooms-3.jpg"]},
  {"slug": "communication-lab", "order": 5, "label": "Communication Lab", "headline": "Find Your Voice", "text": "A lab designed to improve students' communication skills in written, oral and visual forms.", "points": ["Written communication", "Oral communication", "Visual communication", "Helps with presentations and interviews"], "more": ["Strong communication opens doors in any career. The communication lab helps students practise speaking, writing and presenting with confidence.", "By working on written, oral and visual communication together, students prepare for group discussions, interviews and workplace presentations."], "facts": [{"label": "Focus", "value": "Communication skills"}, {"label": "Forms", "value": "Written, oral, visual"}, {"label": "Setting", "value": "Dedicated lab"}], "photos": ["/images/facilities/communication-lab-1.jpg", "/images/facilities/communication-lab-2.jpg", "/images/facilities/communication-lab-3.jpg"]},
  {"slug": "conference-hall", "order": 6, "label": "Conference Hall", "headline": "Built for Seminars", "text": "A formal setting for meetings, seminars and professional gatherings, equipped with audio-visual facilities and a podium for presentations.", "points": ["Audio-visual facilities", "Podium for presentations", "Seminars, meetings and gatherings", "Suited to guest lectures and events"], "more": ["The conference hall is the institute's formal venue for seminars, meetings and professional gatherings. It is set up for clear presentations.", "The hall has audio-visual equipment and a podium. These features suit guest lectures, workshops and departmental events as well as larger meetings."], "facts": [{"label": "Used for", "value": "Seminars and meetings"}, {"label": "Equipment", "value": "Audio-visual, podium"}, {"label": "Setting", "value": "Formal, professional"}], "photos": ["/images/facilities/conference-hall-1.jpg", "/images/facilities/conference-hall-2.jpg", "/images/facilities/conference-hall-3.jpg"]},
  {"slug": "internet", "order": 7, "label": "Internet", "headline": "Connected Across Campus", "text": "Internet access is provided throughout the campus, including classrooms, labs, the library and even the hostels.", "points": ["Available in classrooms and labs", "Available in the library", "Available in the hostels", "Supports online learning and research"], "more": ["Reliable internet access supports modern learning, from online study material and research to digital notes and assignments.", "Coverage reaches classrooms, labs, the library and the hostels, so students stay connected wherever they study."], "facts": [{"label": "Coverage", "value": "Campus-wide"}, {"label": "Learning areas", "value": "Classrooms, labs, library"}, {"label": "Residential", "value": "Hostels included"}], "photos": ["/images/facilities/internet-1.jpg", "/images/facilities/internet-2.jpg", "/images/facilities/internet-3.jpg"]},
  {"slug": "placement-cell", "order": 8, "label": "Placement Cell", "headline": "Where Careers Begin", "text": "The placement cell has the full infrastructure and a dedicated team, including an auditorium and smart classrooms for tests and interviews.", "points": ["Dedicated placement team", "Auditorium and smart classrooms", "Used for tests and interviews", "Helps students prepare for the job market"], "more": ["The placement cell connects students with employers and prepares them for the selection process. A dedicated team supports this work throughout.", "Tests and interviews are held on campus in the auditorium and smart classrooms, so students face recruiters in a setting they already know."], "facts": [{"label": "Team", "value": "Dedicated placement team"}, {"label": "Spaces", "value": "Auditorium, smart classrooms"}, {"label": "Used for", "value": "Tests and interviews"}], "photos": ["/images/facilities/placement-cell-1.jpg", "/images/facilities/placement-cell-2.jpg", "/images/facilities/placement-cell-3.jpg"]},
  {"slug": "hostels", "order": 9, "label": "Hostels", "headline": "A Home Away from Home", "text": "The institute has one boys' hostel and one girls' hostel. Each is well equipped, with highly spacious rooms and a nicely designed kitchen and mess.", "points": ["Separate boys' and girls' hostels", "Spacious, well-equipped rooms", "Kitchen and mess in each hostel", "A comfortable stay for outstation students"], "more": ["Separate hostels for boys and girls give outstation students a comfortable base close to their classes. Rooms are spacious and well equipped.", "Each hostel has its own kitchen and mess, so residents have regular meals without leaving the campus."], "facts": [{"label": "Hostels", "value": "2 - boys and girls"}, {"label": "Rooms", "value": "Highly spacious"}, {"label": "Dining", "value": "Kitchen and mess"}], "photos": ["/images/facility-hostels.jpg", "/images/facilities/hostels-2.jpg", "/images/facilities/hostels-3.jpg"]},
  {"slug": "girls-common-room", "order": 10, "label": "Girls' Common Room", "headline": "A Space of Their Own", "text": "A designated space for female students, offering a comfortable and safe environment to relax, study and socialise between classes.", "points": ["Reserved for female students", "Comfortable and safe surroundings", "Relax, study or catch up between classes", "A friendly space away from the corridors"], "more": ["The girls' common room is reserved for female students, away from the busy corridors. It offers space for rest, quiet study and conversation.", "Between lectures, it gives students a comfortable place to recharge or catch up with friends. They can also use the room to finish an assignment."], "facts": [{"label": "For", "value": "Female students"}, {"label": "Environment", "value": "Comfortable and safe"}, {"label": "Use", "value": "Relax, study, socialise"}], "photos": ["/images/facilities/girls-common-room-1.jpg", "/images/facilities/girls-common-room-2.jpg", "/images/facilities/girls-common-room-3.jpg"]},
  {"slug": "sports", "order": 11, "label": "Sports", "headline": "Play Hard, Stay Fit", "text": "Students can play volleyball, football, basketball, badminton, kho kho and more.", "points": ["Volleyball and football", "Basketball and badminton", "Kho kho and other games", "Encourages teamwork and fitness"], "more": ["Sport is part of campus life at the institute. Students can play volleyball, football, basketball, badminton and kho kho, among other games.", "Regular play builds fitness, teamwork and discipline, and helps students balance a demanding diploma schedule."], "facts": [{"label": "Games", "value": "5 and more"}, {"label": "Team games", "value": "Volleyball, football, basketball"}, {"label": "Also", "value": "Badminton, kho kho"}], "photos": ["/images/facility-sports.jpg", "/images/facilities/sports-2.jpg", "/images/facilities/sports-3.jpg"]},
  {"slug": "canteen", "order": 12, "label": "Canteen", "headline": "A Lively Place to Eat", "text": "A lively canteen serving hot and cold beverages and packed, hygienic food.", "points": ["Hot and cold beverages", "Packed, hygienic food", "A lively place to meet friends", "Convenient meals during the college day"], "more": ["The campus canteen is a lively meeting point for students and staff. It serves hot and cold beverages and hygienically prepared packed food.", "It keeps students and staff fed and refreshed through the college day, without having to leave the campus. This makes it a convenient stop between classes and activities."], "facts": [{"label": "Drinks", "value": "Hot and cold"}, {"label": "Food", "value": "Packed, hygienic"}, {"label": "Atmosphere", "value": "Lively"}], "photos": ["/images/facilities/canteen-1.jpg", "/images/facilities/canteen-2.jpg", "/images/facilities/canteen-3.jpg"]},
  {"slug": "parking", "order": 13, "label": "Parking", "headline": "Easy, Orderly Parking", "text": "Designated parking areas for two-wheelers and four-wheelers, with separate areas for students and staff.", "points": ["Two-wheeler parking", "Four-wheeler parking", "Separate areas for students and staff", "Keeps the campus entrance orderly"], "more": ["Designated parking areas keep the campus tidy and the entrance clear. Two-wheelers and four-wheelers have their own spaces.", "Students and staff park in separate areas, which keeps traffic organised through the day."], "facts": [{"label": "Vehicles", "value": "Two- and four-wheelers"}, {"label": "Areas", "value": "Designated spaces"}, {"label": "Separation", "value": "Students and staff"}], "photos": ["/images/facilities/parking-1.jpg", "/images/facilities/parking-2.jpg", "/images/facilities/parking-3.jpg"]},
  {"slug": "industrial-visits", "order": 14, "label": "Industrial Visits", "headline": "Learning Beyond the Classroom", "text": "Educational trips take students to companies and organisations, where they see their academic learning applied in practice and bridge the gap between theory and the real world.", "points": ["Visits to companies and organisations", "See classroom learning in practice", "Bridges theory and the real world", "Builds industry awareness before placements"], "more": ["Industrial visits take students out of the classroom and into working companies and organisations, where they watch their subjects applied in practice.", "Seeing real processes, machines and teams first-hand bridges the gap between theory and the real world, and prepares students for placement and their first job."], "facts": [{"label": "Where", "value": "Companies, organisations"}, {"label": "Aim", "value": "Practical application"}, {"label": "Outcome", "value": "Theory meets practice"}], "photos": ["/images/facilities/industrial-visits-1.jpg", "/images/facilities/industrial-visits-2.jpg", "/images/facilities/industrial-visits-3.jpg"]},
  {"slug": "ncc", "order": 15, "label": "NCC", "headline": "Discipline and Service", "text": "The National Cadet Corps was instituted in 1949. It is the largest youth organisation in the world, contributing to the development of young people across the country.", "points": ["Instituted in 1949", "The largest youth organisation in the world", "Contributes to youth development", "Builds discipline, leadership and service"], "more": ["The National Cadet Corps was instituted in 1949 and is the largest youth organisation in the world. The institute offers NCC activity to its students.", "Cadets develop discipline, leadership and a spirit of service. NCC activities give students opportunities to practise these qualities."], "facts": [{"label": "Instituted", "value": "1949"}, {"label": "Scale", "value": "Largest youth organisation"}, {"label": "Purpose", "value": "Youth development"}], "photos": ["/images/facilities/ncc-1.jpg", "/images/facilities/ncc-2.jpg", "/images/facilities/ncc-3.jpg"]},
  {"slug": "cultural", "order": 16, "label": "Cultural Activities", "headline": "Celebrate Together", "text": "Cultural activities cover a wide range of events and practices that reflect traditions, beliefs and artistic expression, such as celebrations, festivals and rituals.", "points": ["Celebrations and festivals", "Traditions and rituals", "A platform for artistic expression", "Brings the campus community together"], "more": ["Cultural activities bring the campus together through celebrations, festivals and other events that reflect tradition and artistic expression. Students can take part in organising and enjoying these occasions.", "They give students a stage beyond academics to perform, organise and take part alongside their classmates. These activities also let students share their interests with the campus community."], "facts": [{"label": "Events", "value": "Celebrations, festivals"}, {"label": "Practices", "value": "Traditions, rituals"}, {"label": "Expression", "value": "Artistic"}], "photos": ["/images/facilities/cultural-1.jpg", "/images/facilities/cultural-2.jpg", "/images/facilities/cultural-3.jpg"]}
];

// 1) empty collection -> add all facilities.
// 2) a database made with the first version (only label, headline, text, photos) -> add the new fields to the rows that do not have them yet.
//    Nothing that was already saved is changed or overwritten.
FacilitySchema.statics.seed = async function () {
  for (const item of facilities) {
    // Add the facility if it does not already exist.
    // Existing facility content and admin edits are preserved.
    await this.updateOne(
      { slug: item.slug },
      {
        $setOnInsert: item,
      },
      { upsert: true }
    );

    // Add missing fields to older database records.
    await this.updateOne(
      { slug: item.slug, points: { $exists: false } },
      { $set: { points: item.points } }
    );

    await this.updateOne(
      { slug: item.slug, more: { $exists: false } },
      { $set: { more: item.more } }
    );

    await this.updateOne(
      { slug: item.slug, facts: { $exists: false } },
      { $set: { facts: item.facts } }
    );

    await this.updateOne(
      { slug: item.slug, order: { $exists: false } },
      { $set: { order: item.order } }
    );

    await this.updateOne(
      { slug: item.slug, photos: { $exists: false } },
      { $set: { photos: item.photos } }
    );
  }

  console.log(`Facilities checked and missing records added: ${facilities.length}`);
};

const Facility = mongoose.model("Facility", FacilitySchema);

// ---- 2) FACILITIES PAGE: the page-level text, one record. Not editable in the admin (they stay in Facilities.jsx): the two banner
// tags, the breadcrumb and the facility icons. The "default" values are the starting text: the record is created from them.
const PagePair = new mongoose.Schema({ value: String, label: String }, { _id: false });

const FacilitiesPageSchema = new mongoose.Schema(
  {
    bannerImage: { type: String, default: "/images/campus-2.jpg" },
    intro: {
      eyebrow: { type: String, default: "About us" },
      title: { type: String, default: "Facilities" },
      lead: { type: String, default: "Hostels, labs, a library, sports and a hands-on workshop - everything a diploma student needs on one campus. Pick a facility below to see what it offers." },
    },
    // an empty first number shows the live count of facilities
    stats: {
      type: [PagePair],
      default: () => [
        { value: "", label: "Campus facilities" },
        { value: "2", label: "Hostels, boys and girls" },
        { value: "5", label: "Computer labs" },
        { value: "5+", label: "Sports and games" },
      ],
    },
    explore: {
      eyebrow: { type: String, default: "Choose a facility" },
      titleStart: { type: String, default: "Explore Each" },
      titleHighlight: { type: String, default: "Facility" },
    },
    panel: {
      aboutHeading: { type: String, default: "About this facility" },
      factsHeading: { type: String, default: "At a glance" },
      photoPlaceholder: { type: String, default: "Photo coming soon" },
    },
    closingStats: {
      type: [PagePair],
      default: () => [
        { value: "6", label: "Diploma programmes" },
        { value: "342", label: "Approved seats" },
        { value: "1956", label: "Serving students since" },
        { value: "1949", label: "NCC unit instituted" },
      ],
    },
  },
  { timestamps: true }
);

FacilitiesPageSchema.statics.seed = async function () {
  if (!(await this.countDocuments())) {
    await this.create({});
    console.log("Facilities page text added");
    return;
  }
  await this.updateOne({ bannerImage: { $exists: false } }, { $set: { bannerImage: "/images/campus-2.jpg" } });
};

const FacilitiesPage = mongoose.model("FacilitiesPage", FacilitiesPageSchema);

// The Facility model is the main export (the Home page uses it too); the page-text model hangs on it:
//   const Facility = require("./models/Facility");   const { FacilitiesPage } = Facility;

module.exports = Facility;
module.exports.FacilitiesPage = FacilitiesPage;