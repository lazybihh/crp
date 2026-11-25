// AdminEntrepreneurship.jsx - admin page for "Entrepreneurship" (/about/entrepreneurship). Self-contained: its own editor code and its own AdminEntrepreneurship.css (classes start with "aentre-").
// Every text and image saved for the page can be edited. Not editable: icons, links, download files and the page design.
// Lists have a fixed number of items (edit only).
import { useEffect, useState } from "react";
import { FiChevronRight, FiUpload, FiX } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import { getAboutPage, saveAboutPage } from "../../services/aboutUsService";
import { uploadMediaImage, mediaUrl } from "../../services/mediaService";
import "./AdminEntrepreneurship.css";

const c = "aentre"; // class prefix used by AdminEntrepreneurship.css
const PAGE_KEY = "entrepreneurship";
const TITLE = "Entrepreneurship";
const PUBLIC_PATH = "/about/entrepreneurship";

const HIDDEN = ["key", "icon", "href", "type", "external", "downloads"]; // never shown (files and links are fixed in the public pages)
const IMAGE_KEYS = ["image", "photo", "portrait", "logo"]; // shown as a picture with Change / Remove
const TITLE_KEYS = ["title", "name", "label", "when", "month", "date", "tag"]; // what names an item in a list
const LONG_KEYS = ["text", "lead", "message", "description", "body", "story", "note"];

const clone = (value) => JSON.parse(JSON.stringify(value));
const words = (key) => String(key).replace(/([A-Z])/g, " $1").replace(/[-_]/g, " ").replace(/^./, (c) => c.toUpperCase());
const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

function setAt(root, path, value) {
  const next = clone(root);
  let cursor = next;
  path.slice(0, -1).forEach((key) => { cursor = cursor[key]; });
  cursor[path[path.length - 1]] = value;
  return next;
}

const itemName = (item, index, label) => {
  const key = isObject(item) ? TITLE_KEYS.find((k) => typeof item[k] === "string" && item[k].trim()) : null;
  const text = key ? item[key].trim() : "";
  return `${index + 1}. ${text ? (text.length > 48 ? `${text.slice(0, 48)}...` : text) : label}`;
};

/* ---------- one picture: preview + change / remove ---------- */
function Photo({ label, value, onChange, say }) {
  const [busy, setBusy] = useState(false);
  const choose = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      onChange(await uploadMediaImage(file));
    } catch (error) {
      say(error.message, true);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className={`${c}-photo`}>
      <b>{label}</b>
      <div className={`${c}-image__box`}>
        {value ? <img src={mediaUrl(value)} alt="" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} onLoad={(e) => { e.currentTarget.style.visibility = "visible"; }} /> : <small>No picture</small>}
      </div>
      <div className={`${c}-photo__buttons`}>
        <label className={`${c}-btn`}>
          <FiUpload aria-hidden="true" /> {busy ? "Uploading..." : value ? "Change" : "Upload"}
          <input type="file" accept="image/*" onChange={choose} disabled={busy} hidden />
        </label>
        {value && <button type="button" className={`${c}-btn`} onClick={() => onChange("")}><FiX aria-hidden="true" /> Remove</button>}
      </div>
    </div>
  );
}

/* ---------- any value: text, picture, group or list ---------- */
function Node({ name, value, path, set, say }) {
  if (HIDDEN.includes(name)) return null;
  const label = words(name);

  if (Array.isArray(value)) {
    return (
      <div className={`${c}-field`}>
        <span>{label}</span>
        <p className={`${c}-hint`}>Edit the existing items. The page layout is fixed, so items cannot be added or removed.</p>
        <div className={`${c}-list`}>
          {value.map((item, index) => (
            <div className={`${c}-item`} key={index}>
              <div className={`${c}-item__head`}>
                <b>{itemName(item, index, label)}</b>
              </div>
              <Node name={String(index)} value={item} path={[...path, index]} set={set} say={say} />
            </div>
          ))}
          {!value.length && <small className={`${c}-muted`}>Nothing here yet.</small>}
        </div>
      </div>
    );
  }

  if (isObject(value)) {
    const keys = Object.keys(value).filter((k) => !HIDDEN.includes(k));
    const short = keys.filter((k) => typeof value[k] === "string" && !IMAGE_KEYS.includes(k) && !LONG_KEYS.includes(k) && value[k].length <= 90);
    return (
      <div className={`${c}-group`}>
        {keys.map((k) => (
          <div className={short.includes(k) ? `${c}-cell` : `${c}-cell ${c}-cell--wide`} key={k}>
            <Node name={k} value={value[k]} path={[...path, k]} set={set} say={say} />
          </div>
        ))}
      </div>
    );
  }

  if (IMAGE_KEYS.includes(name)) return <Photo label={label} value={value || ""} onChange={(v) => set(path, v)} say={say} />;
  if (typeof value === "boolean") {
    return <label className={`${c}-check`}><input type="checkbox" checked={value} onChange={(e) => set(path, e.target.checked)} /><span>{label}</span></label>;
  }
  if (typeof value === "number") {
    return <label className={`${c}-field`}><span>{label}</span><input type="number" value={value} onChange={(e) => set(path, e.target.value === "" ? 0 : Number(e.target.value))} /></label>;
  }
  const long = LONG_KEYS.includes(name) || String(value).length > 90 || /\n/.test(String(value));
  const text = value ?? "";
  const shownLabel = /^\d+$/.test(name) ? "Text" : label; // items of a plain list have only a number as name
  return (
    <label className={`${c}-field`}>
      <span>{shownLabel}</span>
      {long ? <textarea rows="3" value={text} onChange={(e) => set(path, e.target.value)} /> : <input type="text" value={text} onChange={(e) => set(path, e.target.value)} />}
    </label>
  );
}

/* ---------- the page ---------- */
export default function AdminEntrepreneurship() {
  const [content, setContent] = useState(null);
  const [saved, setSaved] = useState("");
  const [openCard, setOpenCard] = useState("hero");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });
  const changed = content ? JSON.stringify(content) !== saved : false;

  useEffect(() => {
    let active = true;
    getAboutPage(PAGE_KEY)
      .then((row) => {
        const data = row.content || row;
        if (!active) return;
        setContent(clone(data));
        setSaved(JSON.stringify(data));
      })
      .catch(() => { if (active) setMessage({ text: "Cannot reach the server. Start the backend, then reload this page.", error: true }); });
    return () => { active = false; };
  }, [PAGE_KEY]);

  // warn before closing the tab with unsaved changes
  useEffect(() => {
    const warn = (event) => { if (changed) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [changed]);

  if (!content) {
    return (
      <AdminSidebar title={TITLE}>
        <p className={message.error ? `${c}-loading is-error` : `${c}-loading`}>{message.text || "Loading..."}</p>
      </AdminSidebar>
    );
  }

  const say = (text, error = false) => setMessage({ text, error });
  const set = (path, value) => { setContent((now) => setAt(now, path, value)); say(""); };

  const save = async () => {
    setBusy(true);
    try {
      const result = await saveAboutPage(PAGE_KEY, content);
      const fresh = result.content || content;
      setContent(clone(fresh));
      setSaved(JSON.stringify(fresh));
      say("Saved. The page now shows these changes.");
    } catch (error) {
      say(error.message, true);
    } finally {
      setBusy(false);
    }
  };

  const sections = Object.keys(content).filter((k) => !HIDDEN.includes(k));
  const noteOf = (value) => (Array.isArray(value) ? `${value.length} items` : isObject(value) ? `${Object.keys(value).filter((k) => !HIDDEN.includes(k)).length} fields` : "text");

  return (
    <AdminSidebar title={TITLE}>
      <div className={`${c}-page`}>
        <header className={`${c}-top`}>
          <h2>{TITLE}</h2>
          <a href={PUBLIC_PATH} target="_blank" rel="noopener noreferrer">See the live page</a>
        </header>

        {sections.map((key) => (
          <section className={`${c}-card${openCard === key ? " is-open" : ""}`} key={key}>
            <button type="button" className={`${c}-card__head`} aria-expanded={openCard === key} onClick={() => setOpenCard(openCard === key ? "" : key)}>
              <h3>{words(key)}</h3>
              <span>{noteOf(content[key])} <FiChevronRight aria-hidden="true" /></span>
            </button>
            {openCard === key && (
              <div className={`${c}-card__body`}>
                <Node name={key} value={content[key]} path={[key]} set={set} say={say} />
              </div>
            )}
          </section>
        ))}

        <div className={`${c}-save`}>
          <span className={message.error ? "is-error" : ""} role="status">{message.text || (changed ? "Unsaved changes" : "No unsaved changes")}</span>
          <button type="button" className={`${c}-btn`} onClick={() => { setContent(JSON.parse(saved)); say(""); }} disabled={!changed || busy}>Discard</button>
          <button type="button" className={`${c}-btn ${c}-btn--save`} onClick={save} disabled={!changed || busy}>{busy ? "Saving..." : "Save changes"}</button>
        </div>
      </div>
    </AdminSidebar>
  );
}
