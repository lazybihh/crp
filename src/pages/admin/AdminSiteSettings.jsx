import { useEffect, useState } from "react";
import { FiChevronRight, FiPlus, FiTrash2, FiUpload } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import siteDefaults from "../../data/siteDefaults";
import { getSiteSettings, saveSiteSettings, uploadHomeImage, mediaUrl } from "../../services/settingsService";
import "./AdminHome.css";
import "./AdminSiteSettings.css";

const getIn = (obj, path) => path.reduce((value, key) => value?.[key], obj);
const setIn = (obj, path, value) => {
  if (!path.length) return value;
  const [key, ...rest] = path;
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  copy[key] = setIn(obj?.[key], rest, value);
  return copy;
};

function Card({ title, open, setOpen, children, count }) {
  return (
    <section className={`ass-card${open ? " is-open" : ""}`}>
      <button type="button" className="ass-card__head" aria-expanded={open} onClick={() => setOpen(open ? "" : title)}>
        <h3>{title}</h3>
        <span>{count} fields <FiChevronRight aria-hidden="true" /></span>
      </button>
      {open && <div className="ass-card__body">{children}</div>}
    </section>
  );
}

function Field({ label, value, onChange, area, type = "text" }) {
  return (
    <label className="ass-field">
      <span>{label}</span>
      {area ? <textarea rows="3" value={value ?? ""} onChange={(event) => onChange(event.target.value)} />
        : <input type={type} value={value ?? ""} onChange={(event) => onChange(event.target.value)} />}
    </label>
  );
}

export default function AdminSiteSettings() {
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState("");
  const [open, setOpen] = useState("Institute");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });

  useEffect(() => {
    getSiteSettings()
      .then((data) => {
        const start = structuredClone({
          ...siteDefaults,
          ...data,
          institute: { ...siteDefaults.institute, ...data.institute },
          contact: { ...siteDefaults.contact, ...data.contact },
          socialLinks: data.socialLinks ?? siteDefaults.socialLinks,
          links: { ...siteDefaults.links, ...data.links },
          images: { ...siteDefaults.images, ...data.images },
          headerButton: { ...siteDefaults.headerButton, ...data.headerButton },
        });
        setDraft(start);
        setSaved(JSON.stringify(start));
      })
      .catch((error) => setMessage({ text: error.message || "Cannot reach the server.", error: true }));
  }, []);

  useEffect(() => {
    const warn = (event) => {
      if (draft && JSON.stringify(draft) !== saved) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [draft, saved]);

  const set = (path, value) => {
    setDraft((current) => setIn(current, path, value));
    setMessage({ text: "", error: false });
  };
  const changed = draft && JSON.stringify(draft) !== saved;

  const save = async () => {
    setSaving(true);
    try {
      await saveSiteSettings(draft);
      setSaved(JSON.stringify(draft));
      setMessage({ text: "Saved. Site settings have been updated.", error: false });
    } catch (error) {
      setMessage({ text: error.message, error: true });
    } finally {
      setSaving(false);
    }
  };

  const discard = () => {
    setDraft(JSON.parse(saved));
    setMessage({ text: "", error: false });
  };

  const addPhone = () => set(["contact", "phones"], [...(draft.contact.phones || []), ""]);
  const removePhone = (index) => set(["contact", "phones"], draft.contact.phones.filter((_, i) => i !== index));

  const uploadImage = async (path, event) => {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    try { set(path, await uploadHomeImage(file)); }
    catch (error) { setMessage({ text: error.message, error: true }); }
  };

  if (!draft) return <AdminSidebar title="Site settings"><section className="ass-page"><p>Loading site settings...</p></section></AdminSidebar>;

  const phoneCount = (draft.contact.phones || []).filter(Boolean).length;
  const socialCount = (draft.socialLinks || []).filter((item) => item.url).length;

  return (
    <AdminSidebar title="Site settings">
      <section className="ass-page" aria-labelledby="ass-heading">
        <div className="ass-heading"><h2 id="ass-heading">Site settings</h2></div>
        {message.text && <p className={`ass-message${message.error ? " is-error" : ""}`}>{message.text}</p>}

        <Card title="Institute" open={open === "Institute"} setOpen={setOpen} count={7}>
          <Field label="Institute name" value={draft.institute.name} onChange={(v) => set(["institute", "name"], v)} />
          <Field label="City" value={draft.institute.city} onChange={(v) => set(["institute", "city"], v)} />
          <Field label="City line" value={draft.institute.cityLine} onChange={(v) => set(["institute", "cityLine"], v)} />
          <Field label="Tagline" value={draft.institute.tagline} onChange={(v) => set(["institute", "tagline"], v)} />
          <Field label="Approved by" value={draft.institute.approvedBy} onChange={(v) => set(["institute", "approvedBy"], v)} />
          <Field label="Affiliated to" value={draft.institute.affiliatedTo} onChange={(v) => set(["institute", "affiliatedTo"], v)} />
          <Field label="Established year" value={draft.institute.establishedYear} onChange={(v) => set(["institute", "establishedYear"], v)} />
        </Card>

        <Card title="Contact" open={open === "Contact"} setOpen={setOpen} count={phoneCount + 7}>
          <div className="ass-rows">
            {(draft.contact.phones || []).map((phone, index) => (
              <div className="ass-phone" key={index}>
                <Field label={`Phone ${index + 1}`} value={phone} onChange={(v) => set(["contact", "phones", index], v)} />
                <button type="button" aria-label={`Remove phone ${index + 1}`} onClick={() => removePhone(index)}><FiTrash2 /></button>
              </div>
            ))}
            <button type="button" className="ass-btn" onClick={addPhone}><FiPlus /> Add phone</button>
          </div>
          <Field label="Main email" type="email" value={draft.contact.email} onChange={(v) => set(["contact", "email"], v)} />
          <Field label="Alumni email" type="email" value={draft.contact.alumniEmail} onChange={(v) => set(["contact", "alumniEmail"], v)} />
          <Field label="Address line 1" value={draft.contact.addressLines?.[0]} onChange={(v) => set(["contact", "addressLines", 0], v)} />
          <Field label="Address line 2" value={draft.contact.addressLines?.[1]} onChange={(v) => set(["contact", "addressLines", 1], v)} />
          <Field label="Map link" value={draft.contact.mapUrl} onChange={(v) => set(["contact", "mapUrl"], v)} />
          <Field label="Directions link" value={draft.contact.directionsUrl} onChange={(v) => set(["contact", "directionsUrl"], v)} />
          <Field label="Map embed" area value={draft.contact.mapEmbed} onChange={(v) => set(["contact", "mapEmbed"], v)} />
        </Card>

        <Card title="Social links" open={open === "Social links"} setOpen={setOpen} count={socialCount}>
          {(draft.socialLinks || []).map((item, index) => (
            <div className="ass-row" key={index}>
              <Field label="Platform" value={item.platform} onChange={(v) => set(["socialLinks", index, "platform"], v)} />
              <Field label="Label" value={item.label} onChange={(v) => set(["socialLinks", index, "label"], v)} />
              <Field label="Link" value={item.url} onChange={(v) => set(["socialLinks", index, "url"], v)} />
              <button type="button" aria-label={`Remove ${item.label || "social link"}`} onClick={() => set(["socialLinks"], draft.socialLinks.filter((_, i) => i !== index))}><FiTrash2 /></button>
            </div>
          ))}
          <button type="button" className="ass-btn" onClick={() => set(["socialLinks"], [...(draft.socialLinks || []), { platform: "facebook", label: "", url: "" }])}><FiPlus /> Add social link</button>
        </Card>

        <Card title="Important links" open={open === "Important links"} setOpen={setOpen} count={9}>
          {[
            ["payFee", "Pay online fee"], ["admissionPortal", "Admission portal"], ["hsbte", "HSBTE"], ["hstes", "HSTES"], ["aicte", "AICTE"], ["hrms", "HRMS"],
            ["facultyFeedbackForm", "Faculty feedback form"], ["studentFeedbackForm", "Student feedback form"], ["grievanceForm", "Grievance form"],
          ].map(([key, label]) => <Field key={key} label={label} value={draft.links[key]} onChange={(v) => set(["links", key], v)} />)}
        </Card>

        <Card title="Logo and images" open={open === "Logo and images"} setOpen={setOpen} count={3}>
          {[
            ["logo", "Logo"], ["loadingAnimation", "Loading animation"], ["tabIcon", "Tab icon"],
          ].map(([key, label]) => (
            <div className="ass-field" key={key}>
              <span>{label}</span>
              <div className="ass-image">
                <div className="ass-image__box">{draft.images[key] ? <img src={mediaUrl(draft.images[key])} alt="" /> : <em>No image</em>}</div>
                <label className="ass-btn"><FiUpload /> Change image<input type="file" accept="image/*" hidden onChange={(event) => uploadImage(["images", key], event)} /></label>
              </div>
              <input type="text" value={draft.images[key] ?? ""} onChange={(event) => set(["images", key], event.target.value)} />
            </div>
          ))}
        </Card>

        <Card title="Header button" open={open === "Header button"} setOpen={setOpen} count={3}>
          <Field label="Button text" value={draft.headerButton.label} onChange={(v) => set(["headerButton", "label"], v)} />
          <Field label="Button link" value={draft.headerButton.link} onChange={(v) => set(["headerButton", "link"], v)} />
          <label className="ass-toggle"><input type="checkbox" checked={draft.headerButton.show !== false} onChange={(event) => set(["headerButton", "show"], event.target.checked)} /> Show Admissions Open button</label>
        </Card>

        <div className="ass-save">
          <button type="button" className="ass-btn ass-btn--save" disabled={!changed || saving} onClick={save}>{saving ? "Saving..." : "Save changes"}</button>
          <button type="button" className="ass-btn" disabled={!changed} onClick={discard}>Discard</button>
        </div>
      </section>
    </AdminSidebar>
  );
}
