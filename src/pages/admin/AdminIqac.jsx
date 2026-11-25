import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { uploadHomeImage, mediaUrl } from "../../services/homeService";
import { getService, saveService } from "../../services/facultyContentService";
import "./AdminIqac.css";

const PAGE_KEY = "iqac";
const PAGE_TITLE = "IQAC";
const PREVIEW_URL = "/faculty/iqac";
const clone = (value) => JSON.parse(JSON.stringify(value));

const fieldGroups = [
  { title: "Page heading", description: "The title and introductory copy shown near the top of the public page.", fields: [
    ["title", "Main title", "text"], ["accent", "Highlighted title", "text"], ["description", "Introduction", "textarea"]
  ]},
  { title: "Hero banner", description: "Preview and replace the banner photo, then update its labels.", fields: [["heroLeft", "Left banner label", "text"], ["heroRight", "Right banner label", "text"]
  ]},
  { title: "Featured content", description: "The main highlighted information panel.", fields: [
    ["featureKicker", "Small label", "text"], ["featureTitle", "Feature heading", "text"], ["featureText", "Feature description", "textarea"], ["featureNumber", "Feature number", "text"]
  ]},
  { title: "Main information section", description: "The heading and supporting description above the information cards.", fields: [
    ["sectionEyebrow", "Small section label", "text"], ["sectionTitle", "Section heading", "text"], ["sectionText", "Section description", "textarea"]
  ]},
  { title: "Information note", description: "The note or important information panel near the bottom of the page.", fields: [
    ["noteTitle", "Note heading", "text"], ["noteText", "Note description", "textarea"]
  ]},
  { title: "Related links heading", description: "Heading used above the related page links.", fields: [
    ["relatedTitle", "Related links heading", "text"]
  ]}
];

export default function AdminIqac() {
  const [content, setContent] = useState(null);
  const [savedContent, setSavedContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [activeSection, setActiveSection] = useState("Page heading");

  const dirty = useMemo(() => content && savedContent && JSON.stringify(content) !== JSON.stringify(savedContent), [content, savedContent]);

  useEffect(() => {
    let mounted = true;
    getService(PAGE_KEY)
      .then((row) => {
        if (!mounted) return;
        const value = row?.content || row;
        setContent(clone(value));
        setSavedContent(clone(value));
      })
      .catch((error) => { if (mounted) { setMessage(error.message || "Could not load page content."); setIsError(true); } })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const update = (field, value) => setContent((current) => ({ ...current, [field]: value }));
  const updateItem = (field, index, property, value) => setContent((current) => ({
    ...current,
    [field]: (current[field] || []).map((item, itemIndex) => itemIndex === index
      ? (typeof item === "string" ? value : { ...item, [property]: value })
      : item)
  }));

  const save = async (event) => {
    event.preventDefault();
    if (!content) return;
    setSaving(true); setMessage(""); setIsError(false);
    try {
      const savedRow = await saveService(PAGE_KEY, content);
      const confirmedContent = savedRow?.content || content;
      setContent(clone(confirmedContent));
      setSavedContent(clone(confirmedContent));
      setMessage("Your changes have been saved successfully.");
    } catch (error) {
      setMessage(error.message || "Unable to save changes. Please check the API connection.");
      setIsError(true);
    } finally { setSaving(false); }
  };

  const discard = () => {
    if (!savedContent) return;
    setContent(clone(savedContent));
    setMessage("Unsaved changes were discarded.");
    setIsError(false);
  };

  const uploadBanner = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setMessage("Uploading banner image…");
    setIsError(false);
    try {
      const imageUrl = await uploadHomeImage(file);
      update("heroImage", imageUrl);
      setMessage("Banner uploaded. Save changes to publish it.");
    } catch (error) {
      setMessage(error.message || "Banner upload failed.");
      setIsError(true);
    }
  };

  const renderField = ([field, label, type]) => (
    <div className={`fca-field ${type === "textarea" ? "fca-field--wide" : ""}`} key={field}>
      <span>{label}</span>
      {type === "textarea"
        ? <textarea rows={4} value={content[field] ?? ""} onChange={(event) => update(field, event.target.value)} />
        : <input value={content[field] ?? ""} onChange={(event) => update(field, event.target.value)} />}
    </div>
  );

  return (
    <AdminSidebar title={PAGE_TITLE}>
      <main className="fca-page">
        <header className="fca-header">
          <div className="fca-heading-copy">
            <div className="fca-eyebrow">FACULTY CONTENT MANAGER <span> / </span> {"service" === "policy" ? "POLICIES & RULES" : "SERVICES"}</div>
            <h2>Edit {PAGE_TITLE}</h2>
            <p>Manage the content displayed on the public {PAGE_TITLE} page.</p>
          </div>
          <a className="fca-preview" href={PREVIEW_URL} target="_blank" rel="noopener noreferrer">Preview live page <span aria-hidden="true">↗</span></a>
        </header>

        <div className="fca-statusbar">
          <div className="fca-status-left"><span className={`fca-status-dot ${dirty ? "is-dirty" : ""}`} />
            <span>{dirty ? "You have unsaved changes" : "All changes saved"}</span>
          </div>
          <span className="fca-status-meta">Page ID: <b>{PAGE_KEY}</b></span>
        </div>

        {message && <div className={`fca-message ${isError ? "is-error" : "is-success"}`} role="status">{message}</div>}

        {loading ? <section className="fca-loading"><span className="fca-spinner" /> Loading page content…</section> : !content ? (
          <section className="fca-load-error"><h3>Content could not be loaded</h3><p>{message || "Check that the backend server is running and the faculty API routes are connected."}</p><button type="button" onClick={() => window.location.reload()}>Try again</button></section>
        ) : (
          <form onSubmit={save} className="fca-form">
            <section className="fca-overview">
              <div className="fca-overview-icon">✎</div>
              <div><span>EDITING PAGE</span><h3>{content.title || PAGE_TITLE} {content.accent || ""}</h3><p>{content.description || "Add a short introduction for this page."}</p></div>
              <div className="fca-overview-tag">{"service" === "policy" ? "Policy page" : "Service page"}</div>
            </section>

            <div className="fca-layout">
              <aside className="fca-nav-card">
                <div className="fca-nav-title">CONTENT SECTIONS</div>
                {fieldGroups.map((group, index) => (
                  <button type="button" key={group.title} className={`fca-nav-item ${activeSection === group.title ? "is-active" : ""}`} onClick={() => { setActiveSection(group.title); const panel = document.getElementById(`fca-${index}`); if (panel) { panel.open = true; panel.scrollIntoView({ behavior: "smooth", block: "start" }); } }}>
                    <span className="fca-nav-number">{String(index + 1).padStart(2, "0")}</span><span>{group.title}</span><span className="fca-nav-chevron">›</span>
                  </button>
                ))}
                <div className="fca-nav-hint">Your page structure stays fixed. You can update the page content and replace its banner photo without changing the page structure.</div>
              </aside>

              <div className="fca-editor-column">
                {fieldGroups.map((group, index) => (
                  <details className="fca-panel fca-accordion" id={`fca-${index}`} key={group.title} open={index === 0 || group.title === "Hero banner"}>
                    <summary className="fca-panel-heading fca-accordion-summary"><div><span>SECTION {String(index + 1).padStart(2, "0")}</span><h3>{group.title}</h3><p>{group.description}</p></div><span className="fca-panel-check">✓</span><span className="fca-accordion-indicator" aria-hidden="true">⌄</span></summary>
                    <div className="fca-accordion-body">
                    <div className="fca-fields">{group.fields.map(renderField)}</div>
                    {group.title === "Hero banner" && (
                      <div className="fca-banner-manager">
                        <div className="fca-image-preview">
                          <div className="fca-image-preview-heading">
                            <span>Banner photo preview</span>
                            {content.heroImage && <small>Current image</small>}
                          </div>
                          {content.heroImage ? (
                            <img src={mediaUrl(content.heroImage)} alt="Current page banner" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                          ) : (
                            <div className="fca-image-empty">No banner photo selected yet.</div>
                          )}
                        </div>
                        <label className="fca-upload-button">
                          <span aria-hidden="true">↑</span> {content.heroImage ? "Change banner photo" : "Upload banner photo"}
                          <input type="file" accept="image/*" onChange={uploadBanner} />
                        </label>
                        <small className="fca-upload-help">Choose an image from your computer. The new photo will appear here; select Save changes to publish it.</small>
                      </div>
                    )}
                    </div>
                  </details>
                ))}

                <details className="fca-panel fca-accordion">
                  <summary className="fca-panel-heading fca-accordion-summary"><div><span>SECTION 07</span><h3>Information cards</h3><p>Edit the existing cards. Their number and layout are fixed.</p></div><span className="fca-fixed-tag">{(content.cards || []).length} FIXED CARDS</span><span className="fca-accordion-indicator" aria-hidden="true">⌄</span></summary>
                  <div className="fca-accordion-body">
                  <div className="fca-repeat-list">{(content.cards || []).map((card, index) => <article className="fca-repeat-card" key={index}><div className="fca-repeat-head"><b>Card {String(index + 1).padStart(2, "0")}</b><span>Existing item</span></div><label className="fca-field"><span>Card title</span><input value={card.title || ""} onChange={(event) => updateItem("cards", index, "title", event.target.value)} /></label><label className="fca-field"><span>Card description</span><textarea rows={3} value={card.text || ""} onChange={(event) => updateItem("cards", index, "text", event.target.value)} /></label></article>)}{(!content.cards || content.cards.length === 0) && <p className="fca-empty">This page currently has no information cards.</p>}</div>
                  </div>
                </details>

                <details className="fca-panel fca-accordion">
                  <summary className="fca-panel-heading fca-accordion-summary"><div><span>SECTION 08</span><h3>Process steps</h3><p>Edit the existing steps. You cannot add or remove steps from this editor.</p></div><span className="fca-fixed-tag">{(content.steps || []).length} FIXED STEPS</span><span className="fca-accordion-indicator" aria-hidden="true">⌄</span></summary>
                  <div className="fca-accordion-body">
                  <div className="fca-fields fca-step-fields">{(content.steps || []).map((step, index) => <label className="fca-field" key={index}><span>Step {index + 1}</span><input value={step} onChange={(event) => updateItem("steps", index, null, event.target.value)} /></label>)}{(!content.steps || content.steps.length === 0) && <p className="fca-empty">No process steps are configured for this page.</p>}</div>
                  <div className="fca-fields fca-link-fields">
                    <label className="fca-field"><span>Process label</span><input value={content.processEyebrow || ""} onChange={(event) => update("processEyebrow", event.target.value)} /></label>
                    <label className="fca-field"><span>Process heading</span><input value={content.processTitle || ""} onChange={(event) => update("processTitle", event.target.value)} /></label>
                  </div>
                  </div>
                </details>

                <details className="fca-panel fca-accordion">
                  <summary className="fca-panel-heading fca-accordion-summary"><div><span>SECTION 09</span><h3>Related page links</h3><p>Update the labels and destinations of existing links only.</p></div><span className="fca-fixed-tag">{(content.related || []).length} FIXED LINKS</span><span className="fca-accordion-indicator" aria-hidden="true">⌄</span></summary>
                  <div className="fca-accordion-body">
                  <div className="fca-repeat-list">{(content.related || []).map((link, index) => <article className="fca-link-row" key={index}><div className="fca-link-index">{index + 1}</div><label className="fca-field"><span>Link label</span><input value={link.label || ""} onChange={(event) => updateItem("related", index, "label", event.target.value)} /></label><label className="fca-field"><span>Destination URL</span><input value={link.url || ""} onChange={(event) => updateItem("related", index, "url", event.target.value)} /></label></article>)}{(!content.related || content.related.length === 0) && <p className="fca-empty">No related links are configured.</p>}</div>
                  </div>
                </details>



                <div className="fca-savebar"><div><strong>{dirty ? "You have unsaved edits" : "You're all caught up"}</strong><span>{dirty ? "Save your changes to publish them on the public page." : "Your latest saved content is up to date."}</span></div><div className="fca-save-actions"><button type="button" className="fca-btn fca-btn--light" onClick={discard} disabled={!dirty || saving}>Discard</button><button type="submit" className="fca-btn fca-btn--primary" disabled={saving || !dirty}>{saving ? "Saving…" : "Save changes"}</button></div></div>
              </div>
            </div>
          </form>
        )}
      </main>
    </AdminSidebar>
  );
}
