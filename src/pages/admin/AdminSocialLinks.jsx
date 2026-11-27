import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiExternalLink, FiUpload } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import { getMedia, mediaUrl, savePageBanner, saveSocialLinks, uploadMediaImage } from "../../services/mediaService";
import "./AdminSocialLinks.css";

const PLATFORMS = [
  ["facebook", "Facebook"], ["instagram", "Instagram"], ["youtube", "YouTube"],
  ["twitter", "X / Twitter"], ["linkedin", "LinkedIn"], ["whatsapp", "WhatsApp"], ["other", "Other"],
];
const blankLink = () => ({ platform: "facebook", label: "", url: "", handle: "", description: "", topics: [], accent: "sky", cta: "Visit page", published: true });

export default function AdminSocialLinks() {
  const [links, setLinks] = useState([]);
  const [banner, setBanner] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });
  const say = (text, error = false) => setMessage({ text, error });

  useEffect(() => {
    let active = true;
    getMedia().then(({ media }) => { if (active) { setLinks((media?.socialLinks || []).map((item) => ({ ...item, topics: item.topics || [] }))); setBanner(media?.banners?.socialLinks || ""); } })
      .catch((error) => { if (active) say(error.message, true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const edit = (index, patch) => setLinks((items) => items.map((item, i) => i === index ? { ...item, ...patch } : item));
  const add = () => { setLinks((items) => [...items, blankLink()]); say("Add the platform name and its official URL, then save."); };
  const remove = (index) => {
    const link = links[index];
    if (!window.confirm(`Remove “${link.label || "this social link"}”?`)) return;
    setLinks((items) => items.filter((_, i) => i !== index));
    say("Social link removed from the draft. Save changes to confirm deletion.");
  };
  const updateBanner = async (event) => {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const src = await uploadMediaImage(file);
      const result = await savePageBanner("socialLinks", src);
      setBanner(result.banner || src);
      say("Social Links page banner updated successfully.");
    } catch (error) { say(error.message, true); }
    finally { setBusy(false); }
  };

  const removeBanner = async () => {
    if (!banner || !window.confirm("Remove the Social Links custom banner? The existing website banner will be shown instead.")) return;
    setBusy(true);
    try {
      await savePageBanner("socialLinks", "");
      setBanner("");
      say("Custom banner removed. The existing website banner is now shown.");
    } catch (error) { say(error.message, true); }
    finally { setBusy(false); }
  };

  const save = async () => {
    setBusy(true);
    try { const result = await saveSocialLinks(links); setLinks((result.socialLinks || []).map((item) => ({ ...item, topics: item.topics || [] }))); say("Social links updated. Header and footer links are kept in sync."); }
    catch (error) { say(error.message, true); }
    finally { setBusy(false); }
  };

  return <AdminSidebar title="Social links"><main className="am-page">
    <header className="am-heading"><div><h2>Social links management</h2><p>Add, update, hide or remove the institute's official social accounts.</p></div><a className="am-view" href="/media/social" target="_blank" rel="noreferrer">View live page ↗</a></header>
    {message.text && <p className={`am-message${message.error ? " is-error" : ""}`} role="status">{message.text}</p>}
    <section className="am-panel am-banner-panel">
      <div className="am-panel__head"><div><h3>Social Links page banner</h3><p>Upload or replace this page's banner. Removing it shows the existing frontend banner.</p></div></div>
      <div className="am-banner-preview"><img src={banner ? mediaUrl(banner) : "/images/campus-workshop.jpg"} alt="Social Links page banner preview" /></div>
      <div className="am-actions">
        <label className="am-upload"><FiUpload /> {banner ? "Replace banner" : "Upload banner"}<input type="file" accept="image/*" onChange={updateBanner} disabled={busy} /></label>
        {banner && <button type="button" className="am-btn am-btn--danger" onClick={removeBanner} disabled={busy}><FiTrash2 /> Remove custom banner</button>}
      </div>
    </section>
    <section className="am-panel">
      <div className="am-panel__head"><div><h3>Official social links ({links.length})</h3><p>Choose from the existing platform options. New platform types cannot be created.</p></div><button type="button" className="am-btn" onClick={add} disabled={busy}><FiPlus /> Add social link</button></div>
      {loading ? <p className="am-empty">Loading social links…</p> : links.length ? <div className="am-grid">
        {links.map((item, index) => <article className="am-item" key={item._id || `social-${index}`}>
          <div className="am-row">
            <label className="am-field">Platform<select value={item.platform || "other"} onChange={(event) => edit(index, { platform: event.target.value })}>{PLATFORMS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label className="am-field">Card label<input value={item.label || ""} onChange={(event) => edit(index, { label: event.target.value })} placeholder="Facebook" /></label>
          </div>
          <label className="am-field">Official URL<input type="url" value={item.url || ""} onChange={(event) => edit(index, { url: event.target.value })} placeholder="https://..." /></label>
          <label className="am-field">Account name / handle<input value={item.handle || ""} onChange={(event) => edit(index, { handle: event.target.value })} placeholder="@crprohtak" /></label>
          <label className="am-field">Description<textarea value={item.description || ""} onChange={(event) => edit(index, { description: event.target.value })} placeholder="What visitors will find on this page" /></label>
          <label className="am-field">Topics (comma separated, up to 4)<input value={(item.topics || []).join(", ")} onChange={(event) => edit(index, { topics: event.target.value.split(",").map((topic) => topic.trim()).filter(Boolean).slice(0, 4) })} placeholder="Campus life, Events, Updates" /></label>
          <div className="am-row">
            <label className="am-field">Card accent<select value={item.accent || "sky"} onChange={(event) => edit(index, { accent: event.target.value })}><option value="sky">Sky blue</option><option value="orange">Orange</option></select></label>
            <label className="am-field">Button label<input value={item.cta || "Visit page"} onChange={(event) => edit(index, { cta: event.target.value })} /></label>
          </div>
          <label className="am-check"><input type="checkbox" checked={item.published !== false} onChange={(event) => edit(index, { published: event.target.checked })} /> Show on public Social Links page</label>
          <div className="am-actions"><button type="button" className="am-btn am-btn--danger" onClick={() => remove(index)} disabled={busy}><FiTrash2 /> Remove link</button>{item.url && <a className="am-btn" href={item.url} target="_blank" rel="noreferrer"><FiExternalLink /> Open link</a>}</div>
        </article>)}
      </div> : <p className="am-empty">No social links yet. Add an official account.</p>}
    </section>
    <div className="am-savebar"><button type="button" className="am-btn am-btn--primary" onClick={save} disabled={busy || loading}>{busy ? "Saving…" : "Save social links"}</button></div>
  </main></AdminSidebar>;
}
