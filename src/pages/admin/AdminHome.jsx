// AdminHome.jsx - the Home page editor (Admin > Home). Every text and image of the Home page is edited here and saved to the database.
// Not editable here: icons and the two banner tags (they stay in Home.jsx).
// Styles are in AdminHome.css (every class starts with "ahm-").
import { createContext, useContext, useEffect, useState } from "react";
import { FiArrowDown, FiArrowUp, FiChevronRight, FiPlus, FiTrash2, FiUpload } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import { getHomeContent, getHomeOptions, saveHomeContent, uploadHomeImage, mediaUrl } from "../../services/homeService";
import "./AdminHome.css";

const Editor = createContext(null);

// read / write a value inside the draft by its path, e.g. ["principal", "name"]
const getIn = (obj, path) => path.reduce((value, key) => value?.[key], obj);
const setIn = (obj, path, value) => {
  if (!path.length) return value;
  const [key, ...rest] = path;
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  copy[key] = setIn(obj?.[key], rest, value);
  return copy;
};

/* ---------- small building blocks ---------- */

// number of fields inside some part of the page (shown on the closed section)
const countFields = (value) =>
  Array.isArray(value) ? value.reduce((sum, item) => sum + countFields(item), 0)
  : value && typeof value === "object" ? Object.entries(value).reduce((sum, [key, item]) => sum + (key === "_id" || (key === "id" && "items" in value) ? 0 : countFields(item)), 0)
  : 1;

// a section: closed it shows only its title and field count; click to open. One section is open at a time.
function Card({ title, hint, parts, children }) {
  const { draft, openCard, setOpenCard } = useContext(Editor);
  const open = openCard === title;
  const fields = parts.reduce((sum, path) => sum + countFields(getIn(draft, path)), 0);
  return (
    <section className={`ahm-card${open ? " is-open" : ""}`}>
      <button type="button" className="ahm-card__head" aria-expanded={open} onClick={() => setOpenCard(open ? "" : title)}>
        <h3>{title}</h3>
        <span>{fields} fields <FiChevronRight aria-hidden="true" /></span>
      </button>
      {open && (
        <div className="ahm-card__body">
          {hint && <p className="ahm-hint">{hint}</p>}
          {children}
        </div>
      )}
    </section>
  );
}

// one text box (area = taller box, number = numeric)
function Text({ label, path, area, number }) {
  const { draft, set } = useContext(Editor);
  const value = getIn(draft, path) ?? "";
  const change = (event) => set(path, number ? Number(event.target.value) || 0 : event.target.value);
  return (
    <label className="ahm-field">
      <span>{label}</span>
      {area ? <textarea rows="3" value={value} onChange={change} /> : <input type={number ? "number" : "text"} min={number ? 0 : undefined} value={value} onChange={change} />}
    </label>
  );
}

// an image: preview + upload
function Image({ label, path }) {
  const { draft, set, say } = useContext(Editor);
  const value = getIn(draft, path) || "";
  const upload = async (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    try {
      set(path, await uploadHomeImage(file));
    } catch (error) {
      say(error.message, true);
    }
  };
  return (
    <div className="ahm-field">
      <span>{label}</span>
      <div className="ahm-image">
        <div className="ahm-image__box">{value ? <img src={mediaUrl(value)} alt="" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} onLoad={(event) => { event.currentTarget.style.visibility = "visible"; }} /> : <em>No image</em>}</div>
        <label className="ahm-btn">
          <FiUpload aria-hidden="true" /> {value ? "Change image" : "Upload image"}
          <input type="file" accept="image/*" onChange={upload} hidden />
        </label>
      </div>
    </div>
  );
}

// a list of rows with move up / down / remove and an add button
function Rows({ path, blank, noun, adder, children }) {
  const { draft, set } = useContext(Editor);
  const list = getIn(draft, path) || [];
  const swap = (a, b) => {
    const next = [...list];
    [next[a], next[b]] = [next[b], next[a]];
    set(path, next);
  };
  return (
    <div className="ahm-rows">
      {list.map((item, index) => (
        <div className="ahm-row" key={index}>
          <div className="ahm-row__bar">
            <b>{noun} {index + 1}</b>
            <button type="button" onClick={() => swap(index, index - 1)} disabled={index === 0} aria-label="Move up"><FiArrowUp /></button>
            <button type="button" onClick={() => swap(index, index + 1)} disabled={index === list.length - 1} aria-label="Move down"><FiArrowDown /></button>
            <button type="button" onClick={() => set(path, list.filter((_, i) => i !== index))} aria-label={`Remove ${noun.toLowerCase()} ${index + 1}`}><FiTrash2 /></button>
          </div>
          {children(index, [...path, index], item)}
        </div>
      ))}
      {adder || (
        <button type="button" className="ahm-btn ahm-btn--add" onClick={() => set(path, [...list, structuredClone(blank)])}>
          <FiPlus aria-hidden="true" /> Add {noun.toLowerCase()}
        </button>
      )}
    </div>
  );
}

/* ---------- the page ---------- */

export default function AdminHome() {
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState(""); // the page as last loaded / saved, to know what changed
  const [openCard, setOpenCard] = useState("");
  const [failed, setFailed] = useState(false);
  const [options, setOptions] = useState({ notices: [], facilities: [] });
  const [message, setMessage] = useState({ text: "", error: false });
  const [saving, setSaving] = useState(false);

  const say = (text, error = false) => setMessage({ text, error });
  const set = (path, value) => {
    setDraft((current) => setIn(current, path, value));
    setMessage({ text: "", error: false });
  };

  useEffect(() => {
    Promise.all([getHomeContent().catch(() => null), getHomeOptions().catch(() => null)]).then(([content, choices]) => {
      if (!content || !choices) {
        say("Cannot reach the server. Start the backend, then reload this page.", true);
        setFailed(true);
        return;
      }
      const start = structuredClone(content);
      setDraft(start);
      setSaved(JSON.stringify(start));
      setOptions(choices);
    });
  }, []);

  // warn before leaving the page with unsaved changes
  useEffect(() => {
    const warn = (event) => { if (draft && JSON.stringify(draft) !== saved) event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [draft, saved]);

  const save = async () => {
    setSaving(true);
    try {
      const { notices, facilityTiles, ...fields } = draft; // the two ready-made lists are not saved
      fields.facilities = fields.facilities.filter((tile) => tile.facility); // a tile with no facility chosen is skipped
      await saveHomeContent(fields);
      setSaved(JSON.stringify(draft));
      say("Saved. The Home page now shows these changes.");
    } catch (error) {
      say(error.message, true);
    } finally {
      setSaving(false);
    }
  };

  const changed = JSON.stringify(draft) !== saved;
  const discard = () => {
    setDraft(JSON.parse(saved));
    say("");
  };

  if (!draft) {
    return (
      <AdminSidebar title="Home">
        <p className={failed ? "ahm-loading is-error" : "ahm-loading"}>{failed ? message.text : "Loading..."}</p>
      </AdminSidebar>
    );
  }

  const noticeById = (id) => options.notices.find((notice) => notice._id === id);
  const facilityById = (id) => options.facilities.find((facility) => facility._id === id);
  const unpickedNotices = options.notices.filter((notice) => !draft.noticeIds.includes(notice._id));

  return (
    <AdminSidebar title="Home">
      <Editor.Provider value={{ draft, set, say, openCard, setOpenCard }}>
        <div className="ahm-page">
          <header className="ahm-top">
            <h2>Home page</h2>
            <a href="/" target="_blank" rel="noopener noreferrer">See the live page</a>
          </header>

          <Card title="Banner images" parts={[["banners"]]} hint="The photos that slide at the top of the Home page. Wide (landscape) photos look best.">
            <Rows path={["banners"]} noun="Banner" blank={{ image: "", alt: "" }}>
              {(i, base) => (
                <>
                  <Image label="Photo" path={[...base, "image"]} />
                  <Text label="Short description of the photo" path={[...base, "alt"]} />
                </>
              )}
            </Rows>
          </Card>

          <Card title="Latest news strip" parts={[["latestNews"]]} hint="The moving line under the banner. Language: hi = Hindi, en = English. The link is optional (for example /notices).">
            <Rows path={["latestNews"]} noun="Headline" blank={{ text: "", lang: "en", to: "" }}>
              {(i, base) => (
                <>
                  <Text label="Headline" path={[...base, "text"]} area />
                  <div className="ahm-two">
                    <Text label="Language (hi or en)" path={[...base, "lang"]} />
                    <Text label="Link when clicked (optional)" path={[...base, "to"]} />
                  </div>
                </>
              )}
            </Rows>
          </Card>

          <Card title="Numbers under the banner" parts={[["stats"]]}>
            <Rows path={["stats"]} noun="Number" blank={{ value: "", label: "" }}>
              {(i, base) => (
                <div className="ahm-two">
                  <Text label="Number" path={[...base, "value"]} />
                  <Text label="Label" path={[...base, "label"]} />
                </div>
              )}
            </Rows>
          </Card>

          <Card title="Why choose us" parts={[["sectionContent", "whyChooseUs"], ["reasons"]]}>
            <Text label="Small heading" path={["sectionContent", "whyChooseUs", "eyebrow"]} />
            <Text label="Title" path={["sectionContent", "whyChooseUs", "title"]} />
            <Text label="Description" path={["sectionContent", "whyChooseUs", "description"]} area />
            <Rows path={["reasons"]} noun="Reason" blank={{ title: "", text: "" }}>
              {(i, base) => (
                <>
                  <Text label="Title" path={[...base, "title"]} />
                  <Text label="Text" path={[...base, "text"]} area />
                </>
              )}
            </Rows>
          </Card>

          <Card title="Principal's message" parts={[["principal"]]}>
            <Text label="Small heading" path={["principal", "eyebrow"]} />
            <Text label="Quote" path={["principal", "quote"]} area />
            <Rows path={["principal", "paragraphs"]} noun="Paragraph" blank="">
              {(i, base) => <Text label="Text" path={base} area />}
            </Rows>
            <div className="ahm-two">
              <Text label="Name" path={["principal", "name"]} />
              <Text label="Role" path={["principal", "role"]} />
            </div>
            <Image label="Photo" path={["principal", "photo"]} />
            <div className="ahm-two">
              <Text label="Button text" path={["principal", "link", "label"]} />
              <Text label="Button link" path={["principal", "link", "to"]} />
            </div>
          </Card>

          <Card title="Leadership" parts={[["sectionContent", "leadership"], ["dignitaries"]]}>
            <Text label="Small heading" path={["sectionContent", "leadership", "eyebrow"]} />
            <Text label="Title" path={["sectionContent", "leadership", "title"]} />
            <Rows path={["dignitaries"]} noun="Person" blank={{ name: "", role: "", text: "", image: "", initials: "" }}>
              {(i, base) => (
                <>
                  <div className="ahm-two">
                    <Text label="Name" path={[...base, "name"]} />
                    <Text label="Role" path={[...base, "role"]} />
                  </div>
                  <Text label="Text" path={[...base, "text"]} area />
                  <Text label="Initials (shown when there is no photo)" path={[...base, "initials"]} />
                  <Image label="Photo" path={[...base, "image"]} />
                </>
              )}
            </Rows>
          </Card>

          <Card title="News & notices" parts={[["sectionContent", "notices"], ["news"]]} hint="Left side: the featured news card. Right side: the notice board.">
            <Text label="Small heading" path={["sectionContent", "notices", "eyebrow"]} />
            <Text label="Title" path={["sectionContent", "notices", "title"]} />
            <Text label="Featured news - label" path={["news", "tag"]} />
            <Text label="Featured news - title" path={["news", "title"]} />
            <Text label="Featured news - text" path={["news", "text"]} area />
            <Image label="Featured news - photo" path={["news", "image"]} />
          </Card>

          <Card title="Notice board" parts={[["noticeIds"]]} hint="Only notices that already exist on the Notices page can be shown here. Leave the list empty to show the newest notices automatically.">
            <Rows
              path={["noticeIds"]}
              noun="Notice"
              adder={
                <select className="ahm-select" value="" onChange={(event) => event.target.value && set(["noticeIds"], [...draft.noticeIds, event.target.value])}>
                  <option value="">+ Add a notice from the Notices page...</option>
                  {unpickedNotices.map((notice) => <option key={notice._id} value={notice._id}>{notice.title}</option>)}
                </select>
              }
            >
              {(i, base, id) => <p className="ahm-pick">{noticeById(id)?.title || "This notice is no longer on the Notices page"}</p>}
            </Rows>
          </Card>

          <Card title="Events, achievements & placements" parts={[["sectionContent", "highlights"], ["highlights"]]}>
            <Text label="Small heading" path={["sectionContent", "highlights", "eyebrow"]} />
            <Text label="Title" path={["sectionContent", "highlights", "title"]} />
            <Rows path={["highlights"]} noun="Panel" blank={{ id: "", title: "", image: "", items: [] }}>
              {(i, base) => (
                <>
                  <Text label="Panel title" path={[...base, "title"]} />
                  <Image label="Background photo" path={[...base, "image"]} />
                  <Rows path={[...base, "items"]} noun="Line" blank={{ date: "", text: "" }}>
                    {(j, line) => (
                      <div className="ahm-two">
                        <Text label="Date" path={[...line, "date"]} />
                        <Text label="Text" path={[...line, "text"]} />
                      </div>
                    )}
                  </Rows>
                </>
              )}
            </Rows>
          </Card>

          <Card title="Facilities" parts={[["sectionContent", "facilities"], ["facilities"]]} hint="Pick a facility from the Facilities page and one of its 3 photos. The first tile is shown large.">
            <Text label="Small heading" path={["sectionContent", "facilities", "eyebrow"]} />
            <Text label="Title" path={["sectionContent", "facilities", "title"]} />
            <Text label="Description" path={["sectionContent", "facilities", "description"]} area />
            <Rows path={["facilities"]} noun="Tile" blank={{ facility: "", photo: 0, name: "", text: "" }}>
              {(i, base, tile) => {
                const facility = facilityById(tile.facility);
                return (
                  <>
                    <label className="ahm-field">
                      <span>Facility</span>
                      <select
                        value={tile.facility}
                        onChange={(event) => {
                          const chosen = facilityById(event.target.value);
                          set(base, { ...tile, facility: event.target.value, photo: 0, name: tile.name || chosen?.label || "" });
                        }}
                      >
                        <option value="">Choose a facility...</option>
                        {options.facilities.map((item) => <option key={item._id} value={item._id}>{item.label}</option>)}
                      </select>
                    </label>
                    {facility && (
                      <div className="ahm-field">
                        <span>Photo (from the Facilities page)</span>
                        <div className="ahm-photos">
                          {facility.photos.map((photo, number) => (
                            <button key={number} type="button" className={tile.photo === number ? "is-picked" : ""} aria-pressed={tile.photo === number} aria-label={`Photo ${number + 1}`} onClick={() => set([...base, "photo"], number)}>
                              <img src={mediaUrl(photo)} alt="" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    <Text label="Tile name" path={[...base, "name"]} />
                    <Text label="Tile text" path={[...base, "text"]} area />
                  </>
                );
              }}
            </Rows>
          </Card>

          <Card title="Courses" parts={[["sectionContent", "courses"], ["courses"]]}>
            <Text label="Small heading" path={["sectionContent", "courses", "eyebrow"]} />
            <Text label="Title" path={["sectionContent", "courses", "title"]} />
            <Text label="Description" path={["sectionContent", "courses", "description"]} area />
            <Rows path={["courses"]} noun="Course" blank={{ id: "", name: "", seats: 0, tag: "", text: "" }}>
              {(i, base, course) => (
                <>
                  <div className="ahm-two">
                    <Text label="Course name" path={[...base, "name"]} />
                    <Text label="Page name in the link (/departments/...)" path={[...base, "id"]} />
                  </div>
                  <div className="ahm-two">
                    <Text label="Seats (0 = show the label instead)" path={[...base, "seats"]} number />
                    <Text label="Label when no seats (for example Foundation)" path={[...base, "tag"]} />
                  </div>
                  <Text label="Text on the back of the card" path={[...base, "text"]} area />
                </>
              )}
            </Rows>
          </Card>

          <Card title="Recruiters" parts={[["sectionContent", "recruiters"], ["recruiters"]]}>
            <Text label="Small heading" path={["sectionContent", "recruiters", "eyebrow"]} />
            <Text label="Title" path={["sectionContent", "recruiters", "title"]} />
            <Rows path={["recruiters"]} noun="Company" blank={{ name: "", logo: "" }}>
              {(i, base) => (
                <>
                  <Text label="Company name" path={[...base, "name"]} />
                  <Image label="Logo" path={[...base, "logo"]} />
                </>
              )}
            </Rows>
          </Card>

          <div className="ahm-save">
            <span className={message.error ? "is-error" : ""} role="status">
              {message.text || (changed ? "You have unsaved changes" : "No unsaved changes")}
            </span>
            <button type="button" className="ahm-btn" onClick={discard} disabled={!changed || saving}>Discard</button>
            <button type="button" className="ahm-btn ahm-btn--save" onClick={save} disabled={!changed || saving}>{saving ? "Saving..." : "Save changes"}</button>
          </div>
        </div>
      </Editor.Provider>
    </AdminSidebar>
  );
}