// AdminDepartments.jsx - ONE page that edits every department (Admin > Departments).
// Pick a department at the top, then open a section: banner & title, About pictures & numbers, About sections, Staff, Highlights.
// Not editable here: icons and the page design. Fixed layouts (3 About pictures, 3 number tiles, 4 highlights) can be edited but not added to.
// Looks like the Home editor: it reuses AdminHome.css ("ahm-" classes); the few extra styles are in AdminDepartments.css ("adp-").
import { useEffect, useState } from "react";
import { FiArrowDown, FiArrowUp, FiChevronRight, FiPlus, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import { getDepartments, saveDepartment, resetDepartment, uploadDepartmentImage, mediaUrl } from "../../services/departmentService";
import "./AdminHome.css";
import "./AdminDepartments.css";

const COLLAGE = ["Large picture", "Top-right picture", "Bottom-right picture"];
const VIEWS = [
  { value: "text", label: "Paragraphs" },
  { value: "chips", label: "Chips (short items)" },
  { value: "list", label: "Tick list" },
];
const emptySection = () => ({ id: `section-${Date.now()}`, title: "", view: "text", wide: true, paragraphs: [""], items: [], closing: [] });
const emptyPerson = () => ({ name: "", role: "", photo: "", qualification: "", interest: "", email: "" });

/* ---------- small building blocks ---------- */

function Field({ label, value, onChange, area }) {
  return (
    <label className="ahm-field">
      <span>{label}</span>
      {area ? <textarea rows="3" value={value} onChange={(e) => onChange(e.target.value)} /> : <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />}
    </label>
  );
}

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

// a list of single texts: edit, remove, add
function TextList({ label, items, onChange, area, max = 30 }) {
  const set = (index, value) => onChange(items.map((item, i) => (i === index ? value : item)));
  return (
    <div className="ahm-field">
      <span>{label}</span>
      <div className="ahm-rows">
        {items.map((item, index) => (
          <div className="adp-line" key={index}>
            {area ? <textarea rows="3" value={item} onChange={(e) => set(index, e.target.value)} aria-label={`${label} ${index + 1}`} /> : <input type="text" value={item} onChange={(e) => set(index, e.target.value)} aria-label={`${label} ${index + 1}`} />}
            <button type="button" className="adp-icon" onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}><FiTrash2 /></button>
          </div>
        ))}
        {items.length < max && <button type="button" className="ahm-btn ahm-btn--add" onClick={() => onChange([...items, ""])}><FiPlus aria-hidden="true" /> Add</button>}
      </div>
    </div>
  );
}

// rows of two texts (number + label); fixed = edit only
function PairList({ label, items, onChange, first, second, firstLabel, secondLabel, fixed, max = 6 }) {
  const set = (index, key, value) => onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  return (
    <div className="ahm-field">
      <span>{label}</span>
      <div className="ahm-rows">
        {items.map((item, index) => (
          <div className="adp-line" key={index}>
            <div className="ahm-two">
              <input type="text" value={item[first]} onChange={(e) => set(index, first, e.target.value)} aria-label={`${firstLabel} ${index + 1}`} placeholder={firstLabel} />
              <input type="text" value={item[second]} onChange={(e) => set(index, second, e.target.value)} aria-label={`${secondLabel} ${index + 1}`} placeholder={secondLabel} />
            </div>
            {!fixed && <button type="button" className="adp-icon" onClick={() => onChange(items.filter((_, i) => i !== index))} aria-label={`Remove ${index + 1}`}><FiTrash2 /></button>}
          </div>
        ))}
        {!fixed && items.length < max && <button type="button" className="ahm-btn ahm-btn--add" onClick={() => onChange([...items, { [first]: "", [second]: "" }])}><FiPlus aria-hidden="true" /> Add</button>}
      </div>
    </div>
  );
}

// one picture: preview + change / remove
function Photo({ label, value, onChange, say }) {
  const upload = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    try {
      onChange(await uploadDepartmentImage(file));
    } catch (error) {
      say(error.message, true);
    }
  };
  return (
    <div className="adp-photo">
      <b>{label}</b>
      <div className="ahm-image__box">
        {value ? <img src={mediaUrl(value)} alt="" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} onLoad={(e) => { e.currentTarget.style.visibility = "visible"; }} /> : <small>No picture</small>}
      </div>
      <div className="adp-photo__buttons">
        <label className="ahm-btn">
          <FiUpload aria-hidden="true" /> {value ? "Change" : "Upload"}
          <input type="file" accept="image/*" onChange={upload} hidden />
        </label>
        {value && <button type="button" className="ahm-btn" onClick={() => onChange("")}><FiX aria-hidden="true" /> Remove</button>}
      </div>
    </div>
  );
}

// move up / move down / remove buttons of a list item
function ItemTools({ index, count, onMove, onRemove, name }) {
  return (
    <div className="adp-tools">
      <button type="button" className="adp-icon adp-icon--plain" onClick={() => onMove(index, index - 1)} disabled={index === 0} aria-label={`Move ${name} up`}><FiArrowUp /></button>
      <button type="button" className="adp-icon adp-icon--plain" onClick={() => onMove(index, index + 1)} disabled={index === count - 1} aria-label={`Move ${name} down`}><FiArrowDown /></button>
      <button type="button" className="adp-icon" onClick={onRemove} aria-label={`Remove ${name}`}><FiTrash2 /></button>
    </div>
  );
}

const moveItem = (list, from, to) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

/* ---------- the page ---------- */

export default function AdminDepartments() {
  const [all, setAll] = useState(null);
  const [slug, setSlug] = useState("");
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState("");
  const [openCard, setOpenCard] = useState("banner");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });
  const changed = draft ? JSON.stringify(draft) !== saved : false;

  const show = (department) => {
    setSlug(department.slug);
    setDraft(JSON.parse(JSON.stringify(department)));
    setSaved(JSON.stringify(department));
    setMessage({ text: "", error: false });
  };

  useEffect(() => {
    getDepartments()
      .then((list) => { setAll(list); show(list[0]); })
      .catch(() => setMessage({ text: "Cannot load the departments.", error: true }));
  }, []);

  // warn before leaving the page with unsaved changes
  useEffect(() => {
    const warn = (event) => { if (changed) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [changed]);

  if (!all || !draft) {
    return (
      <AdminSidebar title="Departments">
        <p className={message.error ? "ahm-loading is-error" : "ahm-loading"}>{message.text || "Loading..."}</p>
      </AdminSidebar>
    );
  }

  const say = (text, error = false) => setMessage({ text, error });
  const edit = (patch) => { setDraft((now) => ({ ...now, ...patch })); say(""); };
  const toggle = (id) => setOpenCard((now) => (now === id ? "" : id));
  const choose = (next) => {
    if (next === slug) return;
    if (changed && !window.confirm("You have unsaved changes in this department. Leave without saving?")) return;
    show(all.find((d) => d.slug === next));
  };
  const setAt = (key, index, patch) => edit({ [key]: draft[key].map((item, i) => (i === index ? { ...item, ...patch } : item)) });

  const save = async () => {
    setBusy(true);
    try {
      const fresh = await saveDepartment(slug, draft);
      setAll((now) => now.map((d) => (d.slug === slug ? fresh : d)));
      setSaved(JSON.stringify(fresh));
      say("Saved. The department page now shows these changes.");
    } catch (error) {
      say(error.message, true);
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!window.confirm(`Bring back the original content of ${draft.shortName}? Your saved changes for this department will be lost.`)) return;
    const original = await resetDepartment(slug);
    setAll((now) => now.map((d) => (d.slug === slug ? original : d)));
    show(original);
    say("Original content restored.");
  };

  return (
    <AdminSidebar title="Departments">
      <div className="ahm-page">
        <header className="ahm-top">
          <h2>Departments</h2>
          <a href={`/departments/${slug}`} target="_blank" rel="noopener noreferrer">See the live page</a>
        </header>

        <div className="adp-picker">
          <label className="adp-picker__select">
            <span>Department</span>
            <select value={slug} onChange={(e) => choose(e.target.value)}>
              {all.map((d) => <option key={d.slug} value={d.slug}>{d.shortName}</option>)}
            </select>
          </label>
          <div className="adp-picker__pills" role="tablist" aria-label="Choose a department">
            {all.map((d) => (
              <button key={d.slug} type="button" role="tab" aria-selected={d.slug === slug} className={d.slug === slug ? "is-active" : ""} onClick={() => choose(d.slug)}>{d.shortName}</button>
            ))}
          </div>
        </div>

        <Card title="Page labels" note="small fixed texts" open={openCard === "labels"} onToggle={() => toggle("labels")}>
          <div className="ahm-two">
            <Field label="Tag above the title" value={draft.labels?.eyebrow || ""} onChange={(v) => edit({ labels: { ...(draft.labels || {}), eyebrow: v } })} />
            <Field label="Left banner tag" value={draft.labels?.bannerTagLeft || ""} onChange={(v) => edit({ labels: { ...(draft.labels || {}), bannerTagLeft: v } })} />
            <Field label="Right banner tag" value={draft.labels?.bannerTagRight || ""} onChange={(v) => edit({ labels: { ...(draft.labels || {}), bannerTagRight: v } })} />
            <Field label="Breadcrumb name" value={draft.labels?.breadcrumb || ""} onChange={(v) => edit({ labels: { ...(draft.labels || {}), breadcrumb: v } })} />
            <Field label="Phone dropdown label" value={draft.labels?.switcherLabel || ""} onChange={(v) => edit({ labels: { ...(draft.labels || {}), switcherLabel: v } })} />
            <Field label="About tab name" value={draft.labels?.aboutTab || ""} onChange={(v) => edit({ labels: { ...(draft.labels || {}), aboutTab: v } })} />
            <Field label="Staff tab name" value={draft.labels?.staffTab || ""} onChange={(v) => edit({ labels: { ...(draft.labels || {}), staffTab: v } })} />
            <Field label="About search placeholder" value={draft.labels?.searchAbout || ""} onChange={(v) => edit({ labels: { ...(draft.labels || {}), searchAbout: v } })} />
            <Field label="Staff search placeholder" value={draft.labels?.searchStaff || ""} onChange={(v) => edit({ labels: { ...(draft.labels || {}), searchStaff: v } })} />
            <Field label="Qualification label" value={draft.labels?.qualificationLabel || ""} onChange={(v) => edit({ labels: { ...(draft.labels || {}), qualificationLabel: v } })} />
            <Field label="Interested area label" value={draft.labels?.interestLabel || ""} onChange={(v) => edit({ labels: { ...(draft.labels || {}), interestLabel: v } })} />
            <Field label="Highlights small tag" value={draft.labels?.highlightsEyebrow || ""} onChange={(v) => edit({ labels: { ...(draft.labels || {}), highlightsEyebrow: v } })} />
            <Field label="Highlights heading" value={draft.labels?.highlightsTitle || ""} onChange={(v) => edit({ labels: { ...(draft.labels || {}), highlightsTitle: v } })} />
            <Field label="Highlights last word (orange)" value={draft.labels?.highlightsTitleHighlight || ""} onChange={(v) => edit({ labels: { ...(draft.labels || {}), highlightsTitleHighlight: v } })} />
            <Field label="Empty photo placeholder" value={draft.labels?.photoPlaceholder || ""} onChange={(v) => edit({ labels: { ...(draft.labels || {}), photoPlaceholder: v } })} />
          </div>
        </Card>

        <Card title="Banner & title" note="banner, title, quick facts, picture" open={openCard === "banner"} onToggle={() => toggle("banner")}>
          <Photo label="Banner (wide picture at the top, best 1920 x 1080)" value={draft.banner} onChange={(v) => edit({ banner: v })} say={say} />
          <div className="ahm-two">
            <Field label="Name in the department switcher" value={draft.shortName} onChange={(v) => edit({ shortName: v })} />
            <Field label="Title" value={draft.title} onChange={(v) => edit({ title: v })} />
          </div>
          <Field label="Second line of the title (optional)" value={draft.titleLine2} onChange={(v) => edit({ titleLine2: v })} />
          <Field label="Introduction" value={draft.lead} onChange={(v) => edit({ lead: v })} area />
          <TextList label="Quick facts" items={draft.facts.map((f) => f.text)} onChange={(list) => edit({ facts: list.map((text) => ({ text })) })} max={6} />
          <Photo label="Department picture (framed, next to the title)" value={draft.image} onChange={(v) => edit({ image: v })} say={say} />
          <Field label="Description of that picture (for screen readers)" value={draft.imageAlt} onChange={(v) => edit({ imageAlt: v })} />
        </Card>

        <Card title="About pictures & numbers" note="3 pictures, 3 number tiles" open={openCard === "pictures"} onToggle={() => toggle("pictures")}>
          <div className="ahm-field">
            <span>About pictures</span>
            <p className="ahm-hint">The page shows these 3 pictures as one collage with a fixed design, so you can change or remove a picture but not add more.</p>
            <div className="adp-slots">
              {COLLAGE.map((name, index) => (
                <Photo key={name} label={name} value={draft.collage[index]?.src || ""} say={say} onChange={(v) => setAt("collage", index, { src: v })} />
              ))}
            </div>
          </div>
          <PairList label="Number tiles" items={draft.tiles} onChange={(v) => edit({ tiles: v })} first="value" second="label" firstLabel="Number" secondLabel="Label" fixed />
        </Card>

        <Card title="About sections" note={`${draft.about.length} sections`} open={openCard === "about"} onToggle={() => toggle("about")}>
          <p className="ahm-hint">The first section sits beside the pictures. Move a section up or down to change the order.</p>
          {draft.about.map((section, index) => (
            <div className="adp-item" key={section.id}>
              <div className="adp-item__head">
                <b>{index + 1}. {section.title || "(no title)"}</b>
                <ItemTools index={index} count={draft.about.length} name={`section ${index + 1}`} onMove={(a, b) => edit({ about: moveItem(draft.about, a, b) })} onRemove={() => { if (window.confirm(`Remove the section "${section.title}"?`)) edit({ about: draft.about.filter((_, i) => i !== index) }); }} />
              </div>
              <Field label="Section title" value={section.title} onChange={(v) => setAt("about", index, { title: v })} />
              <div className="ahm-two">
                <label className="ahm-field">
                  <span>Shown as</span>
                  <select value={section.view} onChange={(e) => setAt("about", index, { view: e.target.value })}>
                    {VIEWS.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
                  </select>
                </label>
                <label className="adp-check">
                  <input type="checkbox" checked={section.wide} onChange={(e) => setAt("about", index, { wide: e.target.checked })} />
                  <span>Full-width card</span>
                </label>
              </div>
              <TextList label="Paragraph" area items={section.paragraphs} onChange={(v) => setAt("about", index, { paragraphs: v })} />
              {section.view !== "text" && <TextList label="Item" items={section.items} onChange={(v) => setAt("about", index, { items: v })} />}
              {section.view !== "text" && <TextList label="Closing line" area items={section.closing} onChange={(v) => setAt("about", index, { closing: v })} max={3} />}
            </div>
          ))}
          <button type="button" className="ahm-btn ahm-btn--add" onClick={() => edit({ about: [...draft.about, emptySection()] })}><FiPlus aria-hidden="true" /> Add section</button>
        </Card>

        <Card title="Staff" note={`${draft.staff.length} people`} open={openCard === "staff"} onToggle={() => toggle("staff")}>
          <p className="ahm-hint">Empty fields are not shown on the page.</p>
          {draft.staff.map((person, index) => (
            <div className="adp-item" key={index}>
              <div className="adp-item__head">
                <b>{index + 1}. {person.name || "(no name)"}</b>
                <ItemTools index={index} count={draft.staff.length} name={person.name || `person ${index + 1}`} onMove={(a, b) => edit({ staff: moveItem(draft.staff, a, b) })} onRemove={() => { if (window.confirm(`Remove ${person.name || "this person"}?`)) edit({ staff: draft.staff.filter((_, i) => i !== index) }); }} />
              </div>
              <div className="ahm-two">
                <Field label="Name" value={person.name} onChange={(v) => setAt("staff", index, { name: v })} />
                <Field label="Position" value={person.role} onChange={(v) => setAt("staff", index, { role: v })} />
              </div>
              <div className="ahm-two">
                <Field label="Qualification" value={person.qualification} onChange={(v) => setAt("staff", index, { qualification: v })} />
                <Field label="Email" value={person.email} onChange={(v) => setAt("staff", index, { email: v })} />
              </div>
              <Field label="Area of interest" value={person.interest} onChange={(v) => setAt("staff", index, { interest: v })} />
              <Photo label="Photo" value={person.photo} onChange={(v) => setAt("staff", index, { photo: v })} say={say} />
            </div>
          ))}
          <button type="button" className="ahm-btn ahm-btn--add" onClick={() => edit({ staff: [...draft.staff, emptyPerson()] })}><FiPlus aria-hidden="true" /> Add person</button>
        </Card>

        <Card title="Highlights" note="4 picture cards" open={openCard === "highlights"} onToggle={() => toggle("highlights")}>
          <p className="ahm-hint">The page shows exactly 4 highlight cards, so they can be edited but not added or removed.</p>
          {draft.highlights.map((item, index) => (
            <div className="adp-item" key={index}>
              <div className="adp-item__head"><b>Card {index + 1}</b></div>
              <div className="ahm-two">
                <Field label="Number" value={item.value} onChange={(v) => setAt("highlights", index, { value: v })} />
                <Field label="Label" value={item.label} onChange={(v) => setAt("highlights", index, { label: v })} />
              </div>
              <Field label="Text" value={item.text} onChange={(v) => setAt("highlights", index, { text: v })} area />
              <Photo label="Picture" value={item.image} onChange={(v) => setAt("highlights", index, { image: v })} say={say} />
            </div>
          ))}
        </Card>

        <div className="ahm-save">
          <span className={message.error ? "is-error" : ""} role="status">{message.text || (changed ? `Unsaved changes in ${draft.shortName}` : "No unsaved changes")}</span>
          <button type="button" className="ahm-btn" onClick={reset} disabled={busy}>Restore original</button>
          <button type="button" className="ahm-btn" onClick={() => { setDraft(JSON.parse(saved)); say(""); }} disabled={!changed || busy}>Discard</button>
          <button type="button" className="ahm-btn ahm-btn--save" onClick={save} disabled={!changed || busy}>{busy ? "Saving..." : "Save changes"}</button>
        </div>
      </div>
    </AdminSidebar>
  );
}