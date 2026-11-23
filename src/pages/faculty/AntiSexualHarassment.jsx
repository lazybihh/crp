import { useEffect, useState } from "react";
import { getPolicy } from "../../services/facultyContentService";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight, FiShield, FiUsers,
  FiLock, FiHeart, FiInfo, FiFileText
} from "react-icons/fi";
import "./AntiSexualHarassment.css";

const safeguards = [
  {
    icon: FiShield,
    title: "A respectful workplace",
    text: "The institute's published policy describes dignity and respectful treatment as an important right for employees and students."
  },
  {
    icon: FiLock,
    title: "Confidential handling",
    text: "Concerns should be handled sensitively, with care for the privacy and dignity of the people involved."
  },
  {
    icon: FiUsers,
    title: "A committee-led process",
    text: "The official page refers to a committee for addressing complaints. Current membership and contact details should be confirmed by the institute."
  },
  {
    icon: FiHeart,
    title: "Timely attention",
    text: "The published information states that complaints should receive prompt attention and appropriate action."
  },
];

const steps = [
  "Reach out through an authorised institute channel",
  "Share the concern with the designated committee or authority",
  "Allow the authorised process to review the matter",
  "Follow the official guidance communicated by the institute"
];

export default function AntiSexualHarassment() {
  const [backendContent, setBackendContent] = useState(null);
  useEffect(() => { let active = true; getPolicy("anti-sexual-harassment").then(row => { if (active) setBackendContent(row.content || row); }).catch(error => console.error("Faculty page content load failed:", error)); return () => { active = false; }; }, []);

  const [formNotice, setFormNotice] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormNotice("This is a front-end form preview. No information has been sent or stored. The institute must connect an approved, secure submission system before this form is used.");
  };

  return (
    <main data-faculty-content-key="anti-sexual-harassment" id="main" className="pol-page pol-harassment">
      <section className="pol-hero" aria-label="Anti Sexual Harassment" style={{ "--pol-img": 'url("/images/pages-banner.png")' }}>
        <div className="pol-hero__photo" />
        <div className="pol-hero__tags">
          <span className="pol-hero__tag pol-hero__tag--left">
            <span className="pol-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="pol-hero__tag pol-hero__tag--right">
            <span className="pol-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>

        <nav className="pol-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>Faculty</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Anti Sexual Harassment</span>
        </nav>
      </section>

      <div className="container pol-wrap">
        <header className="pol-intro">
          <span className="pol-eyebrow">Faculty · Policies &amp; Rules</span>
          <h1>Anti Sexual <em>Harassment</em></h1>
          <p>{backendContent?.description || "Promoting dignity, respect and a safe environment for everyone at the institute."}</p>
        </header>

        <section className="pol-feature">
          <div className="pol-feature__mark"><FiShield /></div>
          <div>
            <span className="pol-kicker">Respect and dignity</span>
            <h2>A campus where everyone is treated with respect</h2>
            <p>The institute's published information says employees and students have the right to be treated with dignity, and that concerns should receive prompt attention.</p>
          </div>
          <span className="pol-feature__number">03</span>
        </section>

        <section className="pol-section">
          <div className="pol-section__head">
            <span className="pol-eyebrow">Policy commitments</span>
            <h2>What the published policy highlights</h2>
            <p>These points summarise the information available on the institute's official page.</p>
          </div>

          <div className="pol-card-grid">
            {safeguards.map(({ icon: Icon, title, text }, i) => (
              <article className="pol-card" key={title}>
                <span className="pol-card__icon"><Icon /></span>
                <span className="pol-card__no">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pol-section pol-process">
          <div className="pol-section__head">
            <span className="pol-eyebrow">Seeking assistance</span>
            <h2>How to raise a concern</h2>
            <p>This is general page guidance, not a substitute for the institute's formal complaint procedure.</p>
          </div>

          <ol>
            {steps.map((item, i) => (
              <li key={item}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="pol-section pol-report" aria-labelledby="harassment-form-title">
          <div className="pol-section__head">
            <span className="pol-eyebrow">Confidential reporting</span>
            <h2 id="harassment-form-title">Anti-Sexual Harassment Complaint Form</h2>
            <p>This form is intended for sharing a concern with the institute's authorised committee. Please provide only details needed to understand the concern.</p>
          </div>

          <form className="pol-report__form" onSubmit={handleSubmit}>
            <div className="pol-report__grid">
              <label>
                Full name <span>(optional)</span>
                <input name="fullName" type="text" autoComplete="name" placeholder="Enter your name" />
              </label>

              <label>
                You are a
                <select name="relationship" defaultValue="student" required>
                  <option value="student">Student</option>
                  <option value="employee">Employee</option>
                  <option value="visitor">Visitor</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label>
                Department / Designation
                <input name="department" type="text" placeholder="Enter department or designation" />
              </label>

              <label>
                Preferred contact detail
                <input name="contact" type="text" placeholder="Phone number or email address" />
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
                Person(s) complained against, if known
                <input name="respondent" type="text" placeholder="Name or designation, if known" />
              </label>

              <label className="pol-report__wide">
                Describe the concern
                <textarea name="description" rows="5" required placeholder="Describe the concern and include any relevant dates or context. Avoid including unrelated personal information." />
              </label>

              <label className="pol-report__wide">
                How would you prefer the authorised committee to contact you?
                <select name="contactPreference" defaultValue="email">
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="either">Either method</option>
                  <option value="no-contact">I prefer not to be contacted for now</option>
                </select>
              </label>
            </div>

            <p className="pol-report__privacy">
              <FiLock /> Please share this information only through the institute's approved secure channel. This page preview does not provide a confidential submission service.
            </p>

            <button className="pol-report__submit" type="submit">
              <FiFileText /> Submit complaint
            </button>

            {formNotice && (
              <p className="pol-report__notice" role="status">
                {formNotice}
              </p>
            )}
          </form>
        </section>

        <aside className="pol-note">
          <FiInfo />
          <div>
            <strong>Important before publication</strong>
            <p>The official page refers to a committee, but its current membership and contact details must be verified by the institute. This form is a front-end preview only; it does not send, save or email submissions. Connect an approved secure complaint-handling system before collecting real complaints.</p>
          </div>
        </aside>

        <footer className="pol-bottom">
          <span>Explore another policy</span>
          <Link to="/faculty/training-policy">Training Policy <FiChevronRight /></Link>
          <Link to="/faculty/anti-ragging">Anti Ragging <FiChevronRight /></Link>
          <Link to="/faculty/service-rules">Service Rules <FiChevronRight /></Link>
        </footer>
      </div>
    </main>
  );
}