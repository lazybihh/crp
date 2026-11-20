// Alumni.jsx - About us > Alumni (route: /about/alumni).
// This page has its own hero, its own styles (alumni.css, every class starts with "al-") and its own downloads sidebar.
// Text marked SAMPLE is placeholder text - replace it with real alumni stories and files.
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight, FiFileText, FiDownload, FiArrowRight, FiMessageCircle, FiGift, FiMail } from "react-icons/fi";
import "./Alumni.css";
import { useSite } from "../../context/SiteSettingsContext";

const hero = { image: "/images/pages-banner.png" };

const intro = {
  eyebrow: "About us",
  title: "Alumni",
  lead: "Once a Chhotu Ram student, always part of the family.",
};

const welcome = "Our alumni are a diverse group who have achieved notable things in their personal and professional lives. Their messages and contributions keep the next batches moving forward.";

const doors = [
  { icon: FiMessageCircle, title: "Alumni messages", text: "Read what former students have to say about their years here and where life took them.", href: "#messages" },
  { icon: FiGift, title: "Contributions", text: "See how alumni have given back to the institute and its students.", href: "#contributions" },
];

// SAMPLE: replace with real alumni (name, batch, trade, short quote).
const voices = [
  { name: "Alumnus name", batch: "Batch year, Civil Engineering", quote: "The workshop and my teachers gave me the confidence to start work from day one." },
  { name: "Alumnus name", batch: "Batch year, Electrical Engineering", quote: "What I learned here is still what I use on site every day." },
  { name: "Alumnus name", batch: "Batch year, Mechanical Engineering", quote: "Industrial visits and the placement cell opened my first job for me." },
];

// SAMPLE: replace these placeholder messages with alumni submissions.
const messages = [
  { name: "Alumnus name", batch: "Batch year, Computer Engineering", quote: "The friendships and practical lessons from campus continue to inspire my work." },
  { name: "Alumna name", batch: "Batch year, Electronics & Communication", quote: "My time here gave me the confidence to take on new challenges." },
];

// SAMPLE: replace these placeholder examples with verified alumni contributions.
const contributions = [
  "Sharing career guidance and mentorship with current students.",
  "Supporting workshops, laboratories and learning resources.",
  "Connecting students with internships and industry opportunities.",
];

const downloads = [
  { label: "Annual Report, 2024", href: "/docs/annual-report-2024.pdf", type: "PDF" },
];

export default function Alumni() {
  const { contact: contactSettings } = useSite();
  const contact = {
    email: contactSettings?.alumniEmail || "",
    phone: contactSettings?.phones?.[0] || "",
  };
  return (
    <main id="main" className="al-page">
      {/* ---- hero ---- */}
      <section className="al-hero" aria-label="Alumni of Chhotu Ram Polytechnic" style={{ "--img": `url("${hero.image}")` }}>
        <div className="al-hero__photo" />
        <div className="al-hero__tags">
          <span className="al-hero__tag al-hero__tag--left">
            <span className="al-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="al-hero__tag al-hero__tag--right">
            <span className="al-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="al-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>About us</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Alumni</span>
        </nav>
      </section>

      <div className="container al-layout">
        <div className="al-content">
          <header className="al-intro">
            <span className="al-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <p className="al-welcome">{welcome}</p>

          <div className="al-doors">
            {doors.map((door) => {
              const Icon = door.icon;
              return (
                <a key={door.title} className="al-door" href={door.href}>
                  <span className="al-door__icon"><Icon aria-hidden="true" /></span>
                  <h3>{door.title}</h3>
                  <p>{door.text}</p>
                  <span className="al-door__go">Open <FiArrowRight aria-hidden="true" /></span>
                </a>
              );
            })}
          </div>

          <section className="al-block" aria-labelledby="al-voices-title">
            <header className="al-head">
              <span className="al-eyebrow al-eyebrow--dark">Alumni voices</span>
              <h2 id="al-voices-title">In their own words</h2>
            </header>
            <div className="al-voices">
              {voices.map((v, index) => (
                <figure key={index}>
                  <blockquote>{v.quote}</blockquote>
                  <figcaption>
                    <span className="al-voices__avatar" aria-hidden="true">{v.name[0]}</span>
                    <span><strong>{v.name}</strong><em>{v.batch}</em></span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="messages" className="al-block" aria-labelledby="al-messages-title">
            <header className="al-head">
              <span className="al-eyebrow al-eyebrow--dark">Alumni messages</span>
              <h2 id="al-messages-title">Notes from our alumni</h2>
            </header>
            <div className="al-voices">
              {messages.map((message, index) => (
                <figure key={index}>
                  <blockquote>{message.quote}</blockquote>
                  <figcaption>
                    <span className="al-voices__avatar" aria-hidden="true">{message.name[0]}</span>
                    <span><strong>{message.name}</strong><em>{message.batch}</em></span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="contributions" className="al-block" aria-labelledby="al-contributions-title">
            <header className="al-head">
              <span className="al-eyebrow al-eyebrow--dark">Contributions</span>
              <h2 id="al-contributions-title">Giving back to the institute</h2>
            </header>
            <div className="al-contributions">
              <p>Alumni support helps create opportunities and enrich campus life for current students.</p>
              <ul>
                {contributions.map((contribution) => <li key={contribution}>{contribution}</li>)}
              </ul>
            </div>
          </section>

          <section className="al-connect" aria-labelledby="al-connect-title">
            <div>
              <h2 id="al-connect-title">Stay connected</h2>
              <p>Are you an alumnus? Write to us with your batch, trade and a few lines about your journey.</p>
            </div>
            <a className="al-connect__btn" href={`mailto:${contact.email}`}><FiMail aria-hidden="true" />{contact.email}</a>
          </section>
        </div>

        {/* ---- sidebar: downloads only ---- */}
        <aside className="al-side" aria-labelledby="al-dl-title">
          <h2 id="al-dl-title">Downloads</h2>
          <ul>
            {downloads.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="al-side__icon"><FiFileText aria-hidden="true" /></span>
                  <span className="al-side__label">{item.label}</span>
                  <span className="al-side__type">{item.type}</span>
                  <FiDownload className="al-side__go" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
