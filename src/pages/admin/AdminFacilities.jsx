// AdminFacilities.jsx - the Facilities page editor (Admin > About us > Facilities).
// What the admin can do: edit every text, and edit / replace / remove the photos of each facility, and delete a facility.
// What the admin cannot do: add a new facility, or add more than the 3 photos of a facility (the collage has a fixed design).
// Not editable here: icons, the two banner tags and the breadcrumb (they stay in Facilities.jsx).
// Looks like the Home editor: it reuses AdminHome.css ("ahm-" classes); the few extra styles are in AdminFacilities.css ("afc-").
import { useEffect, useRef, useState } from "react";
import { FiChevronRight, FiPlus, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import { getFacilities, saveFacilitiesPage, saveFacilitiesBanner, saveFacility, deleteFacility, uploadFacilityImage, mediaUrl } from "../../services/facilityService";
import "./AdminHome.css";
import "./AdminFacilities.css";

const SLOTS = ["Large photo (left)", "Top-right photo", "Bottom-right photo"];
const DEFAULT_BANNER = "/images/campus-2.jpg";
const MAX_BANNER_SIZE = 5 * 1024 * 1024;

/* ---------- small building blocks ---------- */

function Field({ label, value, onChange, area }) {
  return (
    <label className="ahm-field">
      <span>{label}</span>
      {area ? <textarea rows="3" value={value} onChange={(event) => onChange(event.target.value)} /> : <input type="text" value={value} onChange={(event) => onChange(event.target.value)} />}
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

// a list of single texts: edit, remove, and add (up to a limit)
function TextList({ label, items, onChange, max, area }) {
  const set = (index, value) => onChange(items.map((item, i) => (i === index ? value : item)));
  return (
    <div className="ahm-field">
      <span>{label}</span>
      <div className="ahm-rows">
        {items.map((item, index) => (
          <div className="afc-line" key={index}>
            {area ? <textarea rows="3" value={item} onChange={(event) => set(index, event.target.value)} aria-label={`${label} ${index + 1}`} /> : <input type="text" value={item} onChange={(event) => set(index, event.target.value)} aria-label={`${label} ${index + 1}`} />}
            <button type="button" className="afc-icon" onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}><FiTrash2 /></button>
          </div>
        ))}
        {items.length < max && (
          <button type="button" className="ahm-btn ahm-btn--add" onClick={() => onChange([...items, ""])}><FiPlus aria-hidden="true" /> Add</button>
        )}
      </div>
    </div>
  );
}

// a list of two-part rows (number + label, or label + value): edit and remove; `fixed` = no add / remove
function PairList({ label, items, onChange, first, second, firstLabel, secondLabel, max, fixed }) {
  const set = (index, key, value) => onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  return (
    <div className="ahm-field">
      <span>{label}</span>
      <div className="ahm-rows">
        {items.map((item, index) => (
          <div className="afc-line" key={index}>
            <div className="ahm-two">
              <input type="text" value={item[first]} onChange={(event) => set(index, first, event.target.value)} aria-label={`${firstLabel} ${index + 1}`} placeholder={firstLabel} />
              <input type="text" value={item[second]} onChange={(event) => set(index, second, event.target.value)} aria-label={`${secondLabel} ${index + 1}`} placeholder={secondLabel} />
            </div>
            {!fixed && <button type="button" className="afc-icon" onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label={`Remove ${index + 1}`}><FiTrash2 /></button>}
          </div>
        ))}
        {!fixed && items.length < max && (
          <button type="button" className="ahm-btn ahm-btn--add" onClick={() => onChange([...items, { [first]: "", [second]: "" }])}><FiPlus aria-hidden="true" /> Add</button>
        )}
      </div>
    </div>
  );
}

// one of the 3 photo slots: replace it or remove it (a removed slot shows "Photo coming soon" on the page)
function PhotoSlot({ label, value, onUpload, onRemove, say }) {
  const upload = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    try {
      onUpload(await uploadFacilityImage(file));
    } catch (error) {
      say(error.message, true);
    }
  };
  return (
    <div className="afc-slot">
      <b>{label}</b>
      <div className="ahm-image__box">
        {value ? <img src={mediaUrl(value)} alt="" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} onLoad={(event) => { event.currentTarget.style.visibility = "visible"; }} /> : <small>No photo</small>}
      </div>
      <div className="afc-slot__buttons">
        <label className="ahm-btn">
          <FiUpload aria-hidden="true" /> {value ? "Change" : "Upload"}
          <input type="file" accept="image/*" onChange={upload} hidden />
        </label>
        {value && <button type="button" className="ahm-btn" onClick={onRemove}><FiX aria-hidden="true" /> Remove</button>}
      </div>
    </div>
  );
}

// the bar at the bottom of a card: message + save
function Actions({ changed, busy, message, onSave, onDiscard, children }) {
  return (
    <div className="afc-actions">
      <span className={message.error ? "is-error" : ""} role="status">{message.text || (changed ? "You have unsaved changes" : "No unsaved changes")}</span>
      <div className="afc-actions__buttons">
        {children}
        <button type="button" className="ahm-btn" onClick={onDiscard} disabled={!changed || busy}>Discard</button>
        <button type="button" className="ahm-btn ahm-btn--save" onClick={onSave} disabled={!changed || busy}>{busy ? "Saving..." : "Save changes"}</button>
      </div>
    </div>
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

/* ---------- the page text (title block, numbers, headings, labels) ---------- */

const normalizePage = (page) => ({
  intro: { eyebrow: page.intro?.eyebrow ?? "", title: page.intro?.title ?? "", lead: page.intro?.lead ?? "" },
  stats: (page.stats || []).map((item) => ({ value: item.value ?? "", label: item.label ?? "" })),
  explore: { eyebrow: page.explore?.eyebrow ?? "", titleStart: page.explore?.titleStart ?? "", titleHighlight: page.explore?.titleHighlight ?? "" },
  panel: { aboutHeading: page.panel?.aboutHeading ?? "", factsHeading: page.panel?.factsHeading ?? "", photoPlaceholder: page.panel?.photoPlaceholder ?? "" },
  closingStats: (page.closingStats || []).map((item) => ({ value: item.value ?? "", label: item.label ?? "" })),
});

function PageText({ initial, open, onToggle }) {
  const [draft, setDraft] = useState(() => normalizePage(initial));
  const [saved, setSaved] = useState(() => JSON.stringify(normalizePage(initial)));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });
  const changed = JSON.stringify(draft) !== saved;
  useLeaveWarning(changed);

  const part = (group, key) => (value) => { setDraft((now) => ({ ...now, [group]: { ...now[group], [key]: value } })); setMessage({ text: "", error: false }); };
  const list = (key) => (value) => { setDraft((now) => ({ ...now, [key]: value })); setMessage({ text: "", error: false }); };
  const say = (text, error = false) => setMessage({ text, error });

  const save = async () => {
    setBusy(true);
    try {
      const { page } = await saveFacilitiesPage(draft);
      const fresh = normalizePage(page);
      setDraft(fresh);
      setSaved(JSON.stringify(fresh));
      say("Saved. The Facilities page now shows these texts.");
    } catch (error) {
      say(error.message, true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Page text" note="title, numbers, headings" open={open} onToggle={onToggle}>
      <p className="ahm-hint">The text at the top of the page, the number cards, the heading above the facility tabs and the small labels inside a facility.</p>
      <Field label="Small heading above the title" value={draft.intro.eyebrow} onChange={part("intro", "eyebrow")} />
      <Field label="Title" value={draft.intro.title} onChange={part("intro", "title")} />
      <Field label="Introduction" value={draft.intro.lead} onChange={part("intro", "lead")} area />
      <PairList label="Number cards at the top" items={draft.stats} onChange={list("stats")} first="value" second="label" firstLabel="Number" secondLabel="Label" fixed />
      <p className="ahm-hint">Leave the first number empty to show the live count of facilities automatically.</p>
      <Field label="Small heading above the facility tabs" value={draft.explore.eyebrow} onChange={part("explore", "eyebrow")} />
      <div className="ahm-two">
        <Field label="Heading" value={draft.explore.titleStart} onChange={part("explore", "titleStart")} />
        <Field label="Last word (shown in orange)" value={draft.explore.titleHighlight} onChange={part("explore", "titleHighlight")} />
      </div>
      <div className="ahm-two">
        <Field label="Heading of the facility description" value={draft.panel.aboutHeading} onChange={part("panel", "aboutHeading")} />
        <Field label="Heading of the facts box" value={draft.panel.factsHeading} onChange={part("panel", "factsHeading")} />
      </div>
      <Field label="Text on an empty photo tile" value={draft.panel.photoPlaceholder} onChange={part("panel", "photoPlaceholder")} />
      <PairList label="Numbers at the bottom of the page" items={draft.closingStats} onChange={list("closingStats")} first="value" second="label" firstLabel="Number" secondLabel="Label" fixed />
      <Actions changed={changed} busy={busy} message={message} onSave={save} onDiscard={() => { setDraft(JSON.parse(saved)); say(""); }} />
    </Card>
  );
}

/* ---------- one facility ---------- */

const normalizeFacility = (row) => ({
  _id: row._id,
  slug: row.slug,
  label: row.label ?? "",
  headline: row.headline ?? "",
  text: row.text ?? "",
  points: [...(row.points || [])],
  more: [...(row.more || [])],
  facts: (row.facts || []).map((fact) => ({ label: fact.label ?? "", value: fact.value ?? "" })),
  photos: [0, 1, 2].map((index) => row.photos?.[index] || ""),
});

function FacilityCard({ row, open, onToggle, onDeleted }) {
  const [draft, setDraft] = useState(() => normalizeFacility(row));
  const [saved, setSaved] = useState(() => JSON.stringify(normalizeFacility(row)));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });
  const changed = JSON.stringify(draft) !== saved;
  useLeaveWarning(changed);

  const say = (text, error = false) => setMessage({ text, error });
  const edit = (patch) => { setDraft((now) => ({ ...now, ...patch })); say(""); };
  const setPhoto = (index, value) => edit({ photos: draft.photos.map((photo, i) => (i === index ? value : photo)) });

  const save = async () => {
    setBusy(true);
    try {
      const { facility } = await saveFacility(draft._id, draft);
      const fresh = normalizeFacility(facility);
      setDraft(fresh);
      setSaved(JSON.stringify(fresh));
      say("Saved. The Facilities page now shows these changes.");
    } catch (error) {
      say(error.message, true);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${draft.label}" completely?\n\nIt will disappear from the Facilities page, and from the Home page if it is shown there. This cannot be undone.`)) return;
    setBusy(true);
    try {
      await deleteFacility(draft._id);
      onDeleted(draft._id);
    } catch (error) {
      say(error.message, true);
      setBusy(false);
    }
  };

  return (
    <Card title={draft.label || "(no name)"} note={draft.headline} open={open} onToggle={onToggle}>
      <div className="ahm-two">
        <Field label="Tab name" value={draft.label} onChange={(value) => edit({ label: value })} />
        <Field label="Title in the panel" value={draft.headline} onChange={(value) => edit({ headline: value })} />
      </div>
      <Field label="Main description" value={draft.text} onChange={(value) => edit({ text: value })} area />
      <TextList label="Highlight" items={draft.points} onChange={(value) => edit({ points: value })} max={8} />

      <div className="ahm-field">
        <span>Photos</span>
        <p className="ahm-hint">The page shows these 3 photos as one collage with a fixed design, so you can change or remove a photo but not add more. A removed photo shows a "Photo coming soon" tile.</p>
        <div className="afc-slots">
          {SLOTS.map((slot, index) => (
            <PhotoSlot key={slot} label={slot} value={draft.photos[index]} onUpload={(url) => setPhoto(index, url)} onRemove={() => setPhoto(index, "")} say={say} />
          ))}
        </div>
      </div>

      <TextList label="About this facility (paragraph)" items={draft.more} onChange={(value) => edit({ more: value })} max={6} area />
      <PairList label="At a glance" items={draft.facts} onChange={(value) => edit({ facts: value })} first="label" second="value" firstLabel="Label" secondLabel="Value" max={6} />

      <Actions changed={changed} busy={busy} message={message} onSave={save} onDiscard={() => { setDraft(JSON.parse(saved)); say(""); }}>
        <button type="button" className="ahm-btn afc-danger" onClick={remove} disabled={busy}><FiTrash2 aria-hidden="true" /> Delete facility</button>
      </Actions>
    </Card>
  );
}

/* ---------- the page ---------- */

export default function AdminFacilities() {
  const bannerInput = useRef(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [openCard, setOpenCard] = useState("");
  const [bannerImage, setBannerImage] = useState(DEFAULT_BANNER);
  const [savedBanner, setSavedBanner] = useState(DEFAULT_BANNER);
  const [bannerBusy, setBannerBusy] = useState(false);
  const [bannerMessage, setBannerMessage] = useState({ text: "", error: false });

  useEffect(() => {
    getFacilities()
      .then((result) => {
        setData(result);
        const current = result.page?.bannerImage || DEFAULT_BANNER;
        setBannerImage(current);
        setSavedBanner(current);
      })
      .catch(() => setError("Cannot reach the server. Start the backend, then reload this page."));
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
      setBannerImage(await uploadFacilityImage(file));
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
      const { page } = await saveFacilitiesBanner(bannerImage);
      const current = page?.bannerImage || DEFAULT_BANNER;
      setBannerImage(current);
      setSavedBanner(current);
      setBannerMessage({ text: "Facilities banner saved.", error: false });
    } catch (saveError) {
      setBannerMessage({ text: saveError.message, error: true });
    } finally {
      setBannerBusy(false);
    }
  };

  if (!data) {
    return (
      <AdminSidebar title="Facilities">
        <p className={error ? "ahm-loading is-error" : "ahm-loading"}>{error || "Loading..."}</p>
      </AdminSidebar>
    );
  }

  const toggle = (id) => setOpenCard((now) => (now === id ? "" : id));

  return (
    <AdminSidebar title="Facilities">
      <div className="ahm-page">
        <section className="ahm-card is-open afc-banner">
          <div className="ahm-card__body">
            <h3 className="afc-banner__title">Facilities hero banner</h3>
            <div className="ahm-image__box afc-banner__preview">
              <img src={mediaUrl(bannerImage) || DEFAULT_BANNER} alt="Facilities banner preview" />
            </div>
            <p className="ahm-hint afc-banner__hint">Best size: 1920 x 1080 px (16:9), JPG or WebP, under 5 MB.</p>
            <p className={bannerMessage.error ? "afc-banner__message is-error" : "afc-banner__message"} role="status">{bannerMessage.text || (bannerImage !== savedBanner ? "You have unsaved changes." : "")}</p>
            <div className="afc-banner__actions">
              <input ref={bannerInput} type="file" accept="image/*" onChange={uploadBanner} disabled={bannerBusy} aria-label="Choose Facilities banner image" tabIndex={-1} className="afc-banner__file" />
              <button type="button" className="ahm-btn afc-banner__button" onClick={() => bannerInput.current?.click()} disabled={bannerBusy}>Change banner</button>
              <button type="button" className="ahm-btn afc-banner__button" onClick={() => { setBannerImage(DEFAULT_BANNER); setBannerMessage({ text: "", error: false }); }} disabled={bannerBusy || bannerImage === DEFAULT_BANNER}>Use default banner</button>
              <button type="button" className="ahm-btn ahm-btn--save afc-banner__button" onClick={saveBanner} disabled={bannerBusy || bannerImage === savedBanner}>{bannerBusy ? "Working..." : "Save banner"}</button>
            </div>
          </div>
        </section>
        <header className="ahm-top">
          <h2>Facilities page</h2>
          <a href="/about/facilities" target="_blank" rel="noopener noreferrer">See the live page</a>
        </header>

        <PageText initial={data.page} open={openCard === "page"} onToggle={() => toggle("page")} />

        <h3 className="afc-heading">Facilities ({data.facilities.length})</h3>
        <p className="ahm-hint afc-intro">Edit any text or photo, or delete a facility. New facilities cannot be added here.</p>
        {data.facilities.length === 0 && <p className="ahm-loading">No facilities left.</p>}
        {data.facilities.map((row) => (
          <FacilityCard
            key={row._id}
            row={row}
            open={openCard === row._id}
            onToggle={() => toggle(row._id)}
            onDeleted={(id) => setData((now) => ({ ...now, facilities: now.facilities.filter((item) => item._id !== id) }))}
          />
        ))}
      </div>
    </AdminSidebar>
  );
}
