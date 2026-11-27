import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiLink, FiUpload } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import { getMedia, mediaUrl, savePageBanner, saveVideos, uploadMediaImage } from "../../services/mediaService";
import "./AdminVideos.css";

const blankVideo = () => ({ title: "", text: "", url: "", published: true });

export default function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [banner, setBanner] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });
  const say = (text, error = false) => setMessage({ text, error });

  useEffect(() => {
    let active = true;
    getMedia().then(({ media }) => { if (active) { setVideos((media?.videos || []).map((video) => ({ ...video }))); setBanner(media?.banners?.videos || ""); } })
      .catch((error) => { if (active) say(error.message, true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const edit = (index, patch) => setVideos((items) => items.map((video, i) => i === index ? { ...video, ...patch } : video));
  const add = () => { setVideos((items) => [...items, blankVideo()]); say("Add a title and a YouTube or Vimeo link, then save."); };
  const remove = (index) => {
    const video = videos[index];
    if (!window.confirm(`Remove “${video.title || "this video link"}” from the Videos page?`)) return;
    setVideos((items) => items.filter((_, i) => i !== index));
    say("Video link removed from the draft. Save changes to confirm deletion.");
  };
  const updateBanner = async (event) => {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const src = await uploadMediaImage(file);
      const result = await savePageBanner("videos", src);
      setBanner(result.banner || src);
      say("Videos page banner updated successfully.");
    } catch (error) { say(error.message, true); }
    finally { setBusy(false); }
  };

  const removeBanner = async () => {
    if (!banner || !window.confirm("Remove the Videos custom banner? The existing website banner will be shown instead.")) return;
    setBusy(true);
    try {
      await savePageBanner("videos", "");
      setBanner("");
      say("Custom banner removed. The existing website banner is now shown.");
    } catch (error) { say(error.message, true); }
    finally { setBusy(false); }
  };

  const save = async () => {
    setBusy(true);
    try { const result = await saveVideos(videos); setVideos((result.videos || []).map((video) => ({ ...video }))); say("Video links updated successfully."); }
    catch (error) { say(error.message, true); }
    finally { setBusy(false); }
  };

  return <AdminSidebar title="Videos"><main className="am-page">
    <header className="am-heading"><div><h2>Videos management</h2><p>Manage the video cards using external YouTube or Vimeo links. Video files cannot be uploaded here.</p></div><a className="am-view" href="/media/videos" target="_blank" rel="noreferrer">View live page ↗</a></header>
    {message.text && <p className={`am-message${message.error ? " is-error" : ""}`} role="status">{message.text}</p>}
    <section className="am-panel am-banner-panel">
      <div className="am-panel__head"><div><h3>Videos page banner</h3><p>Upload or replace this page's banner. Removing it shows the existing frontend banner.</p></div></div>
      <div className="am-banner-preview"><img src={banner ? mediaUrl(banner) : "/images/campus-2.jpg"} alt="Videos page banner preview" /></div>
      <div className="am-actions">
        <label className="am-upload"><FiUpload /> {banner ? "Replace banner" : "Upload banner"}<input type="file" accept="image/*" onChange={updateBanner} disabled={busy} /></label>
        {banner && <button type="button" className="am-btn am-btn--danger" onClick={removeBanner} disabled={busy}><FiTrash2 /> Remove custom banner</button>}
      </div>
    </section>
    <section className="am-panel">
      <div className="am-panel__head"><div><h3>Video links ({videos.length})</h3><p>Paste a full YouTube or Vimeo URL. You can edit, hide, add or remove links.</p></div><button type="button" className="am-btn" onClick={add} disabled={busy}><FiPlus /> Add video link</button></div>
      {loading ? <p className="am-empty">Loading video links…</p> : videos.length ? <div className="am-grid">
        {videos.map((video, index) => <article className="am-item" key={video._id || `video-${index}`}>
          <label className="am-field">Video title<input value={video.title || ""} onChange={(event) => edit(index, { title: event.target.value })} placeholder="Campus introduction" /></label>
          <label className="am-field">Short description<textarea value={video.text || ""} onChange={(event) => edit(index, { text: event.target.value })} placeholder="A short line about this video" /></label>
          <label className="am-field">YouTube / Vimeo link<input type="url" value={video.url || ""} onChange={(event) => edit(index, { url: event.target.value })} placeholder="https://www.youtube.com/watch?v=..." /></label>
          <label className="am-check"><input type="checkbox" checked={video.published !== false} onChange={(event) => edit(index, { published: event.target.checked })} /> Show on public Videos page</label>
          <div className="am-actions"><button type="button" className="am-btn am-btn--danger" onClick={() => remove(index)} disabled={busy}><FiTrash2 /> Remove link</button>{video.url && <a className="am-btn" href={video.url} target="_blank" rel="noreferrer"><FiLink /> Open link</a>}</div>
        </article>)}
      </div> : <p className="am-empty">No video links yet. Add a YouTube or Vimeo link to begin.</p>}
    </section>
    <div className="am-savebar"><button type="button" className="am-btn am-btn--primary" onClick={save} disabled={busy || loading}>{busy ? "Saving…" : "Save video changes"}</button></div>
  </main></AdminSidebar>;
}
