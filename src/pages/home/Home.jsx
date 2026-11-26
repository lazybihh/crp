// Home.jsx - the complete Home page. All text and images come from the database (edited in Admin > Home).
// Until the database answers, the starting content below is shown. Icons and the banner tags stay here.
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as Fi from "react-icons/fi";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiArrowRight, FiBell, FiArrowUpRight, FiBookOpen, FiBriefcase, FiUsers, FiAward } from "react-icons/fi";
import { categories, isNew } from "../../data/notices";
import { getHomeContent, mediaUrl } from "../../services/homeService";
import { noticeFileUrl } from "../../services/noticeService";
import PageLoader, { usePageReady } from "../../components/PageLoader";
import "./Home.css";
import { CourseEnquiryButton } from "../../components/LeadForm";

// Starting content. It is shown while the page loads, and whenever the server cannot be reached.
// The same text is the starting content of the database model (backend/models/HomeContent.js) - keep the two in step.
const img = (file) => `/images/${file}`;

const homeDefaults = {
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

};

const HomeContentContext = createContext(null);
const useHomeContent = () => useContext(HomeContentContext);

// Icons are fixed (the admin edits text and images only)
const reasonIcons = [FiBookOpen, FiBriefcase, FiUsers, FiAward]; // by position
const courseIcons = { civil: "FiBox", computer: "FiCpu", electrical: "FiZap", electronics: "FiRadio", mechanical: "FiSettings", plastic: "FiDroplet", "applied-science": "FiBookOpen", workshop: "FiTool" };
const facilityIcons = { hostels: "FiHome", labs: "FiMonitor", library: "FiBookOpen", sports: "FiActivity", workshop: "FiTool" };

const slideTiming = { slideDelay: 5000, slideSpeed: 900 }; // ms each photo stays / ms the slide takes

// Notice board: tabs filter the chosen notices by category; "View all notices" opens the Notices page.
const noticeTabs = [
  { id: "all", label: "All" },
  { id: "admissions", label: "Admissions" },
  { id: "exams", label: "Exams" },
  { id: "tenders", label: "Tenders" },
];
const BOARD_SIZE = 8; // rows scrolling on the board
const categoryLabel = (id) => categories.find((item) => item.id === id)?.label ?? "";
const formatDate = (date) => new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const noticeLink = { label: "View all notices", to: "/notices" };

// Auto-moving "Latest news" strip. Pauses on hover/focus; stands still if the visitor prefers less motion.
function LatestNews() {
  const { latestNews: newsItems } = useHomeContent();
  const groupRef = useRef(null);
  const [seconds, setSeconds] = useState(30);

  // keep the speed the same (about 70px a second) whatever the screen width
  useLayoutEffect(() => {
    const measure = () => {
      const width = groupRef.current?.offsetWidth || 0;
      if (width) setSeconds(Math.min(Math.max(width / 70, 15), 180));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  if (newsItems.length === 0) return null;

  const items = (hidden) => (
    <ul className="tick__group" ref={hidden ? undefined : groupRef} aria-hidden={hidden || undefined}>
      {newsItems.map((item) => (
        <li key={item.id || item._id || item.text}>
          {item.to ? (
            <Link to={item.to} lang={item.lang} tabIndex={hidden ? -1 : undefined}>{item.text}</Link>
          ) : (
            <span lang={item.lang}>{item.text}</span>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <section className={"tick"} aria-label="Latest news">
      <div className="container tick__row">
        <span className="tick__label"><FiBell aria-hidden="true" />Latest news</span>
        <div className="tick__view">
          <div className="tick__track" style={{ "--tick-seconds": `${seconds}s` }}>
            {items(false)}
            {items(true)}
          </div>
        </div>
      </div>
    </section>
  );
}

function Hero() {
  const { hero: heroData } = useHomeContent();
  const ref = useRef(null);
  const [broken, setBroken] = useState([]);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  const slides = heroData.images.filter((image) => !broken.includes(image.src));
  const count = slides.length;
  // the first photo is repeated at the end so the loop never slides backwards
  const track = count > 1 ? [...slides, slides[0]] : slides;

  // Big screens (above 900px): the banner fills the space left below the header.
  // Small screens (900px and below): CSS gives the banner a fixed aspect-ratio, so no height is measured here.
  const fit = () => {
    const el = ref.current;
    if (!el) return;
    if (window.innerWidth <= 900) {
      el.style.height = "";
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY;
    el.style.height = `${Math.min(Math.max(window.innerHeight - top, 300), 720)}px`;
  };

  useLayoutEffect(() => {
    fit();
    window.addEventListener("resize", fit);
    window.addEventListener("load", fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    return () => {
      window.removeEventListener("resize", fit);
      window.removeEventListener("load", fit);
    };
  });

  // restart from the first photo if a missing image drops out of the list
  useEffect(() => { setIndex(0); }, [count]);

  // move to the next photo every few seconds
  useEffect(() => {
    if (count < 2) return undefined;
    const timer = setInterval(() => setIndex((i) => i + 1), heroData.slideDelay);
    return () => clearInterval(timer);
  }, [count]);

  // after sliding onto the repeated first photo, jump back to the real first one without animation
  useEffect(() => {
    if (count < 2 || index !== count) return undefined;
    let frame;
    const timer = setTimeout(() => {
      setAnimate(false);
      setIndex(0);
      frame = requestAnimationFrame(() => { frame = requestAnimationFrame(() => setAnimate(true)); });
    }, heroData.slideSpeed + 60);
    return () => { clearTimeout(timer); cancelAnimationFrame(frame); };
  }, [index, count]);

  return (
    <section ref={ref} className="hero" aria-label="Chhotu Ram Polytechnic campus">
      <div className="hero__stage">
        <div
          className="hero__track"
          style={{
            transform: `translateX(-${index * 100}%)`,
            transition: animate ? `transform ${heroData.slideSpeed}ms cubic-bezier(0.65, 0, 0.35, 1)` : "none",
          }}
        >
          {track.map((image, i) => (
            <img
              key={`${image.src}-${i}`}
              className="hero__image"
              src={image.src}
              alt={i === 0 ? image.alt : ""}
              aria-hidden={i > 0 ? "true" : undefined}
              fetchPriority={i === 0 ? "high" : undefined}
              onLoad={fit}
              onError={() => setBroken((list) => (list.includes(image.src) ? list : [...list, image.src]))}
            />
          ))}
        </div>
        {/* tags sit here - add more later */}
        <div className="hero__tags">
          <span className="hero__tag hero__tag--left">
            <span className="hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            <span className="hero__tag-text">Government Polytechnic</span>
          </span>
          <span className="hero__tag hero__tag--right">
            <span className="hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            <span className="hero__tag-text">Rohtak (Haryana)</span>
          </span>
        </div>
      </div>
    </section>
  );
}

function StatsBand() {
  const { stats: statsData } = useHomeContent();
  return (
    <section className="stats on-dark" aria-label="The college in numbers">
      <dl className="container stats__list">
        {statsData.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.value}</dt>
            <dd>{stat.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function PrincipalMessage() {
  const { principal: principalData, principalInitials } = useHomeContent();
  return (
    <section className="section principal reveal">
      <div className="container principal__grid">
        <div className="principal__portrait">
          <div className="principal__frame">
            {principalData.photo
              ? <img src={principalData.photo} alt={principalData.name} />
              : <span className="principal__monogram" aria-hidden="true">{principalInitials}</span>}
          </div>
          <div className="principal__badge">
            <strong>{principalData.name}</strong>
            <span>{principalData.role}</span>
          </div>
        </div>
        <div className="principal__text">
          <span className="eyebrow">{principalData.eyebrow}</span>
          <blockquote>{principalData.quote}</blockquote>
          {principalData.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <Link className="btn btn--navy" to={principalData.link.to}>{principalData.link.label} <FiArrowRight /></Link>
        </div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const { reasons: reasonsData, sectionContent } = useHomeContent();
  return (
    <section className="section why-us reveal">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{sectionContent.whyChooseUs.eyebrow}</span>
          <h2>{sectionContent.whyChooseUs.title}</h2>
          <p>{sectionContent.whyChooseUs.description}</p>
        </div>
        <div className="why-us__grid">
          {reasonsData.map((reason, index) => {
            const Icon = reasonIcons[index % reasonIcons.length];
            return (
              <article className="reason-card" key={`${index}-${reason.title}`}>
                <span className="reason-card__number">0{index + 1}</span>
                <span className="reason-card__icon"><Icon /></span>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Dignitaries() {
  const { dignitaries: dignitariesData, sectionContent } = useHomeContent();
  return (
    <section className="section dignitaries reveal">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{sectionContent.leadership.eyebrow}</span>
          <h2> {sectionContent.leadership.title} </h2>
        </div>
        <div className="dignitaries__grid">
          {dignitariesData.map((person) => (
            <article className="leader-card" key={person.name}>
              <div className="leader-card__photo">
                <span aria-hidden="true">{person.initials}</span>
                {person.image && (
                  <img
                    src={person.image}
                    alt={person.name}
                    loading="lazy"
                    onError={(event) => { event.currentTarget.style.display = "none"; }}
                  />
                )}
              </div>
              <div className="leader-card__body">
                <h3>{person.name}</h3>
                <p className="leader-card__role">{person.role}</p>
                <p className="leader-card__text">{person.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// One row of the board. A notice with a file opens that file in a new tab; one without a file opens the Notices page.
function NoticeRow({ notice, hidden = false }) {
  const url = noticeFileUrl(notice.file);
  const content = (
    <>
      <span className="board__icon"><FiBell aria-hidden="true" /></span>
      <div>
        <p>{notice.title}{isNew(notice) && <em>NEW</em>}</p>
        {notice.date
          ? <time dateTime={notice.date}>{formatDate(notice.date)}</time>
          : <span className="board__meta">{categoryLabel(notice.category)}</span>}
      </div>
      <FiArrowUpRight className="board__go" aria-hidden="true" />
    </>
  );
  // the repeated copy (for the endless scroll) is hidden from screen readers and skipped by the Tab key
  const extra = hidden ? { tabIndex: -1 } : {};
  return (
    <li aria-hidden={hidden ? "true" : undefined}>
      {url ? (
        <a className="board__link" href={url} target="_blank" rel="noopener noreferrer" {...extra}>
          {content}
          {!hidden && <span className="sr-only">(opens in a new tab)</span>}
        </a>
      ) : (
        <Link className="board__link" to={noticeLink.to} {...extra}>{content}</Link>
      )}
    </li>
  );
}

function NoticeBoard() {
  const { news: featuredNews, notices, noticesLoading, noticesError, sectionContent } = useHomeContent();
  const [tab, setTab] = useState("all");
  const visible = notices
    .filter((notice) => tab === "all" || notice.category === tab)
    .slice(0, BOARD_SIZE);

  return (
    <section className="section notices reveal">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{sectionContent.notices.eyebrow}</span>
          <h2>{sectionContent.notices.title}</h2>
        </div>
        <div className="notices__grid">
          <article className="news-card">
            <div className="news-card__img" style={{ "--img": `url("${featuredNews.image}")` }} />
            <div className="news-card__body">
              <span className="news-card__tag">{featuredNews.tag}</span>
              <h3>{featuredNews.title}</h3>
              <p>{featuredNews.text}</p>
            </div>
          </article>
          <div className="board">
            <div className="board__tabs" role="tablist" aria-label="Notice categories">
              {noticeTabs.map((item) => (
                <button key={item.id} role="tab" aria-selected={tab === item.id} className={tab === item.id ? "is-active" : ""} onClick={() => setTab(item.id)}>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="board__viewport">
              <ul className="board__list">
                {noticesLoading && <li className="board__empty" role="status">Loading notices...</li>}
                {!noticesLoading && noticesError && <li className="board__empty" role="status">{noticesError}</li>}
                {!noticesLoading && !noticesError && visible.map((notice) => <NoticeRow key={notice._id || notice.id} notice={notice} />)}
                {!noticesLoading && !noticesError && visible.length === 0 && <li className="board__empty">No notices in this category.</li>}
                {!noticesLoading && !noticesError && visible.length > 1 && visible.map((notice) => <NoticeRow key={`repeat-${notice._id || notice.id}`} notice={notice} hidden />)}
              </ul>
            </div>
            <Link className="board__all" to={noticeLink.to}>{noticeLink.label} →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  const { highlights: highlightsData, sectionContent } = useHomeContent();
  return (
    <section className="section highlights reveal">
      <div className="container">
        <div className="section-head section-head--light">
          <span className="eyebrow">{sectionContent.highlights.eyebrow}</span>
          <h2>{sectionContent.highlights.title}</h2>
        </div>
        <div className="panels">
          {highlightsData.map((panel, index) => (
            <article key={panel.id} className="panel" tabIndex={0} style={{ "--img": `url("${panel.image}")` }}>
              <span className="panel__no">0{index + 1}</span>
              <h3>{panel.title}</h3>
              <ul className="panel__list">
                {panel.items.map((item) => (
                  <li key={item.text}><time>{item.date}</time><span>{item.text}</span></li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Facilities() {
  const { facilityTiles, sectionContent } = useHomeContent();
  return (
    <section className="section facilities reveal">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{sectionContent.facilities.eyebrow}</span>
          <h2>{sectionContent.facilities.title}</h2>
          <p>{sectionContent.facilities.description}</p>
        </div>
        <div className="bento">
          {facilityTiles.map((item, index) => {
            const Icon = Fi[facilityIcons[item.id]] || Fi.FiStar;
            return (
              <Link
                key={`${item.id}-${index}`}
                to={`/about/facilities?facility=${item.id}`}
                aria-label={`${item.name} - open on the Facilities page`}
                className={`tile${index === 0 ? " tile--lg" : ""}`}
                style={{ "--img": `url("${item.image}")` }}
              >
                <div className="tile__shade" />
                <span className="tile__icon"><Icon /></span>
                <span className="tile__no">0{index + 1}</span>
                <div className="tile__text">
                  <h3>{item.name}</h3>
                  <p>{item.text}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Courses() {
  const { courses: coursesData, sectionContent } = useHomeContent();
  const [flipped, setFlipped] = useState(null); // card pinned open by click / keyboard (desktop)
  const [auto, setAuto] = useState(() => new Set()); // cards flipped by scrolling (phones)
  const [isTouch, setIsTouch] = useState(false);
  const cardRefs = useRef([]);

  // Small screens cannot hover (and a narrow desktop window should behave the same), so a card flips by itself
  // while it sits in the middle of the screen and flips back when it moves out of that middle band.
  useEffect(() => {
    const small = window.matchMedia("(hover: none), (max-width: 860px)");
    let observer;

    const start = () => {
      if (observer) observer.disconnect();
      setAuto(new Set());
      setIsTouch(small.matches);
      if (!small.matches || typeof IntersectionObserver === "undefined") return;
      observer = new IntersectionObserver(
        (entries) => {
          setAuto((current) => {
            const next = new Set(current);
            entries.forEach((entry) => {
              const id = entry.target.dataset.id;
              if (entry.isIntersecting) next.add(id);
              else next.delete(id);
            });
            return next;
          });
        },
        { rootMargin: "-22% 0px -22% 0px", threshold: 0.5 }
      );
      cardRefs.current.forEach((element) => element && observer.observe(element));
    };

    start();
    small.addEventListener("change", start);
    return () => { small.removeEventListener("change", start); if (observer) observer.disconnect(); };
  }, []);

  const toggle = (id) => {
    if (isTouch) return; // small screens: the scroll position decides
    setFlipped((current) => (current === id ? null : id));
  };

  return (
    <section id="courses" className="section courses">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{sectionContent.courses.eyebrow}</span>
          <h2>{sectionContent.courses.title}</h2>
          <p>{sectionContent.courses.description}</p>
        </div>
        <div className="flip-grid">
          {coursesData.map((course, index) => {
            const Icon = Fi[courseIcons[course.id]] || Fi.FiBookOpen;
            const isOpen = auto.has(course.id) || (!isTouch && flipped === course.id);
            return (
              <div
                key={course.id}
                ref={(element) => { cardRefs.current[index] = element; }}
                data-id={course.id}
                className={`flip${isOpen ? " is-flipped" : ""}`}
                tabIndex={0}
                role="button"
                aria-pressed={isOpen}
                onClick={() => toggle(course.id)}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggle(course.id);
                  }
                }}
              >
                <div className="flip__inner">
                  <div className="flip__face flip__front">
                    <span className="flip__num">0{index + 1}</span>
                    <span className="flip__icon"><Icon /></span>
                    <h3>{course.name}</h3>
                    <div className="flip__foot">
                      <span className="flip__seats">{course.seats ? `${course.seats} seats` : course.tag}</span>
                      <span className="flip__hint">Details <FiArrowRight aria-hidden="true" /></span>
                    </div>
                  </div>
                  <div className="flip__face flip__back">
                    <h3>{course.name}</h3>
                    <p>{course.text}</p>
                    <div className="flip__actions"><Link to={`/departments/${course.id}`} onClick={(event) => event.stopPropagation()}>Explore department →</Link><CourseEnquiryButton department={course.name} onClick={(event) => event.stopPropagation()}>Enquiry</CourseEnquiryButton></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Recruiters() {
  const { recruiters: recruitersData, sectionContent } = useHomeContent();
  const loop = [...recruitersData, ...recruitersData];
  return (
    <section className="section recruiters reveal">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{sectionContent.recruiters.eyebrow}</span>
          <h2>{sectionContent.recruiters.title}</h2>
        </div>
      </div>
      <div className="marquee" aria-label="Recruiting companies">
        <ul className="marquee__track">
          {loop.map((company, index) => (
            <li key={index} aria-hidden={index >= recruitersData.length}>
              {company.logo ? <img src={company.logo} alt={company.name} /> : <span>{company.name}</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Home() {
  const { ready, data: saved } = usePageReady(() => getHomeContent());

  // the database content (the starting content above while loading or when the server is down), with every image address ready to use
  const c = { ...homeDefaults, ...saved };
  const content = {
    hero: { ...slideTiming, images: c.banners.map((banner) => ({ src: mediaUrl(banner.image), alt: banner.alt || "" })).filter((banner) => banner.src) },
    latestNews: c.latestNews,
    stats: c.stats,
    reasons: c.reasons,
    principal: { ...c.principal, photo: mediaUrl(c.principal.photo) },
    principalInitials: (c.principal.name || "").replace(/^(Dr|Mr|Mrs|Sh)\.?\s+/i, "").split(" ").map((word) => word[0]).join("").slice(0, 2),
    news: { ...c.news, image: mediaUrl(c.news.image) },
    dignitaries: c.dignitaries.map((person) => ({ ...person, image: mediaUrl(person.image) })),
    notices: Array.isArray(c.notices) ? c.notices : [],
    noticesLoading: false,
    noticesError: "",
    highlights: c.highlights.map((panel) => ({ ...panel, image: mediaUrl(panel.image), items: (panel.items || []).map((item) => ({ ...item, image: mediaUrl(item.photo || "") })) })),
    facilityTiles: (c.facilityTiles?.length ? c.facilityTiles : homeDefaults.facilityTiles).map((tile) => ({ ...tile, image: mediaUrl(tile.image) })),
    courses: c.courses,
    recruiters: c.recruiters.map((company) => ({ ...company, logo: mediaUrl(company.logo) })),
    sectionContent: c.sectionContent,
  };

  useEffect(() => {
    const sections = document.querySelectorAll("main#main .reveal");
    if (typeof IntersectionObserver === "undefined") {
      sections.forEach((section) => section.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ready]);

  if (!ready) return <main id="main"><PageLoader /></main>;

  return (
    <HomeContentContext.Provider value={content}>
      <main id="main">
        <Hero />
        <LatestNews />
        <StatsBand />
        <WhyChooseUs />
        <PrincipalMessage />
        <Dignitaries />
        <NoticeBoard />
        <Highlights />
        <Facilities />
        <Courses />
        <Recruiters />
      </main>
    </HomeContentContext.Provider>
  );
}
