// AcademicCalendar.jsx - Students > Academic calendar (route: /students/academic-calendar).
// Page order: hero -> title card -> calendar documents -> note -> help line.
// Own hero, own styles (AcademicCalendar.css, every class starts with "cal-").
// Content comes from the database; the lists below are the fallback and seed.
import { FiDownload, FiCalendar, FiArrowUpRight } from "react-icons/fi";
import PageLoader from "../../components/PageLoader";
import { useStudentPage, mergeStudentContent } from "../../services/studentPageService";
import { mediaUrl } from "../../services/mediaService";
import "./AcademicCalendar.css";

const defaults = {
  key: "academic-calendar",
  hero: { image: "/images/pages-banner.png" },
  intro: {
    eyebrow: "Students",
    title: "Academic Calendar",
    lead: "Academic calendar and important academic documents.",
  },
  // One line per session. Add a line to publish a new calendar.
  documents: [
    {
      session: "2025-26",
      label: "Academic Calendar 2025-26",
      file: "/docs/academic-calendar-2025-26.pdf",
      type: "PDF",
    },
  ],
  note: "For assistance, contact the institute office.",
};

export default function AcademicCalendar() {
  const { ready, content } = useStudentPage("academic-calendar");
  const data = mergeStudentContent(defaults, content);

  if (!ready) return <main className="cal-page"><PageLoader /></main>;

  const heroStyle = {
    backgroundImage: `linear-gradient(90deg,rgba(8,28,55,.88),rgba(8,28,55,.35)),url(${mediaUrl(data.hero?.image)})`,
  };

  return (
    <main className="cal-page">
      <section className="cal-hero" style={heroStyle}>
        <div className="container">
          <span>Students</span>
          <h1>{data.intro?.title}</h1>
        </div>
      </section>

      <div className="container cal-wrap">
        <header className="cal-intro">
          <span>{data.intro?.eyebrow}</span>
          <h2>{data.intro?.title}</h2>
          <p>{data.intro?.lead}</p>
        </header>

        <section className="cal-docs">
          <h2><FiCalendar /> Academic calendar documents</h2>
          {(data.documents || []).map((doc, index) => (
            <a className="cal-doc" href={mediaUrl(doc.file)} target="_blank" rel="noreferrer" key={index}>
              <FiDownload />
              <span>
                <b>{doc.label}</b>
                <small>{doc.session} · {doc.type}</small>
              </span>
              <FiArrowUpRight />
            </a>
          ))}
        </section>

        <aside className="cal-note">{data.note}</aside>
        <p className="cal-help">For academic queries, please contact the institute office.</p>
      </div>
    </main>
  );
}
