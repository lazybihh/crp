// Events.jsx - Events (route: /events).
// Page order: hero -> title + navy "coming up" card -> featured event -> event cards -> notice -> related -> help strip.
// Own hero, own styles (Events.css, every class starts with "evt-").
//
// WHAT IS REAL AND WHAT IS MISSING
//   REAL     the three entries below and their photos. They are the only items on the live Events page.
//   MISSING  the live page gives NO date, place or description for any of them (the detail pages would not open),
//            so `date`, `place` and `text` are empty. Nothing was invented. The page says plainly that details are being added.
//
// CONNECTED TO THE DATABASE: the events come from the server (GET /api/events, edited in Admin > Events).
// The hero banner is stored separately for this page and edited in Admin > Events.
// The list below (`fallbackEvents`) is only the starting copy: it shows while the page loads or when the server is down.
// Each event is one row:
//     { id, title, kind, date, place, text, photo }
//   kind    "Event" or "Activity" (a label on the card)
//   date    optional, "YYYY-MM-DD". Dated events are sorted newest first; a future date gets an "Upcoming" badge.
//   place   optional      text   optional short description (one or two sentences)
//   photo   path of the picture in public/images/events/ - if the file is missing a clean "Photo coming soon" tile shows
// The first event in the sorted list becomes the large featured card; the others are cards of one size below it.
// If the admin deletes or hides every event, the page shows a short "no events yet" message instead of cards.
//
// FILES TO COPY from the old site (save with these new names in public/images/events/):
//   orientation-2025.jpg  <- media/Activities/660a394f-5060-4dc4-a661-a1b83dfa4bcc.jpeg
//   rangoli.jpg           <- media/Activities/WhatsApp_Image_2023-01-23_at_3.18.24_AM.jpeg
//   ncc-selection.jpg     <- media/Activities/ea4ad141-b6d7-4c34-bc51-d2d720974226_a8Ep18G.jpeg
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import {
  FiMapPin, FiChevronRight as FiCrumbArrow, FiArrowRight, FiCalendar, FiImage, FiInfo, FiPhone, FiMail, FiStar,
} from "react-icons/fi";
import "./Events.css";
import { useSite, telHref } from "../../context/SiteSettingsContext";
import { getEvents, getEventsBanner, mediaUrl } from "../../services/eventService";
import PageLoader, { usePageReady } from "../../components/PageLoader";

const hero = { image: "/images/campus-3.jpg" }; // wide photo; if it is missing a patterned navy banner shows instead

const intro = {
  eyebrow: "What's happening",
  title: "Events",
  lead: "Programmes, competitions and activities at the institute.",
};

// Starting copy (same as the database seed in backend/models/Event.js). Shown until the server answers, and if it never does.
const fallbackEvents = [
  { id: 1, title: "Orientation Program 2025", kind: "Event", date: "", place: "", text: "", photo: "/images/orientation-2025.jpg" },
  { id: 2, title: "Rangoli Competition", kind: "Activity", date: "", place: "", text: "", photo: "/images/rangoli.jpg" },
  { id: 3, title: "एनसीसी प्रथम वर्ष के लिए चयन प्रक्रिया", kind: "Activity", date: "", place: "", text: "", photo: "/images/ncc-selection.jpg" },
];

const related = [
  { label: "Notices", text: "Announcements and circulars.", to: "/notices" },
  { label: "Photos", text: "Pictures from the institute.", to: "/media/photos" },
  { label: "Extracurricular", text: "Achievements beyond the classroom.", to: "/about/extracurricular" },
];

// ---- helpers (no need to edit) ----
const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
const isUpcoming = (date) => Boolean(date) && new Date(`${date}T23:59:59`) >= new Date();

// dated events newest first, the rest keep their list position (the server already sends them in this order)
const sortEvents = (list) =>
  list
    .map((item, index) => ({ item, index }))
    .sort((a, b) => (b.item.date || "").localeCompare(a.item.date || "") || a.index - b.index)
    .map((entry) => entry.item);

// One photo. If the file is missing, a clean placeholder tile shows instead.
function Photo({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="evt-photo evt-photo--empty">
        <FiImage aria-hidden="true" />
        <span>Photo coming soon</span>
      </div>
    );
  }
  return (
    <div className="evt-photo">
      <img src={mediaUrl(src)} alt={alt} loading="lazy" onError={() => setFailed(true)} />
    </div>
  );
}

// Date, place and short text of one event (shown only when filled in)
function Facts({ event }) {
  return (
    <ul className="evt-facts">
      {event.date && (
        <li>
          <FiCalendar aria-hidden="true" />
          {formatDate(event.date)}
        </li>
      )}
      {event.place && (
        <li>
          <FiMapPin aria-hidden="true" />
          {event.place}
        </li>
      )}
    </ul>
  );
}

export default function Events() {
  const { contact } = useSite();
  const { ready, data: results } = usePageReady(() => Promise.allSettled([getEventsBanner(), getEvents()]));
  const bannerResult = results?.[0];
  const eventsResult = results?.[1];
  const heroImage = bannerResult?.status === "fulfilled"
    ? mediaUrl(bannerResult.value.page?.bannerImage && bannerResult.value.page.bannerImage !== "/images/pages-banner.png" ? bannerResult.value.page.bannerImage : hero.image) || hero.image
    : hero.image;
  const eventsData = eventsResult?.status === "fulfilled" ? eventsResult.value : null;
  const events = Array.isArray(eventsData?.events) ? eventsData.events : fallbackEvents;

  const sorted = useMemo(() => sortEvents(events), [events]);
  const featured = sorted[0];
  const others = sorted.slice(1);
  const upcoming = sorted.filter((item) => isUpcoming(item.date)).length;
  const phones = (contact?.phones || []).filter(Boolean);
  const email = contact?.email || "";

  if (!ready) return <main id="main" className="evt-page"><PageLoader /></main>;

  return (
    <main id="main" className="evt-page">
      <section className="evt-hero" aria-label="Events" style={{ "--img": `url("${heroImage || hero.image}")` }}>
        <div className="evt-hero__photo" />
        <div className="evt-hero__tags">
          <span className="evt-hero__tag evt-hero__tag--left">
            <span className="evt-hero__tag-icon"><FaGraduationCap aria-hidden="true" /></span>
            Government Polytechnic
          </span>
          <span className="evt-hero__tag evt-hero__tag--right">
            <span className="evt-hero__tag-icon"><FiMapPin aria-hidden="true" /></span>
            Rohtak (Haryana)
          </span>
        </div>
        <nav className="evt-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiCrumbArrow aria-hidden="true" />
          <span aria-current="page">Events</span>
        </nav>
      </section>

      <div className="container evt-wrap">
        {/* ---- title + navy card ---- */}
        <div className="evt-top">
          <header className="evt-intro">
            <span className="evt-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <aside className="evt-count" aria-label="Events in numbers">
            <span className="evt-count__icon"><FiCalendar aria-hidden="true" /></span>
            <p className="evt-count__number">{sorted.length}</p>
            <p className="evt-count__label">events and activities</p>
            <p className="evt-count__note">
              {upcoming > 0 ? `${upcoming} coming up` : "New events will be added here"}
            </p>
          </aside>
        </div>

        {/* ---- nothing to show (the admin removed or hid every event) ---- */}
        {sorted.length === 0 && (
          <aside className="evt-notice" aria-label="No events">
            <span className="evt-notice__icon"><FiInfo aria-hidden="true" /></span>
            <div>
              <h2>No events yet</h2>
              <p>New events and activities will be listed here. For now, ask the institute office.</p>
            </div>
          </aside>
        )}

        {/* ---- featured event ---- */}
        {featured && (
          <section className="evt-featured" aria-labelledby="evt-featured-title">
            <Photo src={featured.photo} alt={featured.title} />
            <div className="evt-featured__body">
              <span className="evt-eyebrow evt-eyebrow--line">
                {isUpcoming(featured.date) ? "Upcoming" : "Featured"} · {featured.kind}
              </span>
              <h2 id="evt-featured-title">{featured.title}</h2>
              <Facts event={featured} />
              {featured.text && <p>{featured.text}</p>}
            </div>
          </section>
        )}

        {/* ---- the other events (same size) ---- */}
        {others.length > 0 && (
          <section className="evt-block" aria-labelledby="evt-more-title">
            <header className="evt-head">
              <span className="evt-eyebrow evt-eyebrow--line">More to see</span>
              <h2 id="evt-more-title">Events and <span>activities</span></h2>
            </header>
            <ul className="evt-grid">
              {others.map((event, index) => (
                <li key={event._id || event.id || index} className="evt-card">
                  <Photo src={event.photo} alt={event.title} />
                  <div className="evt-card__body">
                    <span className="evt-card__kind">
                      <FiStar aria-hidden="true" />
                      {isUpcoming(event.date) ? "Upcoming" : event.kind}
                    </span>
                    <h3 title={event.title}>{event.title}</h3>
                    <Facts event={event} />
                    {event.text && <p>{event.text}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ---- notice ---- */}
        {sorted.some((item) => !item.date) && sorted.length > 0 && (
        <aside className="evt-notice" aria-label="Details coming">
          <span className="evt-notice__icon"><FiInfo aria-hidden="true" /></span>
          <div>
            <h2>Dates and details are being added</h2>
            <p>The date, place and description of each event will appear on its card soon. For now, ask the institute office.</p>
          </div>
        </aside>
        )}

        {/* ---- related ---- */}
        <section className="evt-related" aria-label="More from the institute">
          {related.map((item) => (
            <Link key={item.to} className="evt-related__item" to={item.to}>
              <span>
                <strong>{item.label}</strong>
                {item.text}
              </span>
              <FiArrowRight aria-hidden="true" />
            </Link>
          ))}
        </section>

        {/* ---- help strip ---- */}
        <section className="evt-help" aria-labelledby="evt-help-title">
          <div>
            <h2 id="evt-help-title">Questions about an event?</h2>
            <p>Call or write to the institute office.</p>
          </div>
          <div className="evt-help__actions">
            {phones.length > 0 && (
              <a className="evt-btn evt-btn--primary" href={telHref(phones[0])}>
                <FiPhone aria-hidden="true" />
                {phones.join(" / ")}
              </a>
            )}
            {email && (
              <a className="evt-btn evt-btn--ghost" href={`mailto:${email}`}>
                <FiMail aria-hidden="true" />
                {email}
              </a>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}