// Facilities.jsx - About us > Facilities (route: /about/facilities).
// Page order: hero -> title + stat card -> tabbed explorer -> institute stats strip.
//
// Every facility below is one object in the `facilities` list:
//   label     short name on the tab button
//   headline  title shown in the panel
//   text      main description
//   points    up to 8 highlight rows
//   more      up to 6 paragraphs under "About this facility"
//   facts     up to 6 "At a glance" tiles, each { label, value }
//   photos    exactly 3 local paths: [large, top-right, bottom-right]
// Leave `more` or `facts` empty ([]) to hide that block.
//
// PHOTOS: images live in public/images/; unavailable photos show a "Photo coming soon" tile.
// Nothing is loaded from another website. A missing file shows a clean "Photo coming soon" tile.
//
// DATABASE: the banner, text and photos come from the database (edited in Admin > About us > Facilities).
// The lists in this file are only the starting copy that shows while loading or when the server is down - keep them in step with
// backend/models/Facility.js and backend/models/FacilitiesPage.js. Icons are chosen here, by the facility's id.
//
// Styles are in Facilities.css (every class starts with "fac-").
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight, FiCheckCircle, FiImage, FiHome, FiMonitor, FiBookOpen, FiActivity, FiTool,
  FiMic, FiWifi, FiUsers, FiTruck, FiCoffee, FiBriefcase, FiAward, FiFlag, FiCpu, FiNavigation, FiMusic,
} from "react-icons/fi";
import { getFacilities, mediaUrl } from "../../services/facilityService";
import "./Facilities.css";

const hero = { image: "/images/pages-banner.png" }; // if it is missing a patterned navy banner shows instead

const fallbackIntro = {
  eyebrow: "About us",
  title: "Facilities",
  lead: "Hostels, labs, a library, sports and a hands-on workshop - everything a diploma student needs on one campus. Pick a facility below to see what it offers.",
};

const fallbackFacilities = [
  {
    id: "labs",
    label: "Labs",
    icon: FiMonitor,
    headline: "Hands-On Technical Labs",
    text: "The Computer Engineering department has five computer labs, including software, networking and hardware labs. All other departments also have highly equipped labs.",
    points: ["Five labs in the Computer Engineering department", "Software, networking and hardware labs", "Well-equipped labs in every department", "Practical sessions alongside theory classes"],
    more: [
      "Practical work is at the heart of a diploma. The labs let students apply what they learn in class on real equipment and software, building the confidence they need on the job.",
      "Each department maintains its own labs for its core subjects. In Computer Engineering, the five labs cover software development, networking and hardware.",
    ],
    facts: [
      { label: "Computer labs", value: "5" },
      { label: "Lab types", value: "Software, networking, hardware" },
      { label: "Other departments", value: "Highly equipped labs" },
    ],
    photos: ["/images/facility-computer-labs.jpg", "/images/facilities/labs-2.jpg", "/images/facilities/labs-3.jpg"],
  },
  {
    id: "library",
    label: "Library",
    icon: FiBookOpen,
    headline: "A Quiet Place to Read",
    text: "A collection of books, journals, newspapers and other print media that students can use. The library sits in the heart of the institute.",
    points: ["Books and journals", "Newspapers and other print media", "Located in the heart of the institute", "A calm space for reading and self-study"],
    more: [
      "The library gives students a quiet place to read, revise and research. Its collection of books, journals and newspapers supports both course work and wider reading.",
      "The library is in the heart of the institute, making it easy to reach between classes. Its central location supports self-study and group discussion.",
    ],
    facts: [
      { label: "Collection", value: "Books, journals, newspapers" },
      { label: "Location", value: "Heart of the institute" },
      { label: "Access", value: "Open for student use" },
    ],
    photos: ["/images/facility-library.jpg", "/images/facilities/library-2.jpg", "/images/facilities/library-3.jpg"],
  },
  {
    id: "workshop",
    label: "Workshop",
    icon: FiTool,
    headline: "Learning by Doing",
    text: "The workshop gives students an interactive learning session focused on practical skills, with hands-on activities and collaborative problem-solving.",
    points: ["Practical skill building", "Hands-on activities", "Collaborative problem-solving", "Prepares students for industry practice"],
    more: [
      "The workshop turns classroom theory into skill. Students work with their hands, learn safe practice with tools and machines, and see how a design becomes a finished piece.",
      "Interactive sessions and group tasks encourage students to solve problems together. This habit carries into their work in industry.",
    ],
    facts: [
      { label: "Focus", value: "Practical skills" },
      { label: "Format", value: "Interactive sessions" },
      { label: "Approach", value: "Hands-on and collaborative" },
    ],
    photos: ["/images/facility-workshop.jpg", "/images/facilities/workshop-2.jpg", "/images/facilities/workshop-3.jpg"],
  },
  {
    id: "smart-classrooms",
    label: "Smart Classrooms",
    icon: FiCpu,
    headline: "Technology-Led Teaching",
    text: "Learning spaces enhanced with educational technology, designed to improve the teaching and learning experience.",
    points: ["Technology-enhanced classrooms", "Improves teaching and learning", "Also used for placement tests and interviews", "Supports modern, interactive lessons"],
    more: [
      "Smart classrooms combine teaching with educational technology, so lessons can include visuals, demonstrations and digital resources alongside the teacher's explanation.",
      "These rooms are also used on campus for placement tests and interviews, which gives students a familiar, well-equipped setting for important events.",
    ],
    facts: [
      { label: "Type", value: "Technology-enhanced" },
      { label: "Purpose", value: "Better teaching and learning" },
      { label: "Also used for", value: "Placement tests, interviews" },
    ],
    photos: ["/images/facilities/smart-classrooms-1.jpg", "/images/facilities/smart-classrooms-2.jpg", "/images/facilities/smart-classrooms-3.jpg"],
  },
  {
    id: "communication-lab",
    label: "Communication Lab",
    icon: FiMic,
    headline: "Find Your Voice",
    text: "A lab designed to improve students' communication skills in written, oral and visual forms.",
    points: ["Written communication", "Oral communication", "Visual communication", "Helps with presentations and interviews"],
    more: [
      "Strong communication opens doors in any career. The communication lab helps students practise speaking, writing and presenting with confidence.",
      "By working on written, oral and visual communication together, students prepare for group discussions, interviews and workplace presentations.",
    ],
    facts: [
      { label: "Focus", value: "Communication skills" },
      { label: "Forms", value: "Written, oral, visual" },
      { label: "Setting", value: "Dedicated lab" },
    ],
    photos: ["/images/facilities/communication-lab-1.jpg", "/images/facilities/communication-lab-2.jpg", "/images/facilities/communication-lab-3.jpg"],
  },
  {
    id: "conference-hall",
    label: "Conference Hall",
    icon: FiAward,
    headline: "Built for Seminars",
    text: "A formal setting for meetings, seminars and professional gatherings, equipped with audio-visual facilities and a podium for presentations.",
    points: ["Audio-visual facilities", "Podium for presentations", "Seminars, meetings and gatherings", "Suited to guest lectures and events"],
    more: [
      "The conference hall is the institute's formal venue for seminars, meetings and professional gatherings. It is set up for clear presentations.",
      "The hall has audio-visual equipment and a podium. These features suit guest lectures, workshops and departmental events as well as larger meetings.",
    ],
    facts: [
      { label: "Used for", value: "Seminars and meetings" },
      { label: "Equipment", value: "Audio-visual, podium" },
      { label: "Setting", value: "Formal, professional" },
    ],
    photos: ["/images/facilities/conference-hall-1.jpg", "/images/facilities/conference-hall-2.jpg", "/images/facilities/conference-hall-3.jpg"],
  },
  {
    id: "internet",
    label: "Internet",
    icon: FiWifi,
    headline: "Connected Across Campus",
    text: "Internet access is provided throughout the campus, including classrooms, labs, the library and even the hostels.",
    points: ["Available in classrooms and labs", "Available in the library", "Available in the hostels", "Supports online learning and research"],
    more: [
      "Reliable internet access supports modern learning, from online study material and research to digital notes and assignments.",
      "Coverage reaches classrooms, labs, the library and the hostels, so students stay connected wherever they study.",
    ],
    facts: [
      { label: "Coverage", value: "Campus-wide" },
      { label: "Learning areas", value: "Classrooms, labs, library" },
      { label: "Residential", value: "Hostels included" },
    ],
    photos: ["/images/facilities/internet-1.jpg", "/images/facilities/internet-2.jpg", "/images/facilities/internet-3.jpg"],
  },
  {
    id: "placement-cell",
    label: "Placement Cell",
    icon: FiBriefcase,
    headline: "Where Careers Begin",
    text: "The placement cell has the full infrastructure and a dedicated team, including an auditorium and smart classrooms for tests and interviews.",
    points: ["Dedicated placement team", "Auditorium and smart classrooms", "Used for tests and interviews", "Helps students prepare for the job market"],
    more: [
      "The placement cell connects students with employers and prepares them for the selection process. A dedicated team supports this work throughout.",
      "Tests and interviews are held on campus in the auditorium and smart classrooms, so students face recruiters in a setting they already know.",
    ],
    facts: [
      { label: "Team", value: "Dedicated placement team" },
      { label: "Spaces", value: "Auditorium, smart classrooms" },
      { label: "Used for", value: "Tests and interviews" },
    ],
    photos: ["/images/facilities/placement-cell-1.jpg", "/images/facilities/placement-cell-2.jpg", "/images/facilities/placement-cell-3.jpg"],
  },
  {
    id: "hostels",
    label: "Hostels",
    icon: FiHome,
    headline: "A Home Away from Home",
    text: "The institute has one boys' hostel and one girls' hostel. Each is well equipped, with highly spacious rooms and a nicely designed kitchen and mess.",
    points: ["Separate boys' and girls' hostels", "Spacious, well-equipped rooms", "Kitchen and mess in each hostel", "A comfortable stay for outstation students"],
    more: [
      "Separate hostels for boys and girls give outstation students a comfortable base close to their classes. Rooms are spacious and well equipped.",
      "Each hostel has its own kitchen and mess, so residents have regular meals without leaving the campus.",
    ],
    facts: [
      { label: "Hostels", value: "2 - boys and girls" },
      { label: "Rooms", value: "Highly spacious" },
      { label: "Dining", value: "Kitchen and mess" },
    ],
    photos: ["/images/facility-hostels.jpg", "/images/facilities/hostels-2.jpg", "/images/facilities/hostels-3.jpg"],
  },
  {
    id: "girls-common-room",
    label: "Girls' Common Room",
    icon: FiUsers,
    headline: "A Space of Their Own",
    text: "A designated space for female students, offering a comfortable and safe environment to relax, study and socialise between classes.",
    points: ["Reserved for female students", "Comfortable and safe surroundings", "Relax, study or catch up between classes", "A friendly space away from the corridors"],
    more: [
      "The girls' common room is reserved for female students, away from the busy corridors. It offers space for rest, quiet study and conversation.",
      "Between lectures, it gives students a comfortable place to recharge or catch up with friends. They can also use the room to finish an assignment.",
    ],
    facts: [
      { label: "For", value: "Female students" },
      { label: "Environment", value: "Comfortable and safe" },
      { label: "Use", value: "Relax, study, socialise" },
    ],
    photos: ["/images/facilities/girls-common-room-1.jpg", "/images/facilities/girls-common-room-2.jpg", "/images/facilities/girls-common-room-3.jpg"],
  },
  {
    id: "sports",
    label: "Sports",
    icon: FiActivity,
    headline: "Play Hard, Stay Fit",
    text: "Students can play volleyball, football, basketball, badminton, kho kho and more.",
    points: ["Volleyball and football", "Basketball and badminton", "Kho kho and other games", "Encourages teamwork and fitness"],
    more: [
      "Sport is part of campus life at the institute. Students can play volleyball, football, basketball, badminton and kho kho, among other games.",
      "Regular play builds fitness, teamwork and discipline, and helps students balance a demanding diploma schedule.",
    ],
    facts: [
      { label: "Games", value: "5 and more" },
      { label: "Team games", value: "Volleyball, football, basketball" },
      { label: "Also", value: "Badminton, kho kho" },
    ],
    photos: ["/images/facility-sports.jpg", "/images/facilities/sports-2.jpg", "/images/facilities/sports-3.jpg"],
  },
  {
    id: "canteen",
    label: "Canteen",
    icon: FiCoffee,
    headline: "A Lively Place to Eat",
    text: "A lively canteen serving hot and cold beverages and packed, hygienic food.",
    points: ["Hot and cold beverages", "Packed, hygienic food", "A lively place to meet friends", "Convenient meals during the college day"],
    more: [
      "The campus canteen is a lively meeting point for students and staff. It serves hot and cold beverages and hygienically prepared packed food.",
      "It keeps students and staff fed and refreshed through the college day, without having to leave the campus. This makes it a convenient stop between classes and activities.",
    ],
    facts: [
      { label: "Drinks", value: "Hot and cold" },
      { label: "Food", value: "Packed, hygienic" },
      { label: "Atmosphere", value: "Lively" },
    ],
    photos: ["/images/facilities/canteen-1.jpg", "/images/facilities/canteen-2.jpg", "/images/facilities/canteen-3.jpg"],
  },
  {
    id: "parking",
    label: "Parking",
    icon: FiTruck,
    headline: "Easy, Orderly Parking",
    text: "Designated parking areas for two-wheelers and four-wheelers, with separate areas for students and staff.",
    points: ["Two-wheeler parking", "Four-wheeler parking", "Separate areas for students and staff", "Keeps the campus entrance orderly"],
    more: [
      "Designated parking areas keep the campus tidy and the entrance clear. Two-wheelers and four-wheelers have their own spaces.",
      "Students and staff park in separate areas, which keeps traffic organised through the day.",
    ],
    facts: [
      { label: "Vehicles", value: "Two- and four-wheelers" },
      { label: "Areas", value: "Designated spaces" },
      { label: "Separation", value: "Students and staff" },
    ],
    photos: ["/images/facilities/parking-1.jpg", "/images/facilities/parking-2.jpg", "/images/facilities/parking-3.jpg"],
  },
  {
    id: "industrial-visits",
    label: "Industrial Visits",
    icon: FiNavigation,
    headline: "Learning Beyond the Classroom",
    text: "Educational trips take students to companies and organisations, where they see their academic learning applied in practice and bridge the gap between theory and the real world.",
    points: ["Visits to companies and organisations", "See classroom learning in practice", "Bridges theory and the real world", "Builds industry awareness before placements"],
    more: [
      "Industrial visits take students out of the classroom and into working companies and organisations, where they watch their subjects applied in practice.",
      "Seeing real processes, machines and teams first-hand bridges the gap between theory and the real world, and prepares students for placement and their first job.",
    ],
    facts: [
      { label: "Where", value: "Companies, organisations" },
      { label: "Aim", value: "Practical application" },
      { label: "Outcome", value: "Theory meets practice" },
    ],
    photos: ["/images/facilities/industrial-visits-1.jpg", "/images/facilities/industrial-visits-2.jpg", "/images/facilities/industrial-visits-3.jpg"],
  },
  {
    id: "ncc",
    label: "NCC",
    icon: FiFlag,
    headline: "Discipline and Service",
    text: "The National Cadet Corps was instituted in 1949. It is the largest youth organisation in the world, contributing to the development of young people across the country.",
    points: ["Instituted in 1949", "The largest youth organisation in the world", "Contributes to youth development", "Builds discipline, leadership and service"],
    more: [
      "The National Cadet Corps was instituted in 1949 and is the largest youth organisation in the world. The institute offers NCC activity to its students.",
      "Cadets develop discipline, leadership and a spirit of service. NCC activities give students opportunities to practise these qualities.",
    ],
    facts: [
      { label: "Instituted", value: "1949" },
      { label: "Scale", value: "Largest youth organisation" },
      { label: "Purpose", value: "Youth development" },
    ],
    photos: ["/images/facilities/ncc-1.jpg", "/images/facilities/ncc-2.jpg", "/images/facilities/ncc-3.jpg"],
  },
  {
    id: "cultural",
    label: "Cultural Activities",
    icon: FiMusic,
    headline: "Celebrate Together",
    text: "Cultural activities cover a wide range of events and practices that reflect traditions, beliefs and artistic expression, such as celebrations, festivals and rituals.",
    points: ["Celebrations and festivals", "Traditions and rituals", "A platform for artistic expression", "Brings the campus community together"],
    more: [
      "Cultural activities bring the campus together through celebrations, festivals and other events that reflect tradition and artistic expression. Students can take part in organising and enjoying these occasions.",
      "They give students a stage beyond academics to perform, organise and take part alongside their classmates. These activities also let students share their interests with the campus community.",
    ],
    facts: [
      { label: "Events", value: "Celebrations, festivals" },
      { label: "Practices", value: "Traditions, rituals" },
      { label: "Expression", value: "Artistic" },
    ],
    photos: ["/images/facilities/cultural-1.jpg", "/images/facilities/cultural-2.jpg", "/images/facilities/cultural-3.jpg"],
  },
];

// The top stat card: an empty first number shows the live count of facilities, so "Campus facilities" never goes out of date.
const fallbackStats = [
  { value: "", label: "Campus facilities" },
  { value: "2", label: "Hostels, boys and girls" },
  { value: "5", label: "Computer labs" },
  { value: "5+", label: "Sports and games" },
];

const fallbackClosingStats = [
  { value: "6", label: "Diploma programmes" },
  { value: "342", label: "Approved seats" },
  { value: "1956", label: "Serving students since" },
  { value: "1949", label: "NCC unit instituted" },
];

// The page-level text (the starting copy of backend/models/FacilitiesPage.js).
const fallbackPage = {
  intro: fallbackIntro,
  stats: fallbackStats,
  explore: { eyebrow: "Choose a facility", titleStart: "Explore Each", titleHighlight: "Facility" },
  panel: { aboutHeading: "About this facility", factsHeading: "At a glance", photoPlaceholder: "Photo coming soon" },
  closingStats: fallbackClosingStats,
};

// each facility's icon, by its id (a facility from the database is matched to its icon by its slug)
const iconById = Object.fromEntries(fallbackFacilities.map((item) => [item.id, item.icon]));

// a database row -> the shape this page uses (always 3 photo slots; an empty one shows the placeholder tile)
const fromDatabase = (row) => ({
  id: row.slug,
  label: row.label || "",
  icon: iconById[row.slug] || FiImage,
  headline: row.headline || "",
  text: row.text || "",
  points: row.points || [],
  more: row.more || [],
  facts: row.facts || [],
  photos: [0, 1, 2].map((index) => mediaUrl(row.photos?.[index] || "")),
});

const pad = (n) => String(n).padStart(2, "0");

// One photo slot. If the file is missing, a clean placeholder tile is shown instead.
function Photo({ src, alt, Icon, className, placeholder }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className={`fac-photo ${className}`}>
      {src && !failed ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      ) : (
        <div className="fac-photo__empty" aria-hidden="true">
          <Icon />
          <span>{placeholder}</span>
        </div>
      )}
    </figure>
  );
}

export default function Facilities() {
  // /about/facilities?facility=hostels opens that tab (the Home page facility cards link here)
  const [params] = useSearchParams();
  const [content, setContent] = useState({ page: fallbackPage, facilities: fallbackFacilities });
  const { page, facilities } = content;
  const total = facilities.length;
  const wantedId = params.get("facility");
  const wanted = facilities.findIndex((item) => item.id === wantedId);
  const [active, setActive] = useState(wanted >= 0 ? wanted : 0);
  const [heroImage, setHeroImage] = useState(hero.image);

  // the text and photos come from the database; until they arrive (or if the server is down) the copy in this file is shown
  useEffect(() => {
    getFacilities()
      .then(({ page: saved, facilities: rows }) => {
        if (saved.bannerImage) setHeroImage(mediaUrl(saved.bannerImage) || hero.image);
        setContent({
          page: {
            intro: { ...fallbackPage.intro, ...saved.intro },
            stats: saved.stats ?? fallbackPage.stats,
            explore: { ...fallbackPage.explore, ...saved.explore },
            panel: { ...fallbackPage.panel, ...saved.panel },
            closingStats: saved.closingStats ?? fallbackPage.closingStats,
          },
          facilities: rows.map(fromDatabase),
        });
      })
      .catch(() => {});
  }, []);

  // when the list arrives or changes, keep the open tab valid (and open the facility named in the link, if any)
  useEffect(() => {
    const index = facilities.findIndex((item) => item.id === wantedId);
    setActive((now) => (index >= 0 ? index : Math.min(now, Math.max(facilities.length - 1, 0))));
  }, [facilities, wantedId]);

  // coming from a Home card: bring the facility panel into view instead of leaving the visitor at the top
  useEffect(() => {
    if (wanted < 0) return undefined;
    const timer = setTimeout(() => document.getElementById("explore")?.scrollIntoView({ block: "start", behavior: "instant" }), 60);
    return () => clearTimeout(timer);
  }, [wanted]);

  const tabListRef = useRef(null);
  const tabRefs = useRef([]);
  const current = facilities[active];
  const CurrentIcon = current?.icon;

  // Selecting a tab also scrolls it into view, which matters on phones where the tabs swipe sideways.
  const select = (index, focus = false) => {
    setActive(index);
    const tab = tabRefs.current[index];
    if (!tab) return;
    if (focus) tab.focus();
    tab.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  };

  // How many tabs sit in one row right now (8 on desktop, 4 on tablets, 1 row of chips on phones).
  const tabsPerRow = () => {
    const grid = tabListRef.current;
    if (!grid) return 1;
    const columns = getComputedStyle(grid).gridTemplateColumns;
    return columns && columns !== "none" ? columns.split(" ").length : total;
  };

  // Arrow keys move between tabs, Up/Down jump a row, Home/End go to the first/last.
  const onKeyDown = (event) => {
    const perRow = tabsPerRow();
    let next = null;
    if (event.key === "ArrowRight") next = (active + 1) % total;
    else if (event.key === "ArrowLeft") next = (active - 1 + total) % total;
    else if (event.key === "ArrowDown" && active + perRow < total) next = active + perRow;
    else if (event.key === "ArrowUp" && active - perRow >= 0) next = active - perRow;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = total - 1;
    if (next === null) return;
    event.preventDefault();
    select(next, true);
  };

  return (
    <main id="main" className="fac-page">
      {/* ---- hero ---- */}
      <section className="fac-hero" aria-label="Campus facilities" style={{ "--img": `url("${heroImage || hero.image}")` }}>
        <div className="fac-hero__photo" />
        <div className="fac-hero__tags">
          <span className="fac-hero__tag fac-hero__tag--left">
            <span className="fac-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="fac-hero__tag fac-hero__tag--right">
            <span className="fac-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="fac-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>About us</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Facilities</span>
        </nav>
      </section>

      <div className="container fac-wrap">
        {/* ---- title + stat card ---- */}
        <div className="fac-top">
          <header className="fac-intro">
            <span className="fac-eyebrow">{page.intro.eyebrow}</span>
            <h1>{page.intro.title}</h1>
            <p>{page.intro.lead}</p>
          </header>
          <dl className="fac-stats">
            {page.stats.map((item, index) => (
              <div key={index}>
                <dt>{index === 0 && !item.value ? String(total) : item.value}</dt>
                <dd>{item.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ---- explorer: tabs + detail panel ---- */}
        {current && (
        <section id="explore" className="fac-explorer" aria-labelledby="fac-explore-title">
          <header className="fac-head">
            <span className="fac-eyebrow fac-eyebrow--line">{page.explore.eyebrow}</span>
            <h2 id="fac-explore-title">
              {page.explore.titleStart} <span>{page.explore.titleHighlight}</span>
            </h2>
          </header>

          <div className="fac-tabs" role="tablist" aria-label="Campus facilities" ref={tabListRef} onKeyDown={onKeyDown}>
            {facilities.map((item, index) => {
              const Icon = item.icon;
              const isActive = index === active;
              return (
                <button
                  key={item.id}
                  ref={(el) => { tabRefs.current[index] = el; }}
                  type="button"
                  role="tab"
                  id={`fac-tab-${item.id}`}
                  aria-selected={isActive}
                  aria-controls="fac-panel"
                  tabIndex={isActive ? 0 : -1}
                  className={`fac-tab${isActive ? " is-active" : ""}`}
                  onClick={() => select(index)}
                >
                  <span className="fac-tab__icon"><Icon aria-hidden="true" /></span>
                  <span className="fac-tab__label">{item.label}</span>
                </button>
              );
            })}
          </div>

          <article
            key={current.id}
            id="fac-panel"
            className="fac-panel"
            role="tabpanel"
            aria-labelledby={`fac-tab-${current.id}`}
            tabIndex={0}
          >
            <div className="fac-panel__main">
              <div className="fac-panel__text">
                <div className="fac-panel__top">
                  <span className="fac-pill">
                    <CurrentIcon aria-hidden="true" />
                    {current.label}
                  </span>
                  <span className="fac-count" aria-hidden="true">
                    <b>{pad(active + 1)}</b> / {pad(total)}
                  </span>
                </div>
                <h3>{current.headline}</h3>
                <p>{current.text}</p>
                <ul className="fac-points">
                  {current.points.map((point, index) => (
                    <li key={index}>
                      <FiCheckCircle aria-hidden="true" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="fac-gallery">
                {current.photos.map((src, n) => (
                  <Photo
                    key={n}
                    placeholder={page.panel.photoPlaceholder}
                    src={src}
                    alt={`${current.label} at C.R. Polytechnic, photo ${n + 1}`}
                    Icon={n === 0 ? CurrentIcon : FiImage}
                    className={n === 0 ? "fac-photo--main" : ""}
                  />
                ))}
              </div>
            </div>

            {(current.more.length > 0 || current.facts.length > 0) && (
              <div className={`fac-details${current.more.length === 0 || current.facts.length === 0 ? " fac-details--single" : ""}`}>
                {current.more.length > 0 && (
                  <div className="fac-about">
                    <h4 className="fac-subhead">{page.panel.aboutHeading}</h4>
                    {current.more.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
                {current.facts.length > 0 && (
                  <div className="fac-facts">
                    <h4 className="fac-subhead">{page.panel.factsHeading}</h4>
                    <dl>
                      {current.facts.map((fact, index) => (
                        <div key={index}>
                          <dt>{fact.label}</dt>
                          <dd>{fact.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}
              </div>
            )}
          </article>
        </section>
        )}

        <section className="fac-strip" aria-label="Institute at a glance">
          <dl className="fac-strip__list">
            {page.closingStats.map((item, index) => (
              <div key={index}>
                <dt>{item.value}</dt>
                <dd>{item.label}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}