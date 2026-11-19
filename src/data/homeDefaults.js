// homeDefaults.js - what the Home page shows until the admin saves it for the first time.
// After the first save everything comes from the database. The Home page and the Home admin editor both use this file.
// Icons and the banner tags are not here - they stay in Home.jsx.

const img = (file) => `/images/${file}`;

export const homeDefaults = {
  banners: [
    { image: img("campus-workshop.jpg"), alt: "Chhotu Ram Polytechnic campus" },
    { image: img("campus-2.jpg"), alt: "Chhotu Ram Polytechnic campus" },
    { image: img("campus-3.jpg"), alt: "Chhotu Ram Polytechnic campus" },
  ],

  // REAL: the one headline the live home page shows. lang: "hi" Hindi, "en" English. to: page to open on click ("" = plain text).
  latestNews: [
    { text: "छोटू राम पॉलीटेक्निक में प्रदर्शनी, प्रधान गुलाब दिमाना व प्राचार्य सितेंद्र पावड़िया ने बढ़ाया छात्रों का हौसला", lang: "hi", to: "" },
  ],

  stats: [
    { value: "6", label: "Diploma programmes" },
    { value: "342", label: "Approved seats" },
    { value: "1956", label: "Serving students since" },
    { value: "1949", label: "NCC unit instituted" },
  ],

  reasons: [
    { title: "Practical learning", text: "Build skills through workshops, laboratories and hands-on diploma training." },
    { title: "Industry exposure", text: "Connect classroom learning with industrial visits, training and placement activities." },
    { title: "A supportive campus", text: "Learn in a campus community with student activities, facilities and guidance." },
    { title: "A proud legacy", text: "Be part of an institute with a long-standing contribution to technical education." },
  ],

  principal: {
    eyebrow: "From the Principal's desk",
    quote: "We do not only teach a trade - we help young people become confident, employable engineers.",
    paragraphs: [
      "Chhotu Ram Polytechnic began with two-year draftsman courses and has grown into one of the leading technical institutes in the region. Our strength is the link between classroom, workshop and industry.",
      "Every student here gets practical training, industrial exposure and a placement cell that works all year. I invite you to visit the campus and see it for yourself.",
    ],
    name: "Dr. Sitender Kumar",
    role: "Principal, Chhotu Ram Polytechnic",
    photo: img("principal.png"),
    link: { label: "Read the full message", to: "/about/principal-message" },
  },

  news: {
    tag: "Latest news",
    title: "Students and guests at the institute's annual exhibition",
    text: "The institute's exhibition drew students, faculty and guests, who were encouraged by the President and the Principal to keep building and presenting their work.",
    image: img("news-1.jpg"),
  },

  dignitaries: [
    {
      name: "Deenbandhu Sir Chhotu Ram",
      role: "The Messiah of Farmers",
      text: "A great statesman, social reformer and the voice of the farmers. His vision for rural upliftment and education continues to inspire us.",
      image: img("leader-chhotu-ram.jpg"),
      initials: "CR",
    },
    {
      name: "Sh. Gulab Singh",
      role: "President, JES Society (Regd.)",
      text: "Committed to providing better academic and infrastructure facilities for the overall growth of our students.",
      image: img("leader-gulab-singh.jpg"),
      initials: "GS",
    },
    {
      name: "Dr. Sitender Kumar",
      role: "Principal, Chhotu Ram Polytechnic",
      text: "Dedicated to maintaining high standards of technical education and ensuring a bright and successful future for our students.",
      image: img("principal.png"),
      initials: "SK",
    },
  ],

  highlights: [
    {
      id: "events",
      title: "Upcoming events",
      image: img("events.jpg"),
      items: [
        { date: "Dec 2026", text: "Annual technical exhibition" },
        { date: "Jan 2027", text: "Republic Day parade and NCC display" },
        { date: "Feb 2027", text: "Cultural fest" },
      ],
    },
    {
      id: "achievements",
      title: "Achievements",
      image: img("achievements.jpg"),
      items: [
        { date: "2026", text: "NCC cadets selected for state camp" },
        { date: "2026", text: "Students win inter-polytechnic sports meet" },
        { date: "2025", text: "Project showcase recognised by industry guests" },
      ],
    },
    {
      id: "placement",
      title: "Placement activities",
      image: img("placement-activities.jpg"),
      items: [
        { date: "23 Feb 2026", text: "Campus drive by VVDN Technologies, Manesar, in the Conference Hall" },
        { date: "2026", text: "Industrial visits for 3rd and 5th semester students" },
      ],
    },
  ],

  // used only while no facility tiles are saved: { id = facility id on the Facilities page, name, text, image }
  facilityTiles: [
    { id: "hostels", name: "Hostels", image: img("facility-hostels.jpg"), text: "Separate boys' and girls' hostels with spacious rooms, a kitchen and a mess." },
    { id: "labs", name: "Computer labs", image: img("facility-computer-labs.jpg"), text: "Five labs for software, networking and hardware." },
    { id: "library", name: "Library", image: img("facility-library.jpg"), text: "Books, journals and newspapers in a quiet, central space." },
    { id: "sports", name: "Sports", image: img("facility-sports.jpg"), text: "Volleyball, football, basketball, badminton and kho kho." },
    { id: "workshop", name: "Workshop", image: img("facility-workshop.jpg"), text: "Hands-on sessions that build practical skills and teamwork." },
  ],

  courses: [
    { id: "civil", name: "Civil Engineering", seats: 60, tag: "", text: "One of the broadest engineering fields - buildings, roads, water and the structures around us." },
    { id: "computer", name: "Computer Engineering", seats: 54, tag: "", text: "Software development and testing, networking and hardware." },
    { id: "electrical", name: "Electrical Engineering", seats: 60, tag: "", text: "Power, machines and control, taught with a mission of high-quality education." },
    { id: "electronics", name: "Electronics & Communication", seats: 54, tag: "", text: "The study and application of physics to design and operate electronic devices." },
    { id: "mechanical", name: "Mechanical Engineering", seats: 60, tag: "", text: "Design, development, building and testing of things that move." },
    { id: "plastic", name: "Plastic Technology", seats: 54, tag: "", text: "How plastics replace everyday and engineering items - materials, moulding and processing." },
    { id: "applied-science", name: "Applied Sciences", seats: 0, tag: "Foundation", text: "Communication skills, physics, chemistry and mathematics in the first two semesters." },
    { id: "workshop", name: "Workshop Department", seats: 0, tag: "Practical", text: "An intensive, short-duration hands-on learning experience." },
  ],

  recruiters: [
    { name: "HCL", logo: img("recruiter-hcl.jpg") },
    { name: "Jindal Steel & Power", logo: img("recruiter-jindal-steel-power.jpg") },
    { name: "Tata Motors", logo: img("recruiter-tata-motors.jpg") },
    { name: "Tech Mahindra", logo: img("recruiter-tech-mahindra.jpg") },
  ],

  sectionContent: {
    whyChooseUs: { eyebrow: "The Chhotu Ram advantage", title: "Why choose Us?", description: "A learning environment that brings technical knowledge, practical experience and student growth together." },
    leadership: { eyebrow: "Our leadership", title: "Guided by vision and leadership" },
    notices: { eyebrow: "Stay informed", title: "News & notices" },
    highlights: { eyebrow: "Life at the campus", title: "Events, achievements & placements" },
    facilities: { eyebrow: "Campus", title: "Facilities that support every student", description: "Hostels, labs, a library, sports and a hands-on workshop - everything a diploma student needs on one campus." },
    courses: { eyebrow: "Programmes", title: "Our courses", description: "Six three-year diplomas approved by DTE Haryana and AICTE, supported by two foundation departments." },
    recruiters: { eyebrow: "Placements", title: "Our recruiters" },
  },

  noticeIds: [],
  facilities: [],
};

// Saved content wins over the defaults. Before the first save (no saved record) the defaults are used as they are.
export function mergeHome(saved) {
  if (!saved || !saved._id) return { ...homeDefaults, notices: saved?.notices, facilityTiles: saved?.facilityTiles?.length ? saved.facilityTiles : homeDefaults.facilityTiles };

  const merged = { ...homeDefaults };
  Object.keys(homeDefaults).forEach((key) => {
    if (saved[key] === undefined) return;
    const value = homeDefaults[key];
    merged[key] = Array.isArray(value) ? saved[key] : { ...value, ...saved[key] };
  });
  merged.notices = saved.notices;
  merged.facilityTiles = saved.facilityTiles?.length ? saved.facilityTiles : homeDefaults.facilityTiles;
  return merged;
}