import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  FiChevronDown,
  FiMenu,
  FiX,
  FiPhone,
  FiMail,
  FiMapPin,
  FiHome,
  FiCheck,
  FiArrowRight,
  FiArrowUpRight,
} from "react-icons/fi";
import { socialIcon, telHref, useSite } from "../context/SiteSettingsContext";
import "./Navbar.css";
import { AdmissionFormButton } from "./LeadForm";

const link = (label, to) => ({ label, to });
const external = (label, href) => ({ label, href });

const departments = [
  link("Civil Engineering", "/departments/civil"),
  link("Computer Engineering", "/departments/computer"),
  link("Electrical Engineering", "/departments/electrical"),
  link("Electronics & Communication", "/departments/electronics"),
  link("Mechanical Engineering", "/departments/mechanical"),
  link("Plastic Technology", "/departments/plastic"),
  link("Applied Sciences", "/departments/applied-science"),
  link("Workshop Department", "/departments/workshop"),
  link("Administrative", "/departments/administrative"),
];

const navItems = [
  { label: "Home", to: "/", icon: FiHome },
  {
    label: "About us",
    match: ["/about"],
    columns: [
      {
        title: "Our institute",
        items: [
          link("History", "/about/history"),
          link("Principal's desk", "/about/principal-message"),
          link("Rank & accreditation", "/about/rank-accreditation"),
          link("Alumni", "/about/alumni"),
        ],
      },
      {
        title: "Academics",
        items: [
          link("Courses offered", "/about/courses"),
          link("Results", "/about/results"),
          link("Placements", "/about/placements"),
          link("Entrepreneurship", "/about/entrepreneurship"),
          link("Annual report", "/about/annual-report"),
        ],
      },
      {
        title: "Achievements",
        items: [
          link("Luminaries", "/about/luminaries"),
          link("Projects", "/about/projects"),
          link("Extracurricular achievements", "/about/extracurricular"),
          link("Unnat Bharat Abhiyan", "/about/unnat-bharat-abhiyan"),
        ],
      },
    ],
  },
  {
    label: "Students",
    match: ["/students"],
    columns: [
      {
        title: "Admissions & student support",
        items: [
          link("Academic calendar", "/students/academic-calendar"),
          link("Admissions", "/students/admissions"),
          external("Exams (HSBTE)", ""),
          link("Online learning portals", "/students/online-learning"),
          external("Code of conduct", "/docs/code-of-conduct-for-students.pdf"),
          link("Student helpline", "/students/helpline"),
          link("Grievance redressal", "/students/grievance"),
          link("E-services", "/students/e-services"),
        ],
      },
      {
        title: "Skills & careers",
        items: [
          link("Skill courses", "/students/skill-courses"),
          link("Freelancing", "/students/freelancing"),
          link("Incubator", "/students/incubator"),
          link("Apprenticeship", "/students/apprenticeship"),
          link("NCC & NSS", "/students/ncc-nss"),
        ],
      },
      {
        title: "Departments",
        items: [
          link("Applied Science Department", "/students/departments/applied-science"),
          link("Civil Department", "/students/departments/civil"),
          link("Computer Department", "/students/departments/computer"),
          link("Electrical Department", "/students/departments/electrical"),
          link("Electronics Department", "/students/departments/electronics"),
          link("Mechanical Department", "/students/departments/mechanical"),
          link("Plastic Department", "/students/departments/plastic"),
        ],
      },
    ],
  },
  {
    label: "Faculty",
    match: ["/faculty"],
    columns: [
      { title: "Departments", items: departments },
      {
        title: "Policies & rules",
        items: [
          link("Training policy", "/faculty/training-policy"),
          link("Anti ragging", "/faculty/anti-ragging"),
          link("Anti sexual harassment", "/faculty/anti-sexual-harassment"),
          link("Service rules", "/faculty/service-rules"),
        ],
      },
      {
        title: "Services",
        items: [
          link("IQAC", "/faculty/iqac"),
          external("HRMS", ""),
          link("E-services", "/faculty/e-services"),
        ],
      },
    ],
  },
  { label: "Facilities", to: "/about/facilities" },
  {
    label: "Media",
    match: ["/media"],
    items: [
      link("Photos", "/media/photos"),
      link("Videos", "/media/videos"),
      link("Social links", "/media/social"),
    ],
  },
  { label: "Notices", to: "/notices" },
  { label: "Events", to: "/events" },
  { label: "Contact us", to: "/about/contact" },
];

function Brand() {
  const { institute, images, mediaUrl } = useSite();
  const siteName = institute?.name || "Chhotu Ram Polytechnic";
  const siteCity = institute?.city || "Rohtak";
  return (
    <Link className="navbar__brand" to="/" aria-label={`${siteName}, ${siteCity} - home`}>
      <img
        className="navbar__brand-logo"
        src={mediaUrl(images?.logo) || "/logo.png"}
        width="180"
        height="180"
        alt=""
      />
      <span className="navbar__brand-copy">
        <span className="navbar__brand-name">CHHOTU RAM POLYTECHNIC</span>
        <span className="navbar__brand-location">
          <span />
          ROHTAK, HARYANA
          <span />
        </span>
      </span>
    </Link>
  );
}

function MenuLink({ item, onNavigate }) {
  const Icon = item.icon;

  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>
        {item.label}
        <FiArrowUpRight aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }

  return (
    <NavLink to={item.to} end={item.to === "/"} onClick={onNavigate}>
      <span className="menu-link">
        {Icon && <Icon aria-hidden="true" />}
        {item.label}
      </span>
    </NavLink>
  );
}

/* "Pay Online Fee" call-to-action (header on desktop, drawer on mobile). */
function PayFee({ className = "", onNavigate }) {
  const { links } = useSite();
  if (!links?.payFee) return null;
  return (
    <a className={`pay-fee ${className}`} href={links.payFee} target="_blank" rel="noopener noreferrer" onClick={onNavigate}>
      <span className="pay-fee__icon" aria-hidden="true">&#8377;</span>
      <span className="pay-fee__label">Pay Online Fee</span>
      <FiArrowRight aria-hidden="true" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/* One half of the gold laurel wreath around the year. */
function Laurel({ flip = false }) {
  const leaves = [
    [17, 67, -55],
    [11.4, 56, -40],
    [8.6, 42, -25],
    [8.8, 25, -10],
    [10.9, 11, 5],
  ];

  return (
    <svg
      className={`est-badge__laurel${flip ? " is-flipped" : ""}`}
      viewBox="0 0 34 80"
      aria-hidden="true"
    >
      <path
        d="M26 76C9 64 4 40 12 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {leaves.map(([x, y, angle]) => (
        <g key={y}>
          <ellipse
            cx={x - 4}
            cy={y}
            rx="5.5"
            ry="2.3"
            fill="currentColor"
            transform={`rotate(${angle} ${x - 4} ${y})`}
          />
          <ellipse
            cx={x + 4}
            cy={y - 2}
            rx="4.6"
            ry="2"
            fill="currentColor"
            opacity="0.8"
            transform={`rotate(${-angle - 90} ${x + 4} ${y - 2})`}
          />
        </g>
      ))}
    </svg>
  );
}

function EstablishedBadge() {
  const { institute } = useSite();
  const establishedYear = institute?.establishedYear || "1956";
  return (
    <div className="est-badge" role="img" aria-label={`Established in ${establishedYear} - years of excellence`}>
      <Laurel />
      <div className="est-badge__center">
        <strong>{establishedYear}</strong>
        <span>Years of Excellence</span>
        <em aria-hidden="true">&#9733; &#9733; &#9733;</em>
      </div>
      <Laurel flip />
    </div>
  );
}

export default function Navbar() {
  const { institute, contact, socialLinks, images, headerButton, links, mediaUrl } = useSite();
  const site = {
    name: institute?.name || "Chhotu Ram Polytechnic",
    city: institute?.city || "Rohtak",
    tagline: institute?.tagline || "Government Polytechnic, Rohtak, Haryana",
    phones: Array.isArray(contact?.phones) ? contact.phones.filter(Boolean) : [],
    email: contact?.email || "",
  };
  const social = (socialLinks || []).filter((item) => item?.url).map((item) => ({
    icon: socialIcon(item.platform),
    label: item.label || item.platform,
    href: item.url,
  }));
  const navCta = headerButton?.show !== false
    ? { label: headerButton?.label || "Admissions Open", to: headerButton?.link || "/admissions" }
    : null;
  const activeNavItems = navItems.map((group) => ({
    ...group,
    columns: group.columns?.map((column) => ({
      ...column,
      items: column.items
        .map((item) => {
          if (item.label === "Exams (HSBTE)") return links?.hsbte ? { ...item, href: links.hsbte } : null;
          if (item.label === "HRMS") return links?.hrms ? { ...item, href: links.hrms } : null;
          return item;
        })
        .filter(Boolean),
    })),
  }));
  const { pathname } = useLocation();
  const [open, setOpen] = useState(null);
  const [drawer, setDrawer] = useState(false);
  const [group, setGroup] = useState(null);

  const leaveTimer = useRef(null);
  const burgerRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    setOpen(null);
    setDrawer(false);
  }, [pathname]);

  // keep an open mega menu inside the screen: it starts under its own button and only slides left if it would run off the right edge
  useLayoutEffect(() => {
    const panel = document.querySelector(".menu__group--mega.is-open .menu-panel");
    if (!panel) return;
    panel.style.setProperty("--mega-shift", "0px");
    const box = panel.getBoundingClientRect();
    const edge = document.documentElement.clientWidth - 16;
    const shift = box.right > edge ? edge - box.right : 0;
    const left = box.left + shift;
    panel.style.setProperty("--mega-shift", `${left < 16 ? shift + (16 - left) : shift}px`);
  }, [open]);

  useEffect(() => {
    if (!drawer) return;

    document.body.style.overflow = "hidden";
    drawerRef.current?.querySelector("button")?.focus();

    const onKey = (event) => {
      if (event.key === "Escape") {
        setDrawer(false);
        burgerRef.current?.focus();
      }

      if (event.key !== "Tab") return;

      const nodes = drawerRef.current.querySelectorAll("a[href], button");
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  const isActive = (item) =>
    item.match?.some((prefix) => pathname.startsWith(prefix));

  const hoverIn = (label) => (event) => {
    if (event.pointerType !== "mouse") return;
    clearTimeout(leaveTimer.current);
    setOpen(label);
  };

  const hoverOut = (event) => {
    if (event.pointerType !== "mouse") return;
    leaveTimer.current = setTimeout(() => setOpen(null), 160);
  };

  const closeAll = () => {
    setOpen(null);
    setDrawer(false);
  };

  const groupLinks = (item) =>
    item.columns ?? [{ title: null, items: item.items }];

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <header className="site-header on-dark">
        {/* Top contact strip scrolls away normally. */}
        <div className="topstrip">
          <div className="container topstrip__row">
            <p className="topstrip__tag">
              <FiMapPin aria-hidden="true" />
              {site.tagline}
            </p>

            <div className="topstrip__contact">
              {site.phones[0] && (
                <a href={telHref(site.phones[0])}>
                  <FiPhone aria-hidden="true" />
                  {site.phones[0]}
                </a>
              )}

              <span className="topstrip__divider" aria-hidden="true" />

              {site.email && (
                <a className="topstrip__mail" href={`mailto:${site.email}`}>
                  <FiMail aria-hidden="true" />
                  {site.email}
                </a>
              )}

              <span className="topstrip__divider topstrip__divider--social" aria-hidden="true" />

              <ul className="topstrip__social" aria-label="Social media">
                {social.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.label}>
                      <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
                        <Icon aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

      </header>

      {/* Sticky college identity row: stays visible while scrolling. */}
      <div className="navbar on-dark">
        <div className="container navbar__row">
            <div className="navbar__identity">
              <Link className="navbar__logo-link" to="/" aria-label={`${site.name}, ${site.city} - home`}>
                <img src={mediaUrl(images?.logo) || "/logo.png"} width="180" height="180" alt="" />
              </Link>

              <div className="navbar__title">
                <p className="navbar__title-name">
                  <span className="navbar__title-main">CHHOTU RAM POLYTECHNIC</span>
                  <span className="navbar__title-sub">ROHTAK, HARYANA</span>
                </p>
                <div className="navbar__chips">
                  <span className="navbar__chip navbar__chip--orange">
                    <span className="navbar__chip-icon"><FiCheck aria-hidden="true" /></span>
                    Approved by AICTE, New Delhi
                  </span>
                  <span className="navbar__chip navbar__chip--blue">
                    <span className="navbar__chip-icon"><FiCheck aria-hidden="true" /></span>
                    Affiliated to HSBTE, Panchkula
                  </span>
                </div>
              </div>
            </div>

            <PayFee />

            <EstablishedBadge />

            <button
              ref={burgerRef}
              type="button"
              className="navbar__burger"
              aria-label="Open menu"
              aria-expanded={drawer}
              aria-controls="mobile-menu"
              onClick={() => setDrawer(true)}
            >
              <FiMenu />
            </button>
        </div>
      </div>

      {/* Main navigation scrolls normally; it is not sticky. */}
      <div className="menubar on-dark">
        <div className="container menubar__row">
          <nav className="menu" aria-label="Main">
            <ul>
              {activeNavItems.filter((item) => !item.hidden).map((item) => {
                if (item.to) {
                  return (
                    <li key={item.label}>
                      <MenuLink item={item} onNavigate={closeAll} />
                    </li>
                  );
                }

                const mega = Boolean(item.columns);
                const isOpen = open === item.label;

                return (
                  <li
                    key={item.label}
                    className={`menu__group${mega ? " menu__group--mega" : ""}${isOpen ? " is-open" : ""}`}
                    onPointerEnter={hoverIn(item.label)}
                    onPointerLeave={hoverOut}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") {
                        setOpen(null);
                        event.currentTarget.querySelector("button").focus();
                      }
                    }}
                    onBlur={(event) => {
                      if (!event.currentTarget.contains(event.relatedTarget)) {
                        setOpen(null);
                      }
                    }}
                  >
                    <button
                      type="button"
                      className={isActive(item) ? "is-active" : ""}
                      aria-expanded={isOpen}
                      aria-controls={`panel-${item.label}`}
                      onClick={() => setOpen(isOpen ? null : item.label)}
                    >
                      {item.label}
                      <FiChevronDown aria-hidden="true" />
                    </button>

                    <div id={`panel-${item.label}`} className="menu-panel">
                      <div className={mega ? "container menu-panel__grid" : "menu-panel__list"}>
                        {groupLinks(item).map((column) => (
                          <div key={column.title ?? "links"}>
                            {column.title && <h3>{column.title}</h3>}
                            <ul>
                              {column.items.map((child) => (
                                <li key={child.label}>
                                  <MenuLink item={child} onNavigate={closeAll} />
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          {navCta && <AdmissionFormButton className="navbar__cta">{navCta.label}<FiArrowRight aria-hidden="true" /></AdmissionFormButton>}
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={drawerRef}
        className={`drawer on-dark${drawer ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!drawer}
      >
        <div className="drawer__top">
          <Brand />
          <button
            type="button"
            className="navbar__burger"
            aria-label="Close menu"
            onClick={() => {
              setDrawer(false);
              burgerRef.current?.focus();
            }}
          >
            <FiX />
          </button>
        </div>

        <nav aria-label="Mobile">
          <ul className="drawer__list">
            {activeNavItems.filter((item) => !item.hidden).map((item) => {
              if (item.to) {
                return (
                  <li key={item.label}>
                    <MenuLink item={item} onNavigate={closeAll} />
                  </li>
                );
              }

              const expanded = group === item.label;

              return (
                <li key={item.label}>
                  <button
                    type="button"
                    className={`drawer__toggle${isActive(item) ? " is-active" : ""}`}
                    aria-expanded={expanded}
                    aria-controls={`drawer-${item.label}`}
                    onClick={() => setGroup(expanded ? null : item.label)}
                  >
                    {item.label}
                    <FiChevronDown aria-hidden="true" />
                  </button>

                  <div
                    id={`drawer-${item.label}`}
                    className={`drawer__sub${expanded ? " is-open" : ""}`}
                    inert={!expanded}
                  >
                    <div>
                      {groupLinks(item).map((column) => (
                        <div key={column.title ?? "links"}>
                          {column.title && <h3>{column.title}</h3>}
                          <ul>
                            {column.items.map((child) => (
                              <li key={child.label}>
                                <MenuLink item={child} onNavigate={closeAll} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="drawer__foot">
          <PayFee className="pay-fee--drawer" onNavigate={closeAll} />

          {navCta && <AdmissionFormButton className="btn btn--cta" onClick={closeAll}>{navCta.label}<FiArrowRight aria-hidden="true" /></AdmissionFormButton>}

          <div className="drawer__contact">
            {site.phones[0] && (
              <a href={telHref(site.phones[0])}>
                <FiPhone aria-hidden="true" />
                {site.phones[0]}
              </a>
            )}
            {site.email && (
              <a href={`mailto:${site.email}`}>
                <FiMail aria-hidden="true" />
                {site.email}
              </a>
            )}
            <ul className="drawer__social" aria-label="Social media">
              {social.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label}>
                      <Icon aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
