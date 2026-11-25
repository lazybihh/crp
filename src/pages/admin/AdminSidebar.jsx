import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiHome, FiInfo, FiUsers, FiBookOpen, FiLayers, FiBriefcase, FiTool, FiImage, FiBell, FiCalendar, FiPhone, FiSettings, FiGrid, FiMessageSquare, FiChevronDown, FiMenu, FiX, FiExternalLink, FiUser } from "react-icons/fi";
import { useSite } from "../../context/SiteSettingsContext";
import { mediaUrl } from "../../services/settingsService";
import { getEnquiryStats } from "../../services/enquiryService";
import "./AdminSidebar.css";

// Single source of truth for the admin navigation and editable-page count.
export const ADMIN_MENU = [
  {
    "label": "Home",
    "icon": "FiHome",
    "items": [
      {
        "label": "Home",
        "path": "home"
      }
    ]
  },
  {
    "label": "About us",
    "icon": "FiInfo",
    "items": [
      {
        "label": "History",
        "path": "about/history"
      },
      {
        "label": "Principal's desk",
        "path": "about/principal-message"
      },
      {
        "label": "Rank & accreditation",
        "path": "about/rank-accreditation"
      },
      {
        "label": "Alumni",
        "path": "about/alumni"
      },
      {
        "label": "Courses offered",
        "path": "about/courses"
      },
      {
        "label": "Results",
        "path": "about/results"
      },
      {
        "label": "Placements",
        "path": "about/placements"
      },
      {
        "label": "Entrepreneurship",
        "path": "about/entrepreneurship"
      },
      {
        "label": "Annual report",
        "path": "about/annual-report"
      },
      {
        "label": "Luminaries",
        "path": "about/luminaries"
      },
      {
        "label": "Projects",
        "path": "about/projects"
      },
      {
        "label": "Extracurricular achievements",
        "path": "about/extracurricular"
      },
      {
        "label": "Unnat Bharat Abhiyan",
        "path": "about/unnat-bharat-abhiyan"
      }
    ]
  },
  {
    "label": "Students",
    "icon": "FiUsers",
    "items": [
      {
        "label": "Admissions",
        "path": "students/admissions"
      },
      {
        "label": "Academic calendar",
        "path": "students/academic-calendar"
      },
      {
        "label": "Online learning portals",
        "path": "students/online-learning"
      },
      {
        "label": "Student helpline",
        "path": "students/helpline"
      },
      {
        "label": "Grievance redressal",
        "path": "students/grievance"
      },
      {
        "label": "Student e-services",
        "path": "students/e-services"
      },
      {
        "label": "Skill courses",
        "path": "students/skill-courses"
      },
      {
        "label": "Freelancing",
        "path": "students/freelancing"
      },
      {
        "label": "Incubator",
        "path": "students/incubator"
      },
      {
        "label": "Apprenticeship",
        "path": "students/apprenticeship"
      },
      {
        "label": "NCC & NSS",
        "path": "students/ncc-nss"
      }
    ]
  },
  {
    "label": "Study resources",
    "icon": "FiBookOpen",
    "items": [
      {
        "label": "Study resources",
        "path": "students/study-resources"
      }
    ]
  },
  {
    "label": "Departments",
    "icon": "FiLayers",
    "items": [{ "label": "Departments", "path": "departments" }]
  },
  {
    "label": "Faculty",
    "icon": "FiBriefcase",
    "items": [
      {
        "label": "Training policy",
        "path": "faculty/training-policy"
      },
      {
        "label": "Anti ragging",
        "path": "faculty/anti-ragging"
      },
      {
        "label": "Anti sexual harassment",
        "path": "faculty/anti-sexual-harassment"
      },
      {
        "label": "Service rules",
        "path": "faculty/service-rules"
      },
      {
        "label": "IQAC",
        "path": "faculty/iqac"
      },
      {
        "label": "Faculty e-services",
        "path": "faculty/e-services"
      }
    ]
  },
  {
    "label": "Facilities",
    "icon": "FiTool",
    "items": [
      {
        "label": "Facilities",
        "path": "about/facilities"
      }
    ]
  },
  {
    "label": "Media",
    "icon": "FiImage",
    "items": [
      {
        "label": "Photos",
        "path": "media/photos"
      },
      {
        "label": "Videos",
        "path": "media/videos"
      },
      {
        "label": "Social links",
        "path": "media/social"
      }
    ]
  },
  {
    "label": "Notices",
    "icon": "FiBell",
    "items": [
      {
        "label": "Notices",
        "path": "notices"
      }
    ]
  },
  {
    "label": "Events",
    "icon": "FiCalendar",
    "items": [
      {
        "label": "Events",
        "path": "events"
      }
    ]
  },
  {
    "label": "Contact",
    "icon": "FiPhone",
    "items": [
      {
        "label": "Contact us",
        "path": "about/contact"
      }
    ]
  },
  {
    "label": "Site settings",
    "icon": "FiSettings",
    "items": [
      {
        "label": "Site settings",
        "path": "site-settings"
      }
    ]
  }
];
const ICONS = { FiHome, FiInfo, FiUsers, FiBookOpen, FiLayers, FiBriefcase, FiTool, FiImage, FiBell, FiCalendar, FiPhone, FiSettings };

// Every admin page draws its own sidebar, so the sidebar is rebuilt on each click. These two remember where the menu was
// (scroll position and open group) so it does not jump back to the top.
let savedScroll = 0;
let savedGroup = null;

export default function AdminSidebar({ title, children }) {
  const { images } = useSite();
  const { pathname } = useLocation();
  const activeGroup = ADMIN_MENU.find((group) => group.items.some((item) => pathname === `/admin/${item.path}`));
  const [open, setOpen] = useState(activeGroup?.label ?? savedGroup);
  const [drawer, setDrawer] = useState(false);
  const navRef = useRef(null);
  const [newEnquiries, setNewEnquiries] = useState(0);

  useEffect(() => {
    const load = () => getEnquiryStats().then((stats) => setNewEnquiries(stats.fresh)).catch(() => setNewEnquiries(0));
    load();
    window.addEventListener("enquiries-updated", load);
    return () => window.removeEventListener("enquiries-updated", load);
  }, []);

  const toggleGroup = (label) => {
    savedGroup = open === label ? null : label;
    setOpen(savedGroup);
  };

  // put the menu back where it was; if the current page is out of view, scroll just enough to show it
  useLayoutEffect(() => {
    const nav = navRef.current;
    nav.scrollTop = savedScroll;
    const current = nav.querySelector(".is-active");
    if (current && (current.offsetTop < nav.scrollTop || current.offsetTop + current.offsetHeight > nav.scrollTop + nav.clientHeight)) {
      nav.scrollTop = current.offsetTop - nav.clientHeight / 2;
    }
    savedScroll = nav.scrollTop;
  }, []);

  useEffect(() => {
    if (!drawer) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setDrawer(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [drawer]);

  const linkClass = ({ isActive }) => `asb-link${isActive ? " is-active" : ""}`;

  return (
    <div className="asb-shell">
      {drawer && <button className="asb-backdrop" type="button" aria-label="Close menu" onClick={() => setDrawer(false)} />}
      <aside id="admin-sidebar" className={`asb-side${drawer ? " is-open" : ""}`} aria-label="Admin menu">
        <div className="asb-brand">
          <img src={mediaUrl(images?.logo) || "/logo.png"} alt="" />
          <div>
            <strong>Chhotu Ram Polytechnic</strong>
            <span>Admin panel</span>
          </div>
          <button className="asb-close" type="button" aria-label="Close menu" onClick={() => setDrawer(false)}><FiX aria-hidden="true" /></button>
        </div>
        <nav ref={navRef} className="asb-nav" aria-label="Admin sections" onScroll={(event) => { savedScroll = event.currentTarget.scrollTop; }}>
          <ul className="asb-list">
            <li><NavLink to="/admin" end className={linkClass}><FiGrid aria-hidden="true" /><span>Dashboard</span></NavLink></li>
            <li><NavLink to="/admin/enquiries" className={linkClass}><FiMessageSquare aria-hidden="true" /><span>Enquiries</span>{newEnquiries > 0 && <b className="asb-badge" aria-label={`${newEnquiries} new enquiries`}>{newEnquiries}</b>}</NavLink></li>
          </ul>
          <p className="asb-label">Website content</p>
          <ul className="asb-list">
            {ADMIN_MENU.map((group) => {
              const Icon = ICONS[group.icon];
              const active = group.items.some((item) => pathname === `/admin/${item.path}`);
              const expanded = open === group.label;
              const single = group.items.length === 1;
              return (
                <li key={group.label}>
                  {single ? (
                    <NavLink to={`/admin/${group.items[0].path}`} className={linkClass}>
                      <Icon aria-hidden="true" /><span>{group.label}</span>
                    </NavLink>
                  ) : (
                    <>
                      <button type="button" className={`asb-link asb-group${active ? " has-active" : ""}`} aria-expanded={expanded} aria-controls={`asb-sub-${group.label.replace(/\s/g, "-")}`} onClick={() => toggleGroup(group.label)}>
                        <Icon aria-hidden="true" /><span>{group.label}</span><FiChevronDown className="asb-caret" aria-hidden="true" />
                      </button>
                      <ul id={`asb-sub-${group.label.replace(/\s/g, "-")}`} className="asb-sub" hidden={!expanded}>
                        {group.items.map((item) => (
                          <li key={item.path}><NavLink to={`/admin/${item.path}`} className={({ isActive }) => `asb-sublink${isActive ? " is-active" : ""}`}>{item.label}</NavLink></li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="asb-foot"><Link className="asb-foot__link" to="/" target="_blank" rel="noopener noreferrer"><FiExternalLink aria-hidden="true" />View website</Link></div>
      </aside>
      <div className="asb-body">
        <header className="asb-top">
          <button type="button" className="asb-menu-btn" aria-label="Open menu" aria-expanded={drawer} aria-controls="admin-sidebar" onClick={() => setDrawer(true)}><FiMenu aria-hidden="true" /></button>
          <h1 className="asb-title">{title}</h1>
          <div className="asb-top__right"><Link className="asb-top__site" to="/" target="_blank" rel="noopener noreferrer">View website <FiExternalLink aria-hidden="true" /></Link><span className="asb-user"><FiUser aria-hidden="true" /> Admin</span></div>
        </header>
        <main id="admin-main" className="asb-main" tabIndex={-1}>{children}</main>
      </div>
    </div>
  );
}