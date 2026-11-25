// Admissions.jsx - Students > Admissions (routes: /students/admissions and /admissions).
// Page order: hero -> title + "apply" card -> 4 admission steps -> programmes and seats -> notices, downloads and merit lists -> FAQ -> help strip.
// Own hero, own styles (Admissions.css, every class starts with "ads-").
// Content comes from the database; the lists below are the fallback and seed.
//
// HOW THE COLLEGE UPDATES THIS PAGE EACH YEAR - everything is a list at the top of this file:
//   session     the admission year shown in the title and the apply card
//   portalUrl   the state technical admissions portal
//   posters     the admission poster / notice pictures (public/images/admission/)
//   documents   the files students download (public/docs/)
//   notices     latest merit lists and notices, newest first - each has a date and a file
//   courses     the six diplomas and their seats (same numbers as the Courses page)
//
// Files this page links to (they live in public/):
//   public/images/admission/admission-2026.jpeg
//   public/images/admission/admission-notice-2026.jpeg
//   public/docs/admission-key-dates.jpeg
//   public/docs/admission-counselling-dates.pdf
//   public/docs/admission-documents-list.docx
//   public/docs/manual-admission-form.pdf
//   public/docs/notices/det-merit-list-2026.pdf
//   public/docs/notices/det-l-merit-list-2026.pdf
//   public/docs/notices/admission-notice-2026.jpeg
import { useState } from "react";
import PageLoader from "../../components/PageLoader";
import { useStudentPage, mergeStudentContent } from "../../services/studentPageService";
import { mediaUrl } from "../../services/mediaService";
import { getNotices, noticeFileUrl } from "../../services/noticeService";
import {
  FiArrowUpRight, FiArrowRight, FiFileText, FiDownload, FiCalendar, FiEdit3, FiUsers, FiCheckCircle, FiPhone, FiMail,
  FiBox, FiCpu, FiZap, FiRadio, FiSettings, FiDroplet, FiImage, FiPlus, FiHelpCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight as FiCrumbArrow } from "react-icons/fi";
import "./Admissions.css";
import { useSite } from "../../context/SiteSettingsContext";

const defaultHero = { image: "/images/pages-banner.png" }; // wide photo; if it is missing a patterned navy banner shows instead

const defaultSession = "2026-27";

const defaultIntro = {
  eyebrow: "Students",
  title: `Admissions ${defaultSession}`,
  lead: "Admissions are open for the three-year diploma programmes. Follow the four steps below, keep the key dates handy and apply on the state admissions portal.",
};

// Same six programmes and seats as the Courses page.
const defaultCourses = [
  { id: "civil", name: "Civil Engineering", icon: FiBox, seats: 60 },
  { id: "computer", name: "Computer Engineering", icon: FiCpu, seats: 54 },
  { id: "electrical", name: "Electrical Engineering", icon: FiZap, seats: 60 },
  { id: "electronics", name: "Electronics & Communication", icon: FiRadio, seats: 54 },
  { id: "mechanical", name: "Mechanical Engineering", icon: FiSettings, seats: 60 },
  { id: "plastic", name: "Plastic Technology", icon: FiDroplet, seats: 54 },
];

const defaultSteps = [
  { icon: FiCalendar, title: "Note the key dates", text: "Check the online admission dates and the counselling dates first. Both are in the downloads on this page." },
  { icon: FiEdit3, title: "Apply on the state portal", text: "Online admissions to the diploma programmes run through the Haryana technical admissions portal. Register and complete your application there." },
  { icon: FiUsers, title: "Attend counselling", text: "Seats are allotted through counselling, based on the merit lists. Merit lists and counselling details are posted on this page and on the Notices page." },
  { icon: FiCheckCircle, title: "Verify and join", text: "Bring the documents listed for physical verification to the institute to confirm your seat." },
];

const defaultPosters = [
  { src: "/images/admission/admission-2026.jpeg", label: `Admissions open ${defaultSession.replace("-", "\u2011")}` },
  { src: "/images/admission/admission-notice-2026.jpeg", label: "Official admission notice" },
];

const defaultDocuments = [
  { label: "Key dates for online admissions", href: "/docs/admission-key-dates.jpeg", type: "JPEG" },
  { label: "Counselling dates", href: "/docs/admission-counselling-dates.pdf", type: "PDF" },
  { label: "Documents required for physical verification", href: "/docs/admission-documents-list.docx", type: "DOCX" },
  { label: "Manual admission form", href: "/docs/manual-admission-form.pdf", type: "PDF" },
];

// Newest first. Add a line here whenever a new merit list or admission notice is published.
const defaultNotices = [
  { title: "DET merit list 2026", date: "8 July 2026", href: "/docs/notices/det-merit-list-2026.pdf", type: "PDF" },
  { title: "DET-L merit list 2026", date: "8 July 2026", href: "/docs/notices/det-l-merit-list-2026.pdf", type: "PDF" },
  { title: "Admission notice 2026", date: "3 July 2026", href: "/docs/notices/admission-notice-2026.jpeg", type: "JPEG" },
];

const defaultFaqs = [
  { q: "Where do I apply?", a: "Online admissions run through the state technical admissions portal. Use the Apply button at the top of this page to open it." },
  { q: "Which programmes can I choose?", a: "Six three-year diplomas: Civil, Computer, Electrical, Electronics & Communication, Mechanical and Plastic Technology, approved by DTE Haryana and AICTE." },
  { q: "Where are the merit lists and counselling dates?", a: "Both are on this page under Notices and downloads. New lists are also posted on the Notices page." },
  { q: "What if seats are still vacant after counselling?", a: "The institute holds manual counselling for vacant seats and announces it on the Notices page. The manual admission form is in the downloads." },
  { q: "Who can I ask for help?", a: "Call the institute office or send an email - the details are at the bottom of this page." },
];




// A notice picture. If the file is missing, a clean placeholder tile is shown instead.
function Poster({ src, label }) {
  const [failed, setFailed] = useState(false);
  return (
    <a className="ads-poster" href={src} target="_blank" rel="noopener noreferrer">
      <span className="ads-poster__frame">
        {failed ? (
          <span className="ads-poster__empty" aria-hidden="true">
            <FiImage />
            <span>Notice coming soon</span>
          </span>
        ) : (
          <img src={src} alt={label} loading="lazy" decoding="async" onError={() => setFailed(true)} />
        )}
      </span>
      <span className="ads-poster__label">
        {label}
        <small>
          View full size
          <FiArrowUpRight aria-hidden="true" />
        </small>
      </span>
    </a>
  );
}

// Saved paths that start with /uploads/ become full backend addresses; everything else is left as it is.
function resolveStudentMedia(value) {
  if (Array.isArray(value)) return value.map(resolveStudentMedia);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveStudentMedia(item)]));
  }
  if (typeof value === "string" && value.startsWith("/uploads/")) return mediaUrl(value);
  return value;
}

// One notice as the page shows it: title, date and the file to open.
function noticeRow(notice) {
  return {
    title: notice.title,
    date: notice.date,
    href: noticeFileUrl(notice.file),
    type: String(notice.file || "").split(".").pop().toUpperCase(),
  };
}

// The notices picked in the admin, in the order chosen. With no pick, the latest 4 admissions notices.
function pickNotices(allNotices, pickedIds) {
  if (Array.isArray(pickedIds) && pickedIds.length) {
    return pickedIds
      .map((id) => allNotices.find((n) => String(n._id) === String(id) && n.published !== false))
      .filter(Boolean)
      .map(noticeRow);
  }
  return allNotices.filter((n) => n.category === "admissions").slice(0, 4).map(noticeRow);
}

export default function Admissions() {
  const { ready, content: savedContent, extra: noticeResponse } = useStudentPage("admissions", getNotices);
  const pageContent = resolveStudentMedia(
    mergeStudentContent(
      {
      hero: defaultHero,
      session: defaultSession,
      intro: defaultIntro,
      courses: defaultCourses,
      steps: defaultSteps,
      posters: defaultPosters,
      documents: defaultDocuments,
      notices: defaultNotices,
      faqs: defaultFaqs,
      },
      savedContent
    )
  );
  const hero = pageContent.hero ?? defaultHero;
  const session = pageContent.session ?? defaultSession;
  const intro = pageContent.intro ?? defaultIntro;
  const courses = pageContent.courses ?? defaultCourses;
  const steps = pageContent.steps ?? defaultSteps;
  const posters = pageContent.posters ?? defaultPosters;
  const documents = pageContent.documents ?? defaultDocuments;
  const notices = pageContent.notices ?? defaultNotices;
  const allNotices = noticeResponse?.notices || [];
  const pickedIds = pageContent.noticeIds;
  const hasPickedNotices = Boolean(pickedIds?.length);
  const selectedNotices = pickNotices(allNotices, pickedIds);
  let displayNotices = notices;
  if (noticeResponse) displayNotices = selectedNotices.length ? selectedNotices : (hasPickedNotices ? [] : notices);
  const faqs = pageContent.faqs ?? defaultFaqs;
  const totalSeats = courses.reduce((sum, course) => sum + course.seats, 0);
  const topSeats = Math.max(...courses.map((course) => course.seats));

  const { contact, links } = useSite();
  const portalUrl = links?.admissionPortal || "";
  if (!ready) return <main id="main" className="ads-page"><PageLoader /></main>;
  return (
    <main id="main" className="ads-page">
      <section className="ads-hero" aria-label="Admissions" style={{ "--img": `url("${hero.image}")` }}>
        <div className="ads-hero__photo" />
        <div className="ads-hero__tags">
          <span className="ads-hero__tag ads-hero__tag--left">
            <span className="ads-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="ads-hero__tag ads-hero__tag--right">
            <span className="ads-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="ads-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiCrumbArrow aria-hidden="true" />
          <span>Students</span>
          <FiCrumbArrow aria-hidden="true" />
          <span aria-current="page">Admissions</span>
        </nav>
      </section>

      <div className="container ads-wrap">
        {/* ---- title + apply card ---- */}
        <div className="ads-top">
          <header className="ads-intro">
            <span className="ads-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
            <div className="ads-intro__actions">
              <a className="ads-btn ads-btn--primary" href={portalUrl} target="_blank" rel="noopener noreferrer">
                Apply on the state portal
                <FiArrowUpRight aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a className="ads-btn ads-btn--line" href="#ads-notices">
                Dates and downloads
                <FiArrowRight aria-hidden="true" />
              </a>
            </div>
          </header>

          <aside className="ads-apply" aria-label="Admissions at a glance">
            <span className="ads-apply__pill"><i aria-hidden="true" /> Admissions open</span>
            <p className="ads-apply__session">Session <strong>{session}</strong></p>
            <dl>
              <div><dt>{courses.length}</dt><dd>Diploma programmes</dd></div>
              <div><dt>{totalSeats}</dt><dd>Approved seats</dd></div>
              <div><dt>3 yrs</dt><dd>Each diploma</dd></div>
            </dl>
          </aside>
        </div>

        {/* ---- four steps ---- */}
        <section className="ads-block" aria-labelledby="ads-steps-title">
          <header className="ads-head">
            <span className="ads-eyebrow ads-eyebrow--line">How it works</span>
            <h2 id="ads-steps-title">Your admission in <span>4 steps</span></h2>
          </header>
          <ol className="ads-steps">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="ads-step">
                  <span className="ads-step__no" aria-hidden="true">{index + 1}</span>
                  <span className="ads-step__icon"><Icon aria-hidden="true" /></span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ---- programmes and seats ---- */}
        <section className="ads-block" aria-labelledby="ads-prog-title">
          <header className="ads-head">
            <span className="ads-eyebrow ads-eyebrow--line">Programmes</span>
            <h2 id="ads-prog-title">Choose your <span>branch</span></h2>
          </header>
          <ul className="ads-prog">
            {courses.map((course) => {
              const Icon = course.icon;
              return (
                <li key={course.id}>
                  <Link className="ads-prog__card" to={`/departments/${course.id}`}>
                    <span className="ads-prog__icon"><Icon aria-hidden="true" /></span>
                    <span className="ads-prog__body">
                      <strong>{course.name}</strong>
                      <span className="ads-prog__seats">{course.seats} seats</span>
                      <span className="ads-prog__bar" aria-hidden="true"><i style={{ width: `${(course.seats / topSeats) * 100}%` }} /></span>
                    </span>
                    <FiArrowRight className="ads-prog__go" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---- notices, downloads, merit lists ---- */}
        <section id="ads-notices" className="ads-block" aria-labelledby="ads-docs-title">
          <header className="ads-head">
            <span className="ads-eyebrow ads-eyebrow--line">Notices and downloads</span>
            <h2 id="ads-docs-title">Everything you <span>need to download</span></h2>
          </header>

          <div className="ads-posters">
            {posters.map((poster) => (
              <Poster key={poster.src} {...poster} />
            ))}
          </div>

          <div className="ads-lists">
            <div className="ads-list">
              <h3>Downloads</h3>
              <ul>
                {documents.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      <span className="ads-list__icon"><FiFileText aria-hidden="true" /></span>
                      <span className="ads-list__label">{item.label}</span>
                      <span className="ads-list__type">{item.type}</span>
                      <FiDownload className="ads-list__go" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ads-list">
              <h3>Merit lists and latest notices</h3>
              <ul>
                {displayNotices.map((item) => (
                  <li key={item.title}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      <span className="ads-list__icon"><FiFileText aria-hidden="true" /></span>
                      <span className="ads-list__label">
                        {item.title}
                        <small>{item.date}</small>
                      </span>
                      <span className="ads-list__type">{item.type}</span>
                      <FiDownload className="ads-list__go" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
              <Link className="ads-list__all" to="/notices">
                All notices
                <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ---- questions ---- */}
        <section className="ads-block" aria-labelledby="ads-faq-title">
          <header className="ads-head">
            <span className="ads-eyebrow ads-eyebrow--line">Questions</span>
            <h2 id="ads-faq-title">Quick <span>answers</span></h2>
          </header>
          <div className="ads-faq">
            {faqs.map((item) => (
              <details key={item.q} className="ads-faq__item">
                <summary>
                  <span className="ads-faq__q"><FiHelpCircle aria-hidden="true" />{item.q}</span>
                  <FiPlus className="ads-faq__plus" aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ---- help strip ---- */}
        <section className="ads-help" aria-labelledby="ads-help-title">
          <div>
            <h2 id="ads-help-title">Need help with your admission?</h2>
            <p>The institute office will guide you with dates, documents and counselling.</p>
          </div>
          <div className="ads-help__actions">
            <a className="ads-btn ads-btn--primary" href={`tel:${contact.phones[0].replace(/-/g, "")}`}>
              <FiPhone aria-hidden="true" />
              {contact.phones.join(" / ")}
            </a>
            <a className="ads-btn ads-btn--ghost" href={`mailto:${contact.email}`}>
              <FiMail aria-hidden="true" />
              {contact.email}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}