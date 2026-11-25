// AdminOnlineLearning.jsx - admin page for "Online learning portals" (/students/online-learning). Self-contained: its own editor code and its own AdminOnlineLearning.css (classes start with "aav-").
// Every text, number and image saved for the page can be edited. Not editable: icons, ids and links to other pages.
// Only the lists named in GROWING_LISTS can get new items, be removed or be moved. Every other list is edit-only.
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { getStudentPage, saveStudentPage, uploadStudentDocument } from "../../services/studentPageService";
import { uploadMediaImage, mediaUrl } from "../../services/mediaService";
import "./AdminOnlineLearning.css";

const c = "aav"; // class prefix used by AdminOnlineLearning.css
const PAGE_KEY = "online-learning";
const TITLE = "Online learning portals";
const PUBLIC_PATH = "/students/online-learning";

const HIDDEN = ["key", "id", "icon", "related", "to", "noticeIds", "notices", "type"]; // never shown
const IMAGE_KEYS = ["image", "photo", "poster", "src", "logo"]; // text fields with these names are pictures (upload, Change, Remove)
const FILE_KEYS = ["file", "href"]; // inside DOCUMENT_ROWS these are files (upload, Open current file)
const NAME_KEYS = ["title", "name", "label", "question", "q", "role", "trade", "goal"]; // what names an item in a list
const DOCUMENT_ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.webp";
const EDIT_ONLY_HINT = "Edit the existing items. The page layout is fixed, so items cannot be added or removed.";

// The only lists of this page that can grow and shrink. "*" stands for any list position.
// The value is the shape of a blank item (used when the list is empty).
const GROWING_LISTS = {};

// Rows whose file field is a document (these get "Upload file").
const DOCUMENT_ROWS = [];

const clone = (value) => JSON.parse(JSON.stringify(value));
const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);
const words = (key) => String(key).replace(/([A-Z])/g, " $1").replace(/[-_]/g, " ").replace(/^./, (ch) => ch.toUpperCase());
const pathKey = (path) => path.map((part) => (typeof part === "number" ? "*" : part)).join(".");

// "1. Name of the item" for the item heading.
function itemName(item, index, listName) {
  const key = isObject(item) ? NAME_KEYS.find((k) => typeof item[k] === "string" && item[k].trim()) : null;
  const text = key ? item[key].trim() : "";
  const shown = text.length > 48 ? `${text.slice(0, 48)}...` : text;
  return `${index + 1}. ${shown || words(listName)}`;
}

// A new, empty item with the same keys as `sample`: text -> "", numbers -> 0, yes/no -> false, lists -> [].
// Groups are blanked the same way. Ids and icons are not copied.
function blankItem(sample) {
  if (Array.isArray(sample)) return [];
  if (isObject(sample)) {
    const item = {};
    Object.keys(sample).forEach((key) => {
      if (key !== "id" && key !== "icon") item[key] = blankItem(sample[key]);
    });
    return item;
  }
  if (typeof sample === "number") return 0;
  if (typeof sample === "boolean") return false;
  return "";
}

// One file chooser. It calls onPick with the chosen file and then clears itself.
function FileChooser({ text, accept, onPick }) {
  const choose = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) onPick(file);
  };
  return (
    <label className={`${c}-choose`}>
      {text}
      <input type="file" accept={accept} onChange={choose} />
    </label>
  );
}

// A picture: preview, Change and Remove.
function ImageField({ label, value, onPick, onRemove }) {
  return (
    <div className={`${c}-field`}>
      <span>{label}</span>
      {value ? <img className={`${c}-preview`} src={mediaUrl(value)} alt="Current preview" /> : <small>No image yet.</small>}
      <div className={`${c}-upload`}>
        <FileChooser text={value ? "Change" : "Choose image"} accept="image/*" onPick={onPick} />
        {value && <button type="button" onClick={onRemove}>Remove</button>}
      </div>
    </div>
  );
}

// A document row's file: the address, an upload button and a link to the current file.
function DocumentField({ label, value, onPick }) {
  const fileName = String(value || "").split("/").pop().split("\\\\").pop();
  return (
    <div className={`${c}-field`}>
      <span>{label}</span>
      <div className={`${c}-upload`}>
        <FileChooser text={value ? "Change file" : "Upload file"} accept={DOCUMENT_ACCEPT} onPick={onPick} />
        {value ? (
          <>
            <small>{fileName}</small>
            <a href={mediaUrl(value)} target="_blank" rel="noreferrer">Open current file</a>
          </>
        ) : <small>No file chosen</small>}
      </div>
    </div>
  );
}

export default function AdminOnlineLearning() {
  const [content, setContent] = useState(null);
  const [snapshot, setSnapshot] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });
  const changed = content ? JSON.stringify(content) !== snapshot : false;
  const say = (text, error = false) => setMessage({ text, error });

  // load the page
  useEffect(() => {
    let active = true;
    getStudentPage(PAGE_KEY)
      .then((row) => {
        if (!active) return;
        const data = row.content || row;
        setContent(clone(data));
        setSnapshot(JSON.stringify(data));
      })
      .catch((error) => active && say(error.message, true));
    return () => {
      active = false;
    };
  }, []);

  // warn before the tab is closed with unsaved changes
  useEffect(() => {
    const warn = (event) => {
      if (!changed) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [changed]);

  // change one value; `path` is the list of keys and positions that leads to it
  const setAt = (path, value) =>
    setContent((now) => {
      const next = clone(now);
      let cursor = next;
      path.slice(0, -1).forEach((key) => {
        cursor = cursor[key];
      });
      cursor[path[path.length - 1]] = value;
      return next;
    });

  const chooseImage = async (path, file) => {
    try {
      setAt(path, await uploadMediaImage(file));
      say("Image selected. Save changes to publish it.");
    } catch (error) {
      say(error.message, true);
    }
  };

  const chooseDocument = async (path, file) => {
    try {
      const result = await uploadStudentDocument(file);
      setAt(path, result.fileUrl);
      const extension = String(file.name || result.fileUrl).split(".").pop().toUpperCase();
      setAt([...path.slice(0, -1), "type"], extension);
      say("File selected. Save changes to publish it.");
    } catch (error) {
      say(error.message, true);
    }
  };

  const moveItem = (path, list, from, to) => {
    const next = [...list];
    [next[from], next[to]] = [next[to], next[from]];
    setAt(path, next);
  };

  const renderList = (list, path, name) => {
    const key = pathKey(path);
    const canGrow = key in GROWING_LISTS;
    return (
      <div className={`${c}-list`}>
        <h4>{words(name)}</h4>
        <p className={`${c}-hint`}>{canGrow ? "You can add, remove and reorder rows here." : EDIT_ONLY_HINT}</p>
        {list.map((item, index) => (
          <div className={`${c}-item`} key={index}>
            <div className={`${c}-itemhead`}>
              <b>{itemName(item, index, name)}</b>
              {canGrow && (
                <div>
                  <button type="button" disabled={index === 0} onClick={() => moveItem(path, list, index, index - 1)}>↑</button>
                  <button type="button" disabled={index === list.length - 1} onClick={() => moveItem(path, list, index, index + 1)}>↓</button>
                  <button type="button" onClick={() => setAt(path, list.filter((_, i) => i !== index))}>Remove</button>
                </div>
              )}
            </div>
            {render(item, [...path, index], name)}
          </div>
        ))}
        {canGrow && (
          <button type="button" onClick={() => setAt(path, [...list, blankItem(GROWING_LISTS[key])])}>
            {name === "documents" || name === "docs" ? "Add document" : name === "posters" ? "Add poster" : name === "trades" ? "Add trade" : "Add member"}
          </button>
        )}
      </div>
    );
  };

  // draws any value: a list, a group of fields, or one field
  const render = (value, path, name) => {
    if (HIDDEN.includes(name)) return null;
    if (Array.isArray(value)) return renderList(value, path, name);
    if (isObject(value)) {
      return (
        <div className={`${c}-group`}>
          {Object.keys(value)
            .filter((key) => !HIDDEN.includes(key))
            .map((key) => (
              <div className={`${c}-cell${typeof value[key] === "object" ? ` ${c}-wide` : ""}`} key={key}>
                {render(value[key], [...path, key], key)}
              </div>
            ))}
        </div>
      );
    }

    const inList = typeof path[path.length - 1] === "number"; // a plain text item of a list has no label of its own
    const label = inList ? "" : words(name);
    if (typeof value === "boolean") {
      return (
        <label className={`${c}-field`}>
          <span>{label}</span>
          <input type="checkbox" checked={value} onChange={(event) => setAt(path, event.target.checked)} />
        </label>
      );
    }
    if (typeof value === "number") {
      const setNumber = (event) => setAt(path, event.target.value === "" ? 0 : Number(event.target.value));
      return (
        <label className={`${c}-field`}>
          <span>{label}</span>
          <input type="number" value={value} onChange={setNumber} />
        </label>
      );
    }
    if (IMAGE_KEYS.includes(name) && (typeof value === "string" || value === "")) {
      return (
        <ImageField label={label} value={value} onPick={(file) => chooseImage(path, file)} onRemove={() => setAt(path, "")} />
      );
    }
    if (FILE_KEYS.includes(name) && ((DOCUMENT_ROWS.includes(pathKey(path.slice(0, -1))) || pathKey(path.slice(0, -1)).startsWith("scholarships")) || pathKey(path.slice(0, -1)).endsWith("scholarships"))) {
      return (
        <DocumentField label="File" value={value} onPick={(file) => chooseDocument(path, file)} />
      );
    }
    const parentPath = pathKey(path.slice(0, -1));
    const isDocumentPath = DOCUMENT_ROWS.includes(parentPath) || parentPath.startsWith("scholarships");
    const externalLink = ["url", "href", "link", "website"].includes(name.toLowerCase()) && !isDocumentPath;
    const longText = ["text", "lead", "description", "message", "answer", "intro", "note", "notice", "about", "content"].includes(name.toLowerCase()) || String(value ?? "").length > 90;
    return (
      <label className={`${c}-field`}>
        <span>{externalLink ? "Link (web address)" : label}</span>
        {longText ? (
          <textarea rows={4} value={value ?? ""} onChange={(event) => setAt(path, event.target.value)} />
        ) : (
          <input value={value ?? ""} onChange={(event) => setAt(path, event.target.value)} />
        )}
      </label>
    );
  };

  const normalizeDocumentTypes = (data) => {
    const next = clone(data);
    const normalizeRows = (rows) => (Array.isArray(rows) ? rows.map((row) => {
      if (!isObject(row)) return row;
      const fileKey = ["href", "file"].find((key) => typeof row[key] === "string");
      const file = fileKey ? row[fileKey] : "";
      const type = file ? String(file).split("?")[0].split(".").pop().toUpperCase() : "";
      return { ...row, type };
    }) : rows);
    if (Array.isArray(next.documents)) next.documents = normalizeRows(next.documents);
    if (Array.isArray(next.docs)) next.docs = normalizeRows(next.docs);
    if (Array.isArray(next.scholarships)) next.scholarships = normalizeRows(next.scholarships);
    return next;
  };

  const save = async () => {
    setBusy(true);
    try {
      const row = await saveStudentPage(PAGE_KEY, normalizeDocumentTypes(content));
      const fresh = row.content || content;
      setContent(clone(fresh));
      setSnapshot(JSON.stringify(fresh));
      say("Saved successfully.");
    } catch (error) {
      say(error.message, true);
    } finally {
      setBusy(false);
    }
  };

  const discard = () => {
    setContent(JSON.parse(snapshot));
    say("Changes discarded.");
  };

  if (!content) {
    return (
      <AdminSidebar title={TITLE}>
        <p className={`${c}-loading`}>{message.text || "Loading page content..."}</p>
      </AdminSidebar>
    );
  }

  return (
    <AdminSidebar title={TITLE}>
      <section className={`${c}-page`}>
        <header className={`${c}-top`}>
          <h2>{TITLE}</h2>
          <a href={PUBLIC_PATH} target="_blank" rel="noreferrer">See the live page</a>
        </header>
        <p className={`${c}-hint`}>
          Edit the existing page content below. Images and documents are uploaded when selected; click Save changes to publish.
        </p>

        {Object.keys(content)
          .filter((key) => !HIDDEN.includes(key))
          .map((key) => (
            <section className={`${c}-card`} key={key}>
              <h3>{words(key)}</h3>
              {render(content[key], [key], key)}
            </section>
          ))}

        <div className={`${c}-save`}>
          <span className={message.error ? `${c}-error` : ""} role="status">
            {message.text || (changed ? "Unsaved changes" : "No unsaved changes")}
          </span>
          <button type="button" disabled={!changed || busy} onClick={discard}>Discard</button>
          <button type="button" disabled={!changed || busy} onClick={save}>{busy ? "Saving..." : "Save changes"}</button>
        </div>
      </section>
    </AdminSidebar>
  );
}
