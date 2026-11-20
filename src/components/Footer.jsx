// Footer.jsx - site footer on every page: logo + contact + social icons, link columns, bottom bar with "back to top".
// REAL (live site footer): contact details, HSTES / HSBTE / AICTE links, Facebook and Instagram.
// SOCIAL: icons only (no names). The live footer has 4 icons but two link to "#", so only the two real pages are shown.
//   To add another (YouTube, X ...) put one row in `social` - { icon, label, href }. `label` is read aloud by screen readers.
// LEFT OUT on purpose: the dead "Result" link, the visitor counter and the developer credit.
// ADMIN-READY: all text and links are in the lists below.
import { Link } from "react-router-dom";
import { FiMapPin, FiPhone, FiMail, FiArrowUpRight, FiNavigation, FiChevronRight, FiArrowUp } from "react-icons/fi";
import { oneLineAddress, socialIcon, telHref, useSite } from "../context/SiteSettingsContext";
import "./Footer.css";

const columns = [
  { title: "Explore", links: [
    { label: "History", to: "/about/history" }, { label: "Principal's desk", to: "/about/principal-message" }, { label: "Facilities", to: "/about/facilities" },
    { label: "Courses offered", to: "/about/courses" }, { label: "Placements", to: "/about/placements" }, { label: "Contact us", to: "/about/contact" },
  ] },
  { title: "Students", links: [
    { label: "Admissions", to: "/students/admissions" }, { label: "Academic calendar", to: "/students/academic-calendar" },
    { label: "Student helpline", to: "/students/helpline" }, { label: "Grievance redressal", to: "/students/grievance" }, { label: "E-services", to: "/students/e-services" },
  ] },
  { title: "Faculty", links: [
    { label: "Training policy", to: "/faculty/training-policy" }, { label: "Service rules", to: "/faculty/service-rules" }, { label: "Anti ragging", to: "/faculty/anti-ragging" },
    { label: "Anti sexual harassment", to: "/faculty/anti-sexual-harassment" }, { label: "IQAC", to: "/faculty/iqac" }, { label: "HRMS", to: "/faculty/hrms" },
  ] },
  { title: "Official links", links: [
    { label: "HSTES", href: "" }, { label: "HSBTE", href: "" }, { label: "AICTE", href: "" },
  ] },
];

export default function Footer() {
  const { institute, contact, socialLinks, images, links, mediaUrl } = useSite();
  const site = {
    name: institute?.name || "Chhotu Ram Polytechnic",
    city: institute?.city || "Rohtak",
    phones: Array.isArray(contact?.phones) ? contact.phones.filter(Boolean) : [],
    email: contact?.email || "",
    address: oneLineAddress(contact?.addressLines),
    affiliation: `${institute?.affiliatedTo || "Affiliated to HSBTE, Panchkula"} & ${institute?.approvedBy || "Approved by AICTE, New Delhi"}`,
    mapUrl: contact?.mapUrl || "",
  };
  const social = (socialLinks || []).filter((item) => item?.url).map((item) => ({
    icon: socialIcon(item.platform),
    label: item.label || item.platform,
    href: item.url,
  }));
  const footerColumns = columns.map((column) =>
    column.title === "Official links"
      ? { ...column, links: [
          { label: "HSTES", href: links?.hstes || "" },
          { label: "HSBTE", href: links?.hsbte || "" },
          { label: "AICTE", href: links?.aicte || "" },
        ].filter((item) => item.href) }
      : column
  );
  return (
    <footer className="footer on-dark">
      <div className="container footer__grid">
        <div className="footer__brand">
          <div className="footer__logo-row">
            <Link className="footer__logo" to="/" aria-label={`${site.name}, ${site.city} - home`}>
              <img src={mediaUrl(images?.logo) || "/logo.png"} alt="" loading="lazy" />
              <span className="footer__logo-text">
                <strong>{site.name}</strong>
                <small>{site.city}, Haryana</small>
              </span>
            </Link>
            <ul className="footer__social" aria-label="Social media">
              {social.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
                      <Icon aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <p className="footer__about">{site.affiliation}</p>
          <address>
            <p>
              <FiMapPin aria-hidden="true" />
              <span>
                {site.address}{site.address && site.mapUrl ? " " : ""}
                {site.mapUrl && (
                  <a className="footer__map" href={site.mapUrl} target="_blank" rel="noopener noreferrer">
                    <FiNavigation aria-hidden="true" /> Directions<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </span>
            </p>
            {site.phones.length > 0 && <p><FiPhone aria-hidden="true" /> <span>{site.phones.map((phone, i) => <a key={phone} href={telHref(phone)}>{phone}{i < site.phones.length - 1 ? ", " : ""}</a>)}</span></p>}
            {site.email && <p><FiMail aria-hidden="true" /> <a href={`mailto:${site.email}`}>{site.email}</a></p>}
          </address>
        </div>

        {footerColumns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2>{column.title}</h2>
            <ul>
              {column.links.map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      <FiChevronRight aria-hidden="true" />{item.label}<FiArrowUpRight className="footer__ext" aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link to={item.to}><FiChevronRight aria-hidden="true" />{item.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="footer__bar">
        <div className="container footer__bar-row">
          <p>© {new Date().getFullYear()} {site.name}, {site.city}. All rights reserved.</p>
          <p>Government of Haryana · Department of Technical Education</p>
          <button type="button" className="footer__top-btn" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Back to top <FiArrowUp aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}