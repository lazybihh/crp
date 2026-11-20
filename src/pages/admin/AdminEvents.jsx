// AdminEvents.jsx - the Events page editor (Admin > Events).
// What the admin can do: add an event, edit every text, set the date, replace or remove its photo, hide it from visitors, delete it.
// What the admin cannot do: change the page's own text (title, banner tags, breadcrumb) - they stay in Events.jsx.
// The page sorts events by itself: dated events newest first, a future date gets an "Upcoming" badge, new events come first.
// Looks like the Facilities editor: it reuses AdminHome.css ("ahm-" classes); the few extra styles are in AdminEvents.css ("aev-").
import { useEffect, useRef, useState } from "react";
import { FiChevronRight, FiPlus, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import { getAllEvents, getEventsBanner, saveEventsBanner, createEvent, saveEvent, deleteEvent, uploadEventImage, mediaUrl } from "../../services/eventService";
import "./AdminHome.css";
import "./AdminEvents.css";

const KINDS = ["Event", "Activity"];
const DEFAULT_BANNER = "/images/pages-banner.png";
const MAX_BANNER_SIZE = 5 * 1024 * 1024;

/* ---------- small building blocks ---------- */

function Field({ label, value, onChange, area, type = "text", max }) {
  return (
    <label className="ahm-field">
      <span>{label}</span>
      {area
        ? <textarea rows="3" maxLength={max} value={value} onChange={(event) => onChange(event.target.value)} />
        : <input type={type} maxLength={max} value={value} onChange={(event) => onChange(event.target.value)} />}
    </label>
  );
}

// a closed card shows only its title; click to open
function Card({ title, note, open, onToggle, children }) {
  return (
    <section className={`ahm-card${open ? " is-open" : ""}`}>
      <button type="button" className="ahm-card__head" aria-expanded={open} onClick={onToggle}>
        <h3>{title}</h3>
        <span>{note} <FiChevronRight aria-hidden="true" /></span>
      </button>
      {open && <div className="ahm-card__body">{children}</div>}
    </section>
  );
}

// warn before leaving the page with unsaved changes
function useLeaveWarning(changed) {
  useEffect(() => {
    const warn = (event) => { if (changed) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [changed]);
}

/* ---------- one event ---------- */

const emptyEvent = () => ({ _id: "", title: "", kind: "Event", date: "", place: "", text: "", photo: "", published: true });

const normalize = (row) => ({
  _id: row._id || "",
  title: row.title ?? "",
  kind: KINDS.includes(row.kind) ? row.kind : "Event",
  date: row.date ?? "",
  place: row.place ?? "",
  text: row.text ?? "",
  photo: row.photo ?? "",
  published: row.published !== false,
});

const niceDate = (date) => {
  if (!date) return "No date";
  const d = new Date(`${date}T00:00:00`);
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

// `isNew` = not saved yet (no id): Save adds it, Discard removes it
function EventCard({ row, isNew, open, onToggle, onSaved, onDeleted, onCancelNew }) {
  const [draft, setDraft] = useState(() => normalize(row));
  const [saved, setSaved] = useState(() => (isNew ? "" : JSON.stringify(normalize(row))));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });
  const changed = isNew || JSON.stringify(draft) !== saved;
  useLeaveWarning(changed);

  const say = (text, error = false) => setMessage({ text, error });
  const edit = (patch) => { setDraft((now) => ({ ...now, ...patch })); say(""); };

  const upload = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    try {
      edit({ photo: await uploadEventImage(file) });
    } catch (error) {
      say(error.message, true);
    }
  };

  const save = async () => {
    setBusy(true);
    try {
      if (isNew) {
        const { event } = await createEvent(draft);
        onSaved(event);
      } else {
        const { event } = await saveEvent(draft._id, draft);
        const fresh = normalize(event);
        setDraft(fresh);
        setSaved(JSON.stringify(fresh));
        say("Saved. The Events page now shows these changes.");
        onSaved(event, true);
      }
    } catch (error) {
      say(error.message, true);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${draft.title}" completely?\n\nIt will disappear from the Events page. This cannot be undone.\n(To keep it but hide it, untick "Show on the Events page" and save.)`)) return;
    setBusy(true);
    try {
      await deleteEvent(draft._id);
      onDeleted(draft._id);
    } catch (error) {
      say(error.message, true);
      setBusy(false);
    }
  };

  const discard = () => {
    if (isNew) onCancelNew();
    else { setDraft(JSON.parse(saved)); say(""); }
  };

  const title = draft.title || (isNew ? "New event" : "(no title)");
  const note = `${isNew ? "not saved yet" : niceDate(draft.date)}${draft.published ? "" : " · hidden"}`;

  return (
    <Card title={title} note={note} open={open} onToggle={onToggle}>
      <Field label="Title" value={draft.title} onChange={(value) => edit({ title: value })} max={200} />
      <div className="ahm-two">
        <label className="ahm-field">
          <span>Kind</span>
          <select value={draft.kind} onChange={(event) => edit({ kind: event.target.value })}>
            {KINDS.map((kind) => <option key={kind} value={kind}>{kind}</option>)}
          </select>
        </label>
        <Field label="Date (optional)" type="date" value={draft.date} onChange={(value) => edit({ date: value })} />
      </div>
      <p className="ahm-hint">A future date shows an "Upcoming" badge on the page. Leave the date empty if it is not known.</p>
      <Field label="Place (optional)" value={draft.place} onChange={(value) => edit({ place: value })} max={200} />
      <Field label="Short description (optional)" value={draft.text} onChange={(value) => edit({ text: value })} area max={800} />

      <div className="ahm-field">
        <span>Photo</span>
        <div className="ahm-image">
          <div className="ahm-image__box">
            {draft.photo
              ? <img src={mediaUrl(draft.photo)} alt="" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} onLoad={(event) => { event.currentTarget.style.visibility = "visible"; }} />
              : <small>No photo</small>}
          </div>
          <div className="aev-photo__buttons">
            <label className="ahm-btn">
              <FiUpload aria-hidden="true" /> {draft.photo ? "Change" : "Upload"}
              <input type="file" accept="image/*" onChange={upload} hidden />
            </label>
            {draft.photo && <button type="button" className="ahm-btn" onClick={() => edit({ photo: "" })}><FiX aria-hidden="true" /> Remove</button>}
          </div>
        </div>
        <p className="ahm-hint">No photo? The page shows a "Photo coming soon" tile.</p>
      </div>

      <label className="aev-check">
        <input type="checkbox" checked={draft.published} onChange={(event) => edit({ published: event.target.checked })} />
        <span>Show on the Events page</span>
      </label>

      <div className="aev-actions">
        <span className={message.error ? "is-error" : ""} role="status">{message.text || (changed ? "You have unsaved changes" : "No unsaved changes")}</span>
        <div className="aev-actions__buttons">
          {!isNew && <button type="button" className="ahm-btn aev-danger" onClick={remove} disabled={busy}><FiTrash2 aria-hidden="true" /> Delete event</button>}
          <button type="button" className="ahm-btn" onClick={discard} disabled={busy || (!isNew && !changed)}>{isNew ? "Cancel" : "Discard"}</button>
          <button type="button" className="ahm-btn ahm-btn--save" onClick={save} disabled={!changed || busy}>{busy ? "Saving..." : isNew ? "Add event" : "Save changes"}</button>
        </div>
      </div>
    </Card>
  );
}

/* ---------- the page ---------- */

export default function AdminEvents() {
  const bannerInput = useRef(null);
  const [events, setEvents] = useState(null);
  const [error, setError] = useState("");
  const [openCard, setOpenCard] = useState("");
  const [adding, setAdding] = useState(false); // a new, unsaved event card at the top
  const [bannerImage, setBannerImage] = useState(DEFAULT_BANNER);
  const [savedBanner, setSavedBanner] = useState(DEFAULT_BANNER);
  const [bannerBusy, setBannerBusy] = useState(false);
  const [bannerMessage, setBannerMessage] = useState({ text: "", error: false });

  useEffect(() => {
    getAllEvents()
      .then((data) => setEvents(data.events || []))
      .catch(() => setError("Cannot reach the server. Start the backend, then reload this page."));
  }, []);

  useEffect(() => {
    let active = true;
    getEventsBanner()
      .then(({ page }) => {
        if (!active) return;
        const current = page?.bannerImage || DEFAULT_BANNER;
        setBannerImage(current);
        setSavedBanner(current);
      })
      .catch((loadError) => {
        if (active) setBannerMessage({ text: loadError.message, error: true });
      });
    return () => { active = false; };
  }, []);

  const uploadBanner = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setBannerMessage({ text: "Choose an image file.", error: true });
      return;
    }
    if (file.size > MAX_BANNER_SIZE) {
      setBannerMessage({ text: "The image must be under 5 MB.", error: true });
      return;
    }
    setBannerBusy(true);
    setBannerMessage({ text: "", error: false });
    try {
      setBannerImage(await uploadEventImage(file));
    } catch (uploadError) {
      setBannerMessage({ text: uploadError.message, error: true });
    } finally {
      setBannerBusy(false);
    }
  };

  const saveBanner = async () => {
    setBannerBusy(true);
    setBannerMessage({ text: "", error: false });
    try {
      const { page } = await saveEventsBanner(bannerImage);
      const current = page?.bannerImage || DEFAULT_BANNER;
      setBannerImage(current);
      setSavedBanner(current);
      setBannerMessage({ text: "Events banner saved.", error: false });
    } catch (saveError) {
      setBannerMessage({ text: saveError.message, error: true });
    } finally {
      setBannerBusy(false);
    }
  };

  if (!events) {
    return (
      <AdminSidebar title="Events">
        <p className={error ? "ahm-loading is-error" : "ahm-loading"}>{error || "Loading..."}</p>
      </AdminSidebar>
    );
  }

  const toggle = (id) => setOpenCard((now) => (now === id ? "" : id));
  const startAdding = () => { setAdding(true); setOpenCard("new"); };

  // after "Add event": the new row goes to the top and its card opens; after an edit only the row is replaced
  const saved = (event, edited) => {
    if (edited) {
      setEvents((now) => now.map((item) => (item._id === event._id ? event : item)));
      return;
    }
    setAdding(false);
    setEvents((now) => [event, ...now]);
    setOpenCard(event._id);
  };

  return (
    <AdminSidebar title="Events">
      <div className="ahm-page">
        <section className="ahm-card is-open aev-banner">
          <div className="ahm-card__body">
            <h3 className="aev-banner__title">Events hero banner</h3>
            <div className="ahm-image__box aev-banner__preview">
              <img src={mediaUrl(bannerImage) || DEFAULT_BANNER} alt="Events banner preview" />
            </div>
            <p className="ahm-hint aev-banner__hint">Best size: 1920 x 1080 px (16:9), JPG or WebP, under 5 MB.</p>
            <p className={bannerMessage.error ? "aev-banner__message is-error" : "aev-banner__message"} role="status">{bannerMessage.text || (bannerImage !== savedBanner ? "You have unsaved changes." : "")}</p>
            <div className="aev-banner__actions">
              <input ref={bannerInput} type="file" accept="image/*" onChange={uploadBanner} disabled={bannerBusy} aria-label="Choose Events banner image" tabIndex={-1} className="aev-banner__file" />
              <button type="button" className="ahm-btn aev-banner__button" onClick={() => bannerInput.current?.click()} disabled={bannerBusy}>Change banner</button>
              <button type="button" className="ahm-btn aev-banner__button" onClick={() => { setBannerImage(DEFAULT_BANNER); setBannerMessage({ text: "", error: false }); }} disabled={bannerBusy || bannerImage === DEFAULT_BANNER}>Use default banner</button>
              <button type="button" className="ahm-btn ahm-btn--save aev-banner__button" onClick={saveBanner} disabled={bannerBusy || bannerImage === savedBanner}>{bannerBusy ? "Working..." : "Save banner"}</button>
            </div>
          </div>
        </section>
        <header className="ahm-top">
          <h2>Events page</h2>
          <a href="/events" target="_blank" rel="noopener noreferrer">See the live page</a>
        </header>

        <div className="aev-bar">
          <h3 className="aev-heading">Events ({events.length})</h3>
          <button type="button" className="ahm-btn ahm-btn--add" onClick={startAdding} disabled={adding}><FiPlus aria-hidden="true" /> Add event</button>
        </div>
        <p className="ahm-hint aev-intro">The page sorts events by itself: dated events newest first, then the others. The first one becomes the large card.</p>

        {adding && (
          <EventCard key="new" row={emptyEvent()} isNew open={openCard === "new"} onToggle={() => toggle("new")} onSaved={saved} onCancelNew={() => { setAdding(false); setOpenCard(""); }} />
        )}
        {events.length === 0 && !adding && <p className="ahm-loading">No events yet. Use "Add event".</p>}
        {events.map((row) => (
          <EventCard
            key={row._id}
            row={row}
            open={openCard === row._id}
            onToggle={() => toggle(row._id)}
            onSaved={saved}
            onDeleted={(id) => setEvents((now) => now.filter((item) => item._id !== id))}
          />
        ))}
      </div>
    </AdminSidebar>
  );
}
