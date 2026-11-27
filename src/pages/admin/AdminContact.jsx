import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronRight, FiPlus, FiTrash2 } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import { getContactPage, saveContactPage, saveContactBanner } from "../../services/contactPageService";
import { mediaUrl, uploadHomeImage } from "../../services/homeService";
import "./AdminHome.css";
import "./AdminContact.css";

const builtIn = {
  intro: {
    eyebrow: "About us",
    title: "Contact us",
    lead: "Call, write or visit the institute office. Everything you need to find us is on this page.",
  },
  topics: ["Admissions", "Courses and fees", "Results and exams", "Something else"],
};
const DEFAULT_BANNER = "/images/campus-2.jpg";
const MAX_BANNER_SIZE = 5 * 1024 * 1024;

function Card({ title, open, setOpen, count, children }) {
  return (
    <section className={`ahm-card${open ? " is-open" : ""}`}>
      <button type="button" className="ahm-card__head" aria-expanded={open} onClick={() => setOpen(open ? "" : title)}>
        <h3>{title}</h3><span>{count} fields <FiChevronRight aria-hidden="true" /></span>
      </button>
      {open && <div className="ahm-card__body">{children}</div>}
    </section>
  );
}

export default function AdminContact() {
  const bannerInput = useRef(null);
  const [draft, setDraft] = useState(null);
  const [saved, setSaved] = useState("");
  const [open, setOpen] = useState("Page text");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });
  const [bannerImage, setBannerImage] = useState(DEFAULT_BANNER);
  const [savedBanner, setSavedBanner] = useState(DEFAULT_BANNER);
  const [bannerBusy, setBannerBusy] = useState(false);
  const [bannerMessage, setBannerMessage] = useState({ text: "", error: false });

  useEffect(() => {
    getContactPage()
      .then((page) => {
        const start = {
          intro: { ...builtIn.intro, ...(page.intro || {}) },
          topics: Array.isArray(page.topics) && page.topics.length ? page.topics : builtIn.topics,
        };
        setDraft(start);
        setSaved(JSON.stringify(start));
        const currentBanner = page.bannerImage || DEFAULT_BANNER;
        setBannerImage(currentBanner);
        setSavedBanner(currentBanner);
      })
      .catch(() => {
        setDraft(structuredClone(builtIn));
        setSaved(JSON.stringify(builtIn));
        setMessage({ text: "Cannot reach the server. Showing the built-in Contact page text.", error: true });
        setBannerMessage({ text: "Cannot reach the server. Showing the default banner.", error: true });
      });
  }, []);

  useEffect(() => {
    const warn = (event) => {
      if (draft && JSON.stringify(draft) !== saved) event.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [draft, saved]);

  if (!draft) return <AdminSidebar title="Contact us"><div className="ahm-loading">Loading Contact page text...</div></AdminSidebar>;

  const setIntro = (key, value) => setDraft((current) => ({ ...current, intro: { ...current.intro, [key]: value } }));
  const setTopic = (index, value) => setDraft((current) => ({ ...current, topics: current.topics.map((topic, i) => i === index ? value : topic) }));
  const changed = JSON.stringify(draft) !== saved;
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
      setBannerImage(await uploadHomeImage(file));
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
      const { page } = await saveContactBanner(bannerImage);
      const current = page?.bannerImage || DEFAULT_BANNER;
      setBannerImage(current);
      setSavedBanner(current);
      setBannerMessage({ text: "Contact banner saved.", error: false });
    } catch (saveError) {
      setBannerMessage({ text: saveError.message, error: true });
    } finally {
      setBannerBusy(false);
    }
  };
  const save = async () => {
    setSaving(true);
    try {
      await saveContactPage(draft);
      setSaved(JSON.stringify(draft));
      setMessage({ text: "Saved. The Contact page has been updated.", error: false });
    } catch (error) { setMessage({ text: error.message, error: true }); }
    finally { setSaving(false); }
  };

  return (
    <AdminSidebar title="Contact us">
      <section className="acnt-page" aria-labelledby="acnt-heading">
        <section className="ahm-card is-open acnt-banner">
          <div className="ahm-card__body">
            <h3 className="acnt-banner__title">Contact hero banner</h3>
            <div className="ahm-image__box acnt-banner__preview">
              <img src={mediaUrl(bannerImage) || DEFAULT_BANNER} alt="Contact banner preview" />
            </div>
            <p className="ahm-hint acnt-banner__hint">Best size: 1920 x 1080 px (16:9), JPG or WebP, under 5 MB.</p>
            <p className={bannerMessage.error ? "acnt-banner__message is-error" : "acnt-banner__message"} role="status">{bannerMessage.text || (bannerImage !== savedBanner ? "You have unsaved changes." : "")}</p>
            <div className="acnt-banner__actions">
              <input ref={bannerInput} type="file" accept="image/*" onChange={uploadBanner} disabled={bannerBusy} aria-label="Choose Contact banner image" tabIndex={-1} className="acnt-banner__file" />
              <button type="button" className="ahm-btn acnt-banner__button" onClick={() => bannerInput.current?.click()} disabled={bannerBusy}>Change banner</button>
              <button type="button" className="ahm-btn acnt-banner__button" onClick={() => { setBannerImage(DEFAULT_BANNER); setBannerMessage({ text: "", error: false }); }} disabled={bannerBusy || bannerImage === DEFAULT_BANNER}>Use default banner</button>
              <button type="button" className="ahm-btn ahm-btn--save acnt-banner__button" onClick={saveBanner} disabled={bannerBusy || bannerImage === savedBanner}>{bannerBusy ? "Working..." : "Save banner"}</button>
            </div>
          </div>
        </section>
        <div className="ahm-top"><h2 id="acnt-heading">Contact page</h2></div>
        <p className="acnt-note">Phone numbers, email, address, map, social links and feedback forms are edited in <Link to="/admin/site-settings">Site settings</Link>.</p>
        {message.text && <p className={`acnt-message${message.error ? " is-error" : ""}`}>{message.text}</p>}
        <Card title="Page text" open={open === "Page text"} setOpen={setOpen} count={3}>
          <label className="ahm-field"><span>Eyebrow</span><input value={draft.intro.eyebrow ?? ""} onChange={(event) => setIntro("eyebrow", event.target.value)} /></label>
          <label className="ahm-field"><span>Title</span><input value={draft.intro.title ?? ""} onChange={(event) => setIntro("title", event.target.value)} /></label>
          <label className="ahm-field"><span>Lead</span><textarea rows="3" value={draft.intro.lead ?? ""} onChange={(event) => setIntro("lead", event.target.value)} /></label>
        </Card>
        <Card title="Form topics" open={open === "Form topics"} setOpen={setOpen} count={draft.topics.length}>
          <div className="ahm-field"><span>Enquiry topics</span><div className="ahm-rows">
            {draft.topics.map((topic, index) => (
              <div className="acnt-topic" key={index}>
                <input value={topic} onChange={(event) => setTopic(index, event.target.value)} aria-label={`Topic ${index + 1}`} />
                <button type="button" onClick={() => setDraft((current) => ({ ...current, topics: current.topics.filter((_, i) => i !== index) }))} aria-label={`Remove topic ${index + 1}`}><FiTrash2 /></button>
              </div>
            ))}
            {draft.topics.length < 8 && <button type="button" className="ahm-btn ahm-btn--add" onClick={() => setDraft((current) => ({ ...current, topics: [...current.topics, ""] }))}><FiPlus /> Add topic</button>}
          </div></div>
        </Card>
        <div className="acnt-actions">
          <button type="button" className="ahm-btn" disabled={!changed || saving} onClick={save}>{saving ? "Saving..." : "Save changes"}</button>
          <button type="button" className="ahm-btn" disabled={!changed} onClick={() => { setDraft(JSON.parse(saved)); setMessage({ text: "", error: false }); }}>Discard</button>
        </div>
      </section>
    </AdminSidebar>
  );
}
