// GrievanceRedressal.jsx - Students > Grievance redressal (route: /students/grievance).
// Page order: hero -> title + navy "how it works" card -> two forms -> the two committees -> help strip.
// Own hero, own styles (GrievanceRedressal.css, every class starts with "grv-").
// Content comes from the database; the lists below are the fallback and seed.
//
// WHAT IS REAL AND WHAT IS SAMPLE
//   REAL     the shape of the two committees (a Chairman plus members) and the one-line procedure: members review
//            suggestions and take corrective action promptly. The two Google Forms. The contact details (same as Navbar/Footer).
//   TO FILL  the committee names and designations. Every `name` below is empty and the card shows "Name to be added".
//            Fill them in from the admin page (Grievance redressal).
//   SAMPLE   the intro wording and the three "how it works" step texts. They only restate the procedure in plain words.
//   NOT SHOWN  a separate "student feedback" link. The two Google Forms cover it.
//
// EDITING: `committees` is the list to edit - each member is { role, name }. Add or remove members freely.
//
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight as FiCrumbArrow, FiArrowRight, FiPhone, FiMail, FiEdit3, FiSearch, FiCheckCircle,
  FiMessageCircle, FiExternalLink, FiUsers, FiUser, FiMonitor,
} from "react-icons/fi";
import PageLoader from "../../components/PageLoader";
import { useStudentPage, mergeStudentContent } from "../../services/studentPageService";
import { mediaUrl } from "../../services/mediaService";
import "./GrievanceRedressal.css";
import { useSite } from "../../context/SiteSettingsContext";

const defaultHero = { image: "/images/campus-3.jpg" }; // wide photo; if it is missing a patterned navy banner shows instead

const defaultIntro = {
  eyebrow: "Students",
  title: "Grievance redressal",
  lead: "If something is troubling you at the institute, you can say so. Your concern is read by a committee and acted on.", // SAMPLE wording
};

// SAMPLE wording of the REAL procedure: members review suggestions and take corrective action promptly.
const defaultSteps = [
  { icon: FiEdit3, title: "Share it", text: "Fill in the form or tell the office." },
  { icon: FiSearch, title: "It is reviewed", text: "The committee members read it." },
  { icon: FiCheckCircle, title: "Action is taken", text: "Corrective action is taken promptly." },
];

// REAL - the two Google Forms. Both open in a new tab.
// The two committees. REAL structure; names and designations are TO FILL (see the top of this file).
// Keep the Chairman first. An empty name shows "Name to be added".
const defaultCommittees = [
  {
    id: "main",
    icon: FiUsers,
    title: "Grievances Redressal Committee",
    members: [
      { role: "Chairman", name: "" },
      { role: "Member", name: "" },
      { role: "Member", name: "" },
      { role: "Member", name: "" },
      { role: "Member", name: "" },
    ],
  },
  {
    id: "online",
    icon: FiMonitor,
    title: "Online Grievances Redressal Committee",
    members: [
      { role: "Chairman", name: "" },
      { role: "Member", name: "" },
      { role: "Member", name: "" },
    ],
  },
];

// Saved paths that start with /uploads/ become full backend addresses; everything else is left as it is.
function resolveStudentMedia(value) {
  if (Array.isArray(value)) return value.map(resolveStudentMedia);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveStudentMedia(item)]));
  }
  if (typeof value === "string" && value.startsWith("/uploads/")) return mediaUrl(value);
  return value;
}

export default function GrievanceRedressal() {
  const { ready, content: savedContent } = useStudentPage("grievance");
  const pageContent = resolveStudentMedia(
    mergeStudentContent(
      {
      hero: defaultHero,
      intro: defaultIntro,
      steps: defaultSteps,
      committees: defaultCommittees,
      },
      savedContent
    )
  );
  const hero = pageContent.hero ?? defaultHero;
  const intro = pageContent.intro ?? defaultIntro;
  const steps = pageContent.steps ?? defaultSteps;
  const committees = pageContent.committees ?? defaultCommittees;

  const { contact, links } = useSite();
  const forms = [
    { icon: FiMessageCircle, title: "Grievances form", text: "Use this form to raise a grievance with the committee.", label: "Open the grievances form", href: links?.grievanceForm || "" },
    { icon: FiEdit3, title: "Students feedback form", text: "Share your feedback or suggestions about the institute.", label: "Open the feedback form", href: links?.studentFeedbackForm || "" },
  ].filter((item) => item.href);
  if (!ready) return <main id="main" className="grv-page"><PageLoader /></main>;

  return (
    <main id="main" className="grv-page">
      <section className="grv-hero" aria-label="Grievance redressal" style={{ "--img": `url("${hero.image}")` }}>
        <div className="grv-hero__photo" />
        <div className="grv-hero__tags">
          <span className="grv-hero__tag grv-hero__tag--left">
            <span className="grv-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="grv-hero__tag grv-hero__tag--right">
            <span className="grv-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="grv-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiCrumbArrow aria-hidden="true" />
          <span>Students</span>
          <FiCrumbArrow aria-hidden="true" />
          <span aria-current="page">Grievance redressal</span>
        </nav>
      </section>

      <div className="container grv-wrap">
        {/* ---- title + navy "how it works" card ---- */}
        <div className="grv-top">
          <header className="grv-intro">
            <span className="grv-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <aside className="grv-flow" aria-labelledby="grv-flow-title">
            <h2 id="grv-flow-title">How a grievance is handled</h2>
            <ol>
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <li key={step.title}>
                    <span className="grv-flow__icon"><Icon aria-hidden="true" /></span>
                    <span className="grv-flow__text">
                      <strong>{step.title}</strong>
                      {step.text}
                    </span>
                    <span className="grv-flow__no" aria-hidden="true">0{index + 1}</span>
                  </li>
                );
              })}
            </ol>
          </aside>
        </div>

        {/* ---- the two forms ---- */}
        <section className="grv-block" aria-labelledby="grv-forms-title">
          <header className="grv-head">
            <span className="grv-eyebrow grv-eyebrow--line">Speak up</span>
            <h2 id="grv-forms-title">Two <span>online forms</span></h2>
          </header>
          <ul className="grv-forms">
            {forms.map((form) => {
              const Icon = form.icon;
              return (
                <li key={form.title} className="grv-form">
                  <span className="grv-form__icon"><Icon aria-hidden="true" /></span>
                  <h3>{form.title}</h3>
                  <p>{form.text}</p>
                  <a className="grv-btn grv-btn--primary" href={form.href} target="_blank" rel="noopener noreferrer">
                    {form.label}
                    <FiExternalLink aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---- the two committees ---- */}
        <section className="grv-block" aria-labelledby="grv-com-title">
          <header className="grv-head">
            <span className="grv-eyebrow grv-eyebrow--line">Who reads your concern</span>
            <h2 id="grv-com-title">The <span>committees</span></h2>
          </header>
          <div className="grv-committees">
            {committees.map((committee) => {
              const Icon = committee.icon;
              return (
                <article key={committee.id} className="grv-committee" aria-labelledby={`grv-com-${committee.id}`}>
                  <header>
                    <span className="grv-committee__icon"><Icon aria-hidden="true" /></span>
                    <h3 id={`grv-com-${committee.id}`}>{committee.title}</h3>
                  </header>
                  <ul>
                    {committee.members.map((member, index) => (
                      <li key={`${member.role}-${index}`} className={member.role === "Chairman" ? "grv-committee__chair" : ""}>
                        <span className="grv-committee__avatar"><FiUser aria-hidden="true" /></span>
                        <span className="grv-committee__who">
                          <strong>{member.name || "Name to be added"}</strong>
                          {member.role}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        {/* ---- help strip ---- */}
        <section className="grv-help" aria-labelledby="grv-help-title">
          <div>
            <h2 id="grv-help-title">Prefer to talk to someone?</h2>
            <p>Call or write to the institute office. You can also see all the ways to reach us on the helpline page.</p>
          </div>
          <div className="grv-help__actions">
            <a className="grv-btn grv-btn--primary" href={`tel:${contact.phones[0].replace(/-/g, "")}`}>
              <FiPhone aria-hidden="true" />
              {contact.phones.join(" / ")}
            </a>
            <a className="grv-btn grv-btn--ghost" href={`mailto:${contact.email}`}>
              <FiMail aria-hidden="true" />
              {contact.email}
            </a>
            <Link className="grv-btn grv-btn--ghost" to="/students/helpline">
              Student helpline
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
