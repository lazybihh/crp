// Contact.jsx - About us > Contact us (route: /about/contact).
// Page order: hero -> title + navy "find us" card -> contact details beside the map -> feedback and complaint forms -> follow us strip.
// Own hero, own styles (Contact.css, every class starts with "cnt-").
//
// WHAT IS REAL
//   Everything here is from the live Contact page (crprohtak.ac.in/contact): phones, address, the map, the directions link,
//   Facebook, Instagram and the three Google Forms. The live page has no contact form and no staff directory, so none is shown.
//   The email is the institute's government address (the same as the Navbar and Footer). The live footer also shows a gmail
//   address; it is NOT used here.
//
// ADMIN-READY: Site settings covers contact details and links. The intro and enquiry topics can be
// edited in Admin > Contact us. Its hero banner is edited there too. Messages from the form are saved as enquiries.
//
// NO FILES TO COPY: this page uses no pictures except the shared banner (public/images/pages-banner.png).
// The map is an embedded Google Map (the only thing loaded from outside). If it cannot load, the "Get directions" button still works.
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight as FiCrumbArrow, FiPhone, FiMail, FiNavigation, FiExternalLink, FiUsers, FiMessageSquare,
  FiEdit3, FiArrowRight, FiSend, FiCheckCircle,
} from "react-icons/fi";
import "./Contact.css";
import { socialIcon, useSite } from "../../context/SiteSettingsContext";
import { sendEnquiry } from "../../services/enquiryService";
import { getContactPage } from "../../services/contactPageService";
import { mediaUrl } from "../../services/homeService";
import PageLoader, { usePageReady } from "../../components/PageLoader";

const hero = { image: "/images/pages-banner.png" }; // wide photo; if it is missing a patterned navy banner shows instead

const intro = {
  eyebrow: "About us",
  title: "Contact us",
  lead: "Call, write or visit the institute office. Everything you need to find us is on this page.",
};

// REAL - same details as the Navbar and Footer.
// REAL - the three Google Forms from the live site. All open in a new tab.
// ---- contact form (popup) ----
const formConfig = {
  topics: ["Admissions", "Courses and fees", "Results and exams", "Something else"],
};

const emptyForm = { name: "", phone: "", email: "", role: "Prospective student", department: "Not sure yet", topic: formConfig.topics[0], message: "" };

function validate(values) {
  const errors = {};
  const digits = values.phone.replace(/\D/g, "");
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (digits.length < 10 || digits.length > 13) errors.phone = "Enter a phone number with at least 10 digits.";
  if (values.email && !/^\S+@\S+\.\S+$/.test(values.email.trim())) errors.email = "Enter a valid email address, or leave it empty.";
  if (values.message.trim().length < 10) errors.message = "Write your message (at least 10 characters).";
  return errors;
}

// The message form is embedded directly in the page, above the online feedback forms.
function InlineMessageForm({ topics, contact }) {
  const formRef = useRef(null);
  const [values, setValues] = useState({ ...emptyForm, topic: topics[0] || "Something else" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | failed
  const [serverError, setServerError] = useState("");
  const [website, setWebsite] = useState("");
  const [sentMode, setSentMode] = useState("saved");

  useEffect(() => {
    setValues((current) => ({
      ...current,
      topic: topics.includes(current.topic) ? current.topic : (topics[0] || ""),
    }));
  }, [topics]);

  const change = (name) => (event) => {
    setValues((prev) => ({ ...prev, [name]: event.target.value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const fieldProps = (name) => ({
    id: `cnt-f-${name}`,
    name,
    value: values[name],
    onChange: change(name),
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": errors[name] ? `cnt-f-${name}-error` : undefined,
  });

  const fieldError = (name) =>
    errors[name] ? <span className="cnt-field__error" id={`cnt-f-${name}-error`}>{errors[name]}</span> : null;

  const reset = () => {
    setValues({ ...emptyForm, topic: topics[0] || "Something else" });
    setErrors({});
    setStatus("idle");
    setServerError("");
    setWebsite("");
  };

  const submit = async (event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus("sending");
    setServerError("");
    try {
      await sendEnquiry({ ...values, website });
      setSentMode("saved");
      setStatus("sent");
      window.dispatchEvent(new Event("enquiries-updated"));
      return;
    } catch (error) {
      if (error.status === 400 || error.status === 429) {
        setServerError(error.message);
        setStatus("idle");
        return;
      }
    }

    // Server unreachable or 5xx: keep the typed values and open the visitor's email app.
    const subject = `${values.topic} - message from ${values.name.trim()}`;
    const lines = [`Name: ${values.name.trim()}`, `Phone: ${values.phone.trim()}`, `I am a: ${values.role}`, `Department / course: ${values.department}`];
    if (values.email.trim()) lines.push(`Email: ${values.email.trim()}`);
    lines.push(`Topic: ${values.topic}`, "", values.message.trim());
    const body = lines.join("\n");
    const link = document.createElement("a");
    link.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    link.click();
    setStatus("sent");
    setSentMode("email");
  };

  return (
    <section className="cnt-block cnt-message-section" id="cnt-message-form" aria-labelledby="cnt-msg-title">
      <div className="cnt-inline-form">
        <div className="cnt-modal__head">
          <div>
            <h2 id="cnt-msg-title">Send us a message</h2>
          </div>
        </div>

        {status === "sent" ? (
          <div className="cnt-modal__done" role="status">
            <FiCheckCircle aria-hidden="true" />
            <h3>{sentMode === "saved" ? "Message sent" : "Your email is ready"}</h3>
            <p>
              {sentMode === "saved"
                ? "Thank you. The institute office will read your message and get back to you."
                : "Your email app has opened with your message written. Press Send there to finish. If nothing opened, write to us at "}
              {sentMode === "email" && <a href={`mailto:${contact.email}`}>{contact.email}</a>}
              {sentMode === "email" && "."}
            </p>
            <button type="button" className="cnt-btn cnt-btn--primary" onClick={reset}>Send another message</button>
          </div>
        ) : (
          <form ref={formRef} className="cnt-modal__body" onSubmit={submit} noValidate>
            <input
              type="text"
              name="website"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
              style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px" }}
            />
            <div className="cnt-form-intro">
              <span className="cnt-form-intro__icon"><FiSend aria-hidden="true" /></span>
              <div><strong>College enquiry form</strong><span>Share your details so we can direct your message to the right place.</span></div>
              <span className="cnt-form-intro__required">* Required fields</span>
            </div>
            <div className="cnt-fields">
              <div className="cnt-field">
                <label htmlFor="cnt-f-name">Your name <span className="cnt-field__req" aria-hidden="true">*</span></label>
                <input type="text" autoComplete="name" required {...fieldProps("name")} />
                {fieldError("name")}
              </div>
              <div className="cnt-field">
                <label htmlFor="cnt-f-phone">Phone number <span className="cnt-field__req" aria-hidden="true">*</span></label>
                <input type="tel" inputMode="tel" autoComplete="tel" required {...fieldProps("phone")} />
                {fieldError("phone")}
              </div>
              <div className="cnt-field">
                <label htmlFor="cnt-f-email">Email (optional)</label>
                <input type="email" autoComplete="email" {...fieldProps("email")} />
                {fieldError("email")}
              </div>
              <div className="cnt-field">
                <label htmlFor="cnt-f-role">I am contacting as</label>
                <select {...fieldProps("role")}>
                  <option>Prospective student</option>
                  <option>Current student</option>
                  <option>Parent / guardian</option>
                  <option>Alumnus / alumna</option>
                  <option>Faculty / staff</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="cnt-field">
                <label htmlFor="cnt-f-department">Department / course</label>
                <select {...fieldProps("department")}>
                  <option>Not sure yet</option>
                  <option>Computer Engineering</option>
                  <option>Civil Engineering</option>
                  <option>Electrical Engineering</option>
                  <option>Electronics Engineering</option>
                  <option>Mechanical Engineering</option>
                  <option>Plastic Technology</option>
                  <option>Applied Sciences</option>
                  <option>Workshop</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="cnt-field">
                <label htmlFor="cnt-f-topic">Enquiry topic</label>
                <select {...fieldProps("topic")}>
                  {topics.map((topic) => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              <div className="cnt-field cnt-field--wide">
                <label htmlFor="cnt-f-message">Your message <span className="cnt-field__req" aria-hidden="true">*</span></label>
                <textarea rows={4} maxLength={1000} required {...fieldProps("message")} />
                {fieldError("message")}
              </div>
            </div>

            {status === "failed" && (
              <p className="cnt-modal__alert" role="alert">
                The message could not be sent. Try again, or call {contact.phones[0]}.
              </p>
            )}
            {serverError && (
              <p className="cnt-modal__alert" role="alert">{serverError}</p>
            )}

            <div className="cnt-modal__actions">
              <button type="button" className="cnt-btn cnt-btn--quiet" onClick={reset}>Clear form</button>
              <button type="submit" className="cnt-btn cnt-btn--primary" disabled={status === "sending"}>
                <FiSend aria-hidden="true" />
                {status === "sending" ? "Sending..." : "Send message"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

export default function Contact() {
  const { institute, contact: contactSettings, links, socialLinks } = useSite();
  const { ready, data: savedPage } = usePageReady(() => getContactPage());
  const pageText = {
    eyebrow: savedPage?.intro?.eyebrow || intro.eyebrow,
    title: savedPage?.intro?.title || intro.title,
    lead: savedPage?.intro?.lead || intro.lead,
  };
  const pageTopics = Array.isArray(savedPage?.topics) && savedPage.topics.length ? savedPage.topics : formConfig.topics;
  const heroImage = mediaUrl(savedPage?.bannerImage) || hero.image;
  const contact = {
    name: institute?.name || "Chhotu Ram Polytechnic",
    phones: contactSettings?.phones || [],
    email: contactSettings?.email || "",
    address: contactSettings?.addressLines || [],
    directions: contactSettings?.directionsUrl || "",
    mapEmbed: contactSettings?.mapEmbed || "",
  };
  const forms = [
    { icon: FiUsers, title: "Faculty feedback form", text: "For teachers and staff to share feedback.", href: links?.facultyFeedbackForm || "" },
    { icon: FiEdit3, title: "Students feedback form", text: "For students to share feedback and suggestions.", href: links?.studentFeedbackForm || "" },
    { icon: FiMessageSquare, title: "Grievances form", text: "To raise a grievance with the committee.", href: links?.grievanceForm || "" },
  ].filter((item) => item.href);
  const social = (socialLinks || []).filter((item) => item?.url).map((item) => ({
    icon: socialIcon(item.platform),
    label: item.label || item.platform,
    href: item.url,
  }));

  if (!ready) return <main id="main" className="cnt-page"><PageLoader /></main>;

  return (
    <main id="main" className="cnt-page">
      <section className="cnt-hero" aria-label="Contact us" style={{ "--img": `url("${heroImage || hero.image}")` }}>
        <div className="cnt-hero__photo" />
        <div className="cnt-hero__tags">
          <span className="cnt-hero__tag cnt-hero__tag--left">
            <span className="cnt-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="cnt-hero__tag cnt-hero__tag--right">
            <span className="cnt-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="cnt-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiCrumbArrow aria-hidden="true" />
          <span>About us</span>
          <FiCrumbArrow aria-hidden="true" />
          <span aria-current="page">Contact us</span>
        </nav>
      </section>

      <div className="container cnt-wrap">
        {/* ---- title + navy "find us" card ---- */}
        <div className="cnt-top">
          <header className="cnt-intro">
            <span className="cnt-eyebrow">{pageText.eyebrow}</span>
            <h1>{pageText.title}</h1>
            <p>{pageText.lead}</p>
          </header>

          <aside className="cnt-place" aria-labelledby="cnt-place-title">
            <span className="cnt-place__icon"><FiMapPin aria-hidden="true" /></span>
            <h2 id="cnt-place-title">{contact.name}</h2>
            <address>
              {contact.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
            <div className="cnt-place__actions">
              <a className="cnt-btn cnt-btn--primary" href={contact.directions} target="_blank" rel="noopener noreferrer">
                <FiNavigation aria-hidden="true" />
                Get directions
                <span className="sr-only">(opens in a new tab)</span>
              </a>
              <a className="cnt-btn cnt-btn--ghost" href={`tel:${contact.phones[0].replace(/-/g, "")}`}>
                <FiPhone aria-hidden="true" />
                Call now
              </a>
            </div>
          </aside>
        </div>

        {/* ---- details beside the map ---- */}
        <section className="cnt-block" aria-labelledby="cnt-find-title">
          <header className="cnt-head cnt-head--row">
            <div>
              <span className="cnt-eyebrow cnt-eyebrow--line">Find us</span>
              <h2 id="cnt-find-title">Get in <span>touch</span></h2>
            </div>
          </header>
          <div className="cnt-find">
            <ul className="cnt-details">
              <li>
                <span className="cnt-details__icon"><FiPhone aria-hidden="true" /></span>
                <span className="cnt-details__text">
                  <strong>Phone</strong>
                  {contact.phones.map((phone) => (
                    <a key={phone} href={`tel:${phone.replace(/-/g, "")}`}>{phone}</a>
                  ))}
                </span>
              </li>
              <li>
                <span className="cnt-details__icon"><FiMail aria-hidden="true" /></span>
                <span className="cnt-details__text">
                  <strong>Email</strong>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </span>
              </li>
              <li>
                <span className="cnt-details__icon"><FiMapPin aria-hidden="true" /></span>
                <span className="cnt-details__text">
                  <strong>Address</strong>
                  {contact.address.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              </li>
            </ul>

            <div className="cnt-map">
              <iframe
                title="Map showing Chhotu Ram Polytechnic, Rohtak"
                src={contact.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* ---- inline message form, directly above the existing online forms ---- */}
        <InlineMessageForm topics={pageTopics} contact={contact} />

        {/* ---- the three forms (same size) ---- */}
        <section className="cnt-block" aria-labelledby="cnt-forms-title">
          <header className="cnt-head">
            <span className="cnt-eyebrow cnt-eyebrow--line">Feedback and complaints</span>
            <h2 id="cnt-forms-title">Online <span>forms</span></h2>
          </header>
          <ul className="cnt-forms">
            {forms.map((form) => {
              const Icon = form.icon;
              return (
                <li key={form.title}>
                  <a className="cnt-form" href={form.href} target="_blank" rel="noopener noreferrer">
                    <span className="cnt-form__icon"><Icon aria-hidden="true" /></span>
                    <h3>{form.title}</h3>
                    <p>{form.text}</p>
                    <span className="cnt-form__go">
                      Open form
                      <FiExternalLink aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---- follow us strip ---- */}
        <section className="cnt-follow" aria-labelledby="cnt-follow-title">
          <div>
            <h2 id="cnt-follow-title">Follow the institute</h2>
            <p>News, events and moments from campus.</p>
          </div>
          <div className="cnt-follow__actions">
            {social.map((item) => {
              const Icon = item.icon;
              return (
                <a key={item.label} className="cnt-btn cnt-btn--ghost" href={item.href} target="_blank" rel="noopener noreferrer">
                  <Icon aria-hidden="true" />
                  {item.label}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              );
            })}
            <Link className="cnt-btn cnt-btn--primary" to="/students/helpline">
              Student helpline
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>

    </main>
  );
}