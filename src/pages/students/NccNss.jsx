// NccNss.jsx - Students > NCC & NSS (route: /students/ncc-nss).
// Page order: hero -> title + NCC card -> about NCC (text, facts, photo) -> who can join -> NCC documents -> scholarships -> NSS notice -> related -> help strip.
// Own hero, own styles (NccNss.css, every class starts with "ncc-").
//
// WHAT THE LIVE SITE HAS: "NCC & NSS" is a menu of five files, not a page - four NCC PDFs and one scholarships Word file.
// This page introduces them and links to local copies. Nothing is loaded from the old website.
//
// REAL (from the live NCC documents)
//   About NCC PDF            NCC instituted in 1949, largest youth organisation in the world, motto "Unity & Discipline",
//                            a Senior Division (Army Wing) platoon of 52 cadets under 8 Haryana Battalion NCC, Rewari,
//                            training July to March each year for three years.  -> PLEASE CONFIRM these are still current
//                            (the files are dated October 2022).
//   How to join NCC PDF      the four eligibility lines and "age up to 26 years, enrolment of 3 years" (Senior Division/Wing).
//   The document blurbs      one sentence each, written from the document contents.
// SAMPLE
//   The NSS notice. The live site lists NSS in the menu but has no NSS content, so nothing about NSS is claimed.
//   The scholarships blurb ("Scholarship details, 2021-22") is taken from the file name; the file was not opened.
//
// FILES TO COPY from the old website into the new project (new name on the right):
//   https://crprohtak.ac.in/uploads/2022-10-10/About-NCC.pdf                              ->  public/docs/ncc/about-ncc.pdf
//   https://crprohtak.ac.in/uploads/2022-10-10/HowTo-Join-NCC.pdf                         ->  public/docs/ncc/how-to-join-ncc.pdf
//   https://crprohtak.ac.in/uploads/2022-10-10/Eligibilities-for-Certificate-Examination.pdf  ->  public/docs/ncc/certificate-exam-eligibility.pdf
//   https://crprohtak.ac.in/uploads/2022-10-10/Incentives-To-Cadets-2.pdf                 ->  public/docs/ncc/incentives-to-cadets.pdf
//   https://crprohtak.ac.in/uploads/2022-10-10/scholarship_details_yearly_2021-22.docx    ->  public/docs/ncc/scholarship-details-2021-22.docx
//   https://crprohtak.ac.in/media/Facility/_DSC6300.JPG (the NCC photo on the Facilities page)  ->  public/images/ncc/ncc-activity.jpg
// A missing photo shows a clean navy tile. A missing document gives a "file not found" page, so copy all five.
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight as FiCrumbArrow, FiArrowRight, FiFlag, FiUserPlus, FiCheckSquare, FiAward, FiFileText,
  FiDownload, FiCheckCircle, FiImage, FiInfo, FiPhone, FiMail,
} from "react-icons/fi";
import "./NccNss.css";
import { useSite } from "../../context/SiteSettingsContext";

const hero = { image: "/images/pages-banner.png" }; // wide photo; if it is missing a patterned navy banner shows instead
const photo = { src: "/images/ncc/ncc-activity.jpg", alt: "NCC cadets taking part in an activity at the institute" };

const intro = {
  eyebrow: "Students",
  title: "NCC & NSS",
  lead: "The National Cadet Corps builds discipline, leadership and a spirit of service. Read how it works at the institute, who can join and what cadets can earn.",
};

// From the About NCC document - confirm these are still current.
const about = [
  "The National Cadet Corps was instituted in 1949 and is the largest youth organisation in the world. Its motto is Unity & Discipline.",
  "At the institute, a Senior Division (Army Wing) platoon of 52 cadets trains under 8 Haryana Battalion NCC, Rewari. Training runs from July to March each year for three years and covers institutional and camp training, community development and social service, adventure training and sports, a youth exchange programme, career counselling and a certificate examination.",
];

const facts = [
  { label: "Instituted", value: "1949" },
  { label: "Motto", value: "Unity & Discipline" },
  { label: "Wing at the institute", value: "Senior Division (Army Wing)" },
  { label: "Battalion", value: "8 Haryana Battalion NCC, Rewari" },
];

// From the How to join NCC document.
const eligibility = [
  "A citizen of India or a subject of Nepal",
  "Enrolled in an educational institution",
  "Of good moral character",
  "Meets the prescribed medical standards",
];

// The four NCC documents. Add a line to add a document.
//   title / text   what the card says        href   where the file lives in public/docs
//   type           the small label           icon   an icon from react-icons/fi
const docs = [
  {
    id: "about",
    title: "About NCC",
    text: "The motto, aim and core values, the cadet commandments and pledge, and how NCC training runs at the institute.",
    href: "/docs/ncc/about-ncc.pdf",
    type: "PDF",
    icon: FiFlag,
  },
  {
    id: "join",
    title: "How to join NCC",
    text: "Who can join, how to apply, verification, the medical examination and enrolment.",
    href: "/docs/ncc/how-to-join-ncc.pdf",
    type: "PDF",
    icon: FiUserPlus,
  },
  {
    id: "exam",
    title: "Eligibility for the certificate examination",
    text: "The rules for the NCC 'B' and 'C' certificate examinations, and for a retest to improve a 'C' grade.",
    href: "/docs/ncc/certificate-exam-eligibility.pdf",
    type: "PDF",
    icon: FiCheckSquare,
  },
  {
    id: "incentives",
    title: "Incentives to cadets",
    text: "Employment opportunities, scholarships and awards that the Central and State Governments offer to cadets.",
    href: "/docs/ncc/incentives-to-cadets.pdf",
    type: "PDF",
    icon: FiAward,
  },
];

const scholarships = {
  title: "Awards and scholarships",
  text: "Scholarship details, 2021-22.", // taken from the file name - SAMPLE
  href: "/docs/ncc/scholarship-details-2021-22.docx",
  type: "DOCX",
};

const related = [
  { label: "Extracurricular achievements", text: "Sports, cultural and other wins by our students.", to: "/about/extracurricular" },
  { label: "Facilities", text: "Hostels, labs, sports and the rest of the campus.", to: "/about/facilities" },
  { label: "Skill courses", text: "Practical programmes alongside your diploma.", to: "/students/skill-courses" },
];

// The NCC photo. If the file is missing, a clean navy tile is shown instead of a broken image.
function Photo({ src, alt }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="ncc-photo">
      {failed ? (
        <div className="ncc-photo__empty" aria-hidden="true">
          <FiImage />
          <span>Photo coming soon</span>
        </div>
      ) : (
        <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      )}
    </figure>
  );
}

export default function NccNss() {
  const { contact } = useSite();
  return (
    <main id="main" className="ncc-page">
      <section className="ncc-hero" aria-label="NCC and NSS" style={{ "--img": `url("${hero.image}")` }}>
        <div className="ncc-hero__photo" />
        <div className="ncc-hero__tags">
          <span className="ncc-hero__tag ncc-hero__tag--left">
            <span className="ncc-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="ncc-hero__tag ncc-hero__tag--right">
            <span className="ncc-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="ncc-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiCrumbArrow aria-hidden="true" />
          <span>Students</span>
          <FiCrumbArrow aria-hidden="true" />
          <span aria-current="page">NCC &amp; NSS</span>
        </nav>
      </section>

      <div className="container ncc-wrap">
        {/* ---- title + NCC card ---- */}
        <div className="ncc-top">
          <header className="ncc-intro">
            <span className="ncc-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
            <div className="ncc-intro__actions">
              <a className="ncc-btn ncc-btn--primary" href="#ncc-docs">
                Read the documents
                <FiArrowRight aria-hidden="true" />
              </a>
              <a className="ncc-btn ncc-btn--line" href="#ncc-help">
                Ask the office
              </a>
            </div>
          </header>

          <aside className="ncc-glance" aria-label="NCC at a glance">
            <span className="ncc-glance__pill"><i aria-hidden="true" /> NCC at the institute</span>
            <p className="ncc-glance__big">
              <strong>1949</strong>
              the year the National Cadet Corps was instituted
            </p>
            <dl>
              <div><dt>3 yrs</dt><dd>Training period</dd></div>
              <div><dt>52</dt><dd>Cadets in the platoon</dd></div>
              <div><dt>{docs.length + 1}</dt><dd>Documents to read</dd></div>
            </dl>
          </aside>
        </div>

        {/* ---- about NCC ---- */}
        <section className="ncc-block" aria-labelledby="ncc-about-title">
          <header className="ncc-head">
            <span className="ncc-eyebrow ncc-eyebrow--line">About NCC</span>
            <h2 id="ncc-about-title">Unity and <span>discipline</span></h2>
          </header>
          <div className="ncc-about">
            <div className="ncc-about__text">
              {about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <dl className="ncc-facts">
                {facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <Photo src={photo.src} alt={photo.alt} />
          </div>
        </section>

        {/* ---- who can join ---- */}
        <section className="ncc-block" aria-labelledby="ncc-who-title">
          <header className="ncc-head">
            <span className="ncc-eyebrow ncc-eyebrow--line">Eligibility</span>
            <h2 id="ncc-who-title">Who can <span>join</span></h2>
          </header>
          <ul className="ncc-who">
            {eligibility.map((line) => (
              <li key={line}>
                <FiCheckCircle aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
          <p className="ncc-who__note">
            For the Senior Division/Wing, the age limit is 26 years and enrolment is for 3 years. The full steps are in the &ldquo;How to join NCC&rdquo; document below.
          </p>
        </section>

        {/* ---- documents ---- */}
        <section id="ncc-docs" className="ncc-block" aria-labelledby="ncc-docs-title">
          <header className="ncc-head">
            <span className="ncc-eyebrow ncc-eyebrow--line">NCC documents</span>
            <h2 id="ncc-docs-title">Read and <span>download</span></h2>
          </header>
          <ul className="ncc-docs">
            {docs.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <article className="ncc-doc">
                    <div className="ncc-doc__top">
                      <span className="ncc-doc__icon"><Icon aria-hidden="true" /></span>
                      <span className="ncc-doc__type">{item.type}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <a className="ncc-btn ncc-btn--primary ncc-doc__btn" href={item.href} target="_blank" rel="noopener noreferrer">
                      Open document
                      <FiDownload aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </article>
                </li>
              );
            })}
          </ul>

          <div className="ncc-scholar">
            <div className="ncc-scholar__body">
              <span className="ncc-scholar__icon"><FiFileText aria-hidden="true" /></span>
              <div>
                <h3>{scholarships.title}</h3>
                <p>{scholarships.text}</p>
              </div>
            </div>
            <a className="ncc-btn ncc-btn--line" href={scholarships.href} target="_blank" rel="noopener noreferrer">
              Download {scholarships.type}
              <FiDownload aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </section>

        {/* ---- NSS notice (SAMPLE) ---- */}
        <aside className="ncc-notice" aria-label="NSS details coming">
          <span className="ncc-notice__icon"><FiInfo aria-hidden="true" /></span>
          <div>
            <h2>NSS details are coming soon</h2>
            <p>Information about the National Service Scheme will be added to this page when the institute shares it. To ask about NSS now, call or write to the institute office.</p>
          </div>
        </aside>

        {/* ---- related ---- */}
        <section className="ncc-related" aria-label="More for students">
          {related.map((item) => (
            <Link key={item.to} className="ncc-related__item" to={item.to}>
              <span>
                <strong>{item.label}</strong>
                {item.text}
              </span>
              <FiArrowRight aria-hidden="true" />
            </Link>
          ))}
        </section>

        {/* ---- help strip ---- */}
        <section id="ncc-help" className="ncc-help" aria-labelledby="ncc-help-title">
          <div>
            <h2 id="ncc-help-title">Want to join NCC or NSS?</h2>
            <p>The institute office will tell you how to enrol and when training starts.</p>
          </div>
          <div className="ncc-help__actions">
            <a className="ncc-btn ncc-btn--primary" href={`tel:${contact.phones[0].replace(/-/g, "")}`}>
              <FiPhone aria-hidden="true" />
              {contact.phones.join(" / ")}
            </a>
            <a className="ncc-btn ncc-btn--ghost" href={`mailto:${contact.email}`}>
              <FiMail aria-hidden="true" />
              {contact.email}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}