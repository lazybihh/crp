import { useState } from "react";
import { mediaUrl } from "../../services/homeService";
import { getPolicy } from "../../services/facultyContentService";
import { sendComplaint } from "../../services/enquiryService";
import PageLoader, { usePageReady } from "../../components/PageLoader";

import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight, FiShield, FiUsers, FiMessageCircle,
  FiAlertCircle, FiInfo, FiFileText
} from "react-icons/fi";
import "./AntiRagging.css";

const principles = [
  { icon: FiShield, title: "A safe learning environment", text: "Every student should be able to learn, participate and live on campus without intimidation or humiliation." },
  { icon: FiUsers, title: "Respect for everyone", text: "Build a campus culture based on dignity, inclusion and respectful interaction between students." },
  { icon: FiMessageCircle, title: "Speak up and seek help", text: "Students who experience or witness ragging should approach an appropriate institute authority or the designated official channel." },
];

const commitments = [
  "Treat fellow students with dignity and respect",
  "Do not encourage, participate in or promote ragging",
  "Seek help promptly if a student may be at risk",
  "Cooperate with the institute's authorised response process"
];

export default function AntiRagging() {
  const { ready, data: backendContent } = usePageReady(() => getPolicy("anti-ragging").then((row) => row.content || row));
  const [formNotice, setFormNotice] = useState("");
  const [formFailed, setFormFailed] = useState(false);
  const [sending, setSending] = useState(false);

  // Sends the form to the backend; it then appears in Admin > Enquiries (filter: Complaints).
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setSending(true);
    setFormNotice("");
    try {
      await sendComplaint("anti-ragging", Object.fromEntries(new FormData(form)));
      form.reset();
      setFormFailed(false);
      setFormNotice("Your complaint has been submitted to the institute. Thank you for speaking up.");
    } catch (error) {
      setFormFailed(true);
      setFormNotice(error.message || "Could not submit the complaint. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (!ready) return <main data-faculty-content-key="anti-ragging" id="main" className="pol-page pol-ragging"><PageLoader /></main>;

  return (
    <main data-faculty-content-key="anti-ragging" id="main" className="pol-page pol-ragging">
      <section className="pol-hero" aria-label="Anti Ragging" style={{ "--pol-img": `url("${mediaUrl(backendContent?.heroImage || '/images/pages-banner.png')}")` }}>
        <div className="pol-hero__photo" />
        <div className="pol-hero__tags">
          <span className="pol-hero__tag pol-hero__tag--left">
            <span className="pol-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            {backendContent?.heroLeft || "Government Polytechnic"}
          </span>
          <span className="pol-hero__tag pol-hero__tag--right">
            <span className="pol-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            {backendContent?.heroRight || "Rohtak (Haryana)"}
          </span>
        </div>
        <nav className="pol-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link><FiChevronRight aria-hidden="true" />
          <span>Faculty</span><FiChevronRight aria-hidden="true" />
          <span aria-current="page">Anti Ragging</span>
        </nav>
      </section>

      <div className="container pol-wrap">
        <header className="pol-intro">
          <span className="pol-eyebrow">Faculty · Policies &amp; Rules</span>
          <h1>{backendContent?.title || "Anti"} <em>{backendContent?.accent || "Ragging"}</em></h1>
          <p>{backendContent?.description || "A respectful campus begins with the safety, dignity and wellbeing of every student."}</p>
        </header>

        <section className="pol-feature">
          <div className="pol-feature__mark"><FiShield /></div>
          <div>
            <span className="pol-kicker">{backendContent?.featureKicker || "Zero tolerance for ragging"}</span>
            <h2>{backendContent?.featureTitle || "Every student deserves to feel safe"}</h2>
            <p>{backendContent?.featureText || "Ragging has no place in an educational institution. Students are expected to treat one another with respect and help maintain a supportive environment for learning."}</p>
          </div>
          <span className="pol-feature__number">{backendContent?.featureNumber || "02"}</span>
        </section>

        <section className="pol-section">
          <div className="pol-section__head">
            <span className="pol-eyebrow">{backendContent?.sectionEyebrow || "Our campus principles"}</span>
            <h2>{backendContent?.sectionTitle || "Safety, respect and support"}</h2>
            <p>{backendContent?.sectionText || "The official page is currently not fully accessible for verification. This section is sample awareness content and should be checked against the institute's approved anti-ragging policy before publication."}</p>
          </div>
          <div className="pol-card-grid">
            {(backendContent?.cards?.length ? backendContent.cards : principles).map((item, i) => (
              <article className="pol-card" key={item.title}>
                <span className="pol-card__icon">{(() => { const Icon = principles[i % principles.length].icon; return <Icon />; })()}</span>
                <span className="pol-card__no">0{i + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pol-section pol-process">
          <div className="pol-section__head">
            <span className="pol-eyebrow">{backendContent?.processEyebrow || "Student responsibilities"}</span>
            <h2>{backendContent?.processTitle || "Help keep the campus welcoming"}</h2>
          </div>
          <ol>
            {(backendContent?.steps?.length ? backendContent.steps : commitments).map((item, i) => (
              <li key={item}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="pol-section pol-report" aria-labelledby="ragging-form-title">
          <div className="pol-section__head">
            <span className="pol-eyebrow">Report a concern</span>
            <h2 id="ragging-form-title">Anti-Ragging Complaint Form</h2>
            <p>Use this form layout to report a concern to the institute. Share only information relevant to the matter.</p>
          </div>

          <form className="pol-report__form" onSubmit={handleSubmit}>
            <div className="pol-report__grid">
              <input name="website" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
              <label>
                Full name <span>(optional)</span>
                <input name="fullName" type="text" autoComplete="name" placeholder="Enter your name" />
              </label>

              <label>
                You are a
                <select name="relationship" defaultValue="student" required>
                  <option value="student">Student</option>
                  <option value="parent">Parent / Guardian</option>
                  <option value="staff">Staff member</option>
                  <option value="witness">Witness</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label>
                Department / Class
                <input name="department" type="text" placeholder="Enter department or class" />
              </label>

              <label>
                Contact number or email
                <input name="contact" type="text" autoComplete="email" placeholder="How can the institute contact you?" />
              </label>

              <label>
                Approximate date of incident
                <input name="incidentDate" type="date" />
              </label>

              <label>
                Location of incident
                <input name="location" type="text" placeholder="Campus / department / other location" />
              </label>

              <label className="pol-report__wide">
                Person(s) involved, if known
                <input name="involved" type="text" placeholder="Names or identifying details (if known)" />
              </label>

              <label className="pol-report__wide">
                Describe the concern
                <textarea name="description" rows="5" required placeholder="Describe what happened, when it happened and any relevant context." />
              </label>
            </div>

            <p className="pol-report__privacy">
              <FiInfo /> If someone may be in immediate danger, contact an authorised institute official or local emergency services directly. Do not use this form for urgent help.
            </p>

            <button className="pol-report__submit" type="submit" disabled={sending}>
              <FiFileText /> {sending ? "Submitting..." : "Submit complaint"}
            </button>

            {formNotice && <p className={formFailed ? "pol-report__notice pol-report__notice--error" : "pol-report__notice"} role={formFailed ? "alert" : "status"}>{formNotice}</p>}
          </form>
        </section>

        <aside className="pol-note">
          <FiAlertCircle />
          <div>
            <strong>{backendContent?.noteTitle || "Please note"}</strong>
            <p>{backendContent?.noteText || "Complaints sent through this form reach the institute's authorised committee. Share only information relevant to the matter."}</p>
          </div>
        </aside>

        <footer className="pol-bottom">
          <span>{backendContent?.relatedTitle || "Explore another policy"}</span>
          <Link to="/faculty/training-policy">Training Policy <FiChevronRight /></Link>
          <Link to="/faculty/anti-sexual-harassment">Anti Sexual Harassment <FiChevronRight /></Link>
          <Link to="/faculty/service-rules">Service Rules <FiChevronRight /></Link>
        </footer>
      </div>
    </main>
  );
}