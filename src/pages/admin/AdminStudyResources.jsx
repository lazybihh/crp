import { useEffect, useMemo, useRef, useState } from "react";
import { FiBookOpen, FiPlus, FiTrash2, FiSave, FiRotateCcw, FiUpload, FiExternalLink, FiFileText, FiChevronRight } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import {
  getAllStudyResources, saveStudyResources, resetStudyResources, uploadStudyResourceFile, studyResourceFileUrl,
} from "../../services/studyResourceService";
import { uploadMediaImage } from "../../services/mediaService";
import "./AdminHome.css";
import "./AdminStudyResources.css";

const clone = (value) => JSON.parse(JSON.stringify(value));
const makeId = (value) => String(value || "category").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const blankTab = () => ({ id: `category-${Date.now()}`, label: "New category", filters: [{ value: 0, label: "All semesters" }], files: [] });
const blankFile = () => ({ name: "", semester: 0, file: "", source: "" });

export default function AdminStudyResources() {
  const [departments, setDepartments] = useState([]);
  const [slug, setSlug] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(-1);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [openCard, setOpenCard] = useState("details");
  const categoryCardRef = useRef(null);
  const categoryListRef = useRef(null);
  const activeCategoryRef = useRef(null);

  const activeTab = draft?.tabs?.[tabIndex];

  useEffect(() => {
    getAllStudyResources()
      .then((data) => {
        setDepartments(data);
        if (data.length) {
          setSlug(data[0].slug);
          setDraft(clone(data[0]));
        }
      })
      .catch((err) => setError(err.message || "Could not load study resources."))
      .finally(() => setLoading(false));
  }, []);

  const toggleCard = (id) => setOpenCard((current) => current === id ? "" : id);

  // Bring the expanded Categories & resources card into view automatically.
  useEffect(() => {
    if (openCard !== "categories" || !categoryCardRef.current) return;
    const frame = window.requestAnimationFrame(() => {
      categoryCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [openCard]);

  // Scroll the category list itself (not the whole page) to the selected item.
  useEffect(() => {
    const list = categoryListRef.current;
    const item = activeCategoryRef.current;
    if (openCard !== "categories" || !list || !item) return;

    const itemTop = item.offsetTop - list.offsetTop;
    const itemBottom = itemTop + item.offsetHeight;
    const visibleTop = list.scrollTop;
    const visibleBottom = visibleTop + list.clientHeight;

    if (itemTop < visibleTop) {
      list.scrollTo({ top: itemTop - 8, behavior: "smooth" });
    } else if (itemBottom > visibleBottom) {
      list.scrollTo({ top: itemBottom - list.clientHeight + 8, behavior: "smooth" });
    }
  }, [tabIndex, openCard, draft?.tabs?.length]);

  const changeDepartment = (nextSlug) => {
    const row = departments.find((item) => item.slug === nextSlug);
    setSlug(nextSlug);
    setDraft(row ? clone(row) : null);
    setTabIndex(0);
    setOpenCard("details");
    setMessage("");
    setError("");
  };

  const updateTab = (patch) => setDraft((current) => ({
    ...current,
    tabs: current.tabs.map((tab, index) => index === tabIndex ? { ...tab, ...patch } : tab),
  }));

  const updateFile = (index, patch) => updateTab({
    files: activeTab.files.map((file, fileIndex) => fileIndex === index ? { ...file, ...patch } : file),
  });

  const save = async () => {
    if (!draft) return;
    setSaving(true); setError(""); setMessage("");
    try {
      const saved = await saveStudyResources(slug, draft);
      setDepartments((items) => items.map((item) => item.slug === slug ? saved : item));
      setDraft(clone(saved));
      setMessage("Study resources saved successfully.");
    } catch (err) { setError(err.message || "Could not save changes."); }
    finally { setSaving(false); }
  };

  const reset = async () => {
    if (!window.confirm("Restore this department's original study resources? Your current edits will be replaced.")) return;
    setSaving(true); setError(""); setMessage("");
    try {
      const restored = await resetStudyResources(slug);
      setDepartments((items) => items.map((item) => item.slug === slug ? restored : item));
      setDraft(clone(restored)); setTabIndex(0);
      setMessage("Original resources restored.");
    } catch (err) { setError(err.message || "Could not reset resources."); }
    finally { setSaving(false); }
  };

  const addFilter = () => {
    const used = new Set(activeTab.filters.map((item) => Number(item.value)));
    const next = [0, 1, 2, 3, 4, 5, 6].find((value) => !used.has(value));
    if (next === undefined) return;
    updateTab({ filters: [...activeTab.filters, { value: next, label: next === 0 ? "All semesters" : `Semester ${next}` }] });
  };

  const updateFilter = (index, patch) => updateTab({
    filters: activeTab.filters.map((item, i) => i === index ? { ...item, ...patch } : item),
  });

  const uploadBanner = async (file) => {
    if (!file) return;
    setUploadingBanner(true); setError(""); setMessage("");
    try {
      const url = await uploadMediaImage(file);
      setDraft((current) => ({ ...current, heroImage: url }));
      setMessage("Banner image uploaded. Save changes to publish it.");
    } catch (err) { setError(err.message || "Banner upload failed."); }
    finally { setUploadingBanner(false); }
  };

  const uploadFile = async (index, file) => {
    if (!file) return;
    setUploading(index); setError(""); setMessage("");
    try {
      const url = await uploadStudyResourceFile(file);
      updateFile(index, { file: url, source: file.name, name: activeTab.files[index]?.name || file.name.replace(/\.[^.]+$/, "") });
      setMessage(`${file.name} uploaded. Save changes to publish it.`);
    } catch (err) { setError(err.message || "File upload failed."); }
    finally { setUploading(-1); }
  };

  const totals = useMemo(() => ({
    categories: draft?.tabs?.length || 0,
    files: draft?.tabs?.reduce((sum, tab) => sum + tab.files.length, 0) || 0,
  }), [draft]);

  return (
    <AdminSidebar title="Study resources">
      <section className="asr-page">
        <div className="asr-heading">
          <div>
            <span className="asr-eyebrow"><FiBookOpen /> CONTENT MANAGEMENT</span>
            <h2>Study resources</h2>
            <p>Manage department categories, semester filters and downloadable learning material from one place.</p>
          </div>
          <a className="asr-preview" href={slug ? `/students/departments/${slug}` : "#"} target="_blank" rel="noreferrer">
            View public page <FiExternalLink />
          </a>
        </div>

        {error && <div className="asr-alert is-error" role="alert">{error}</div>}
        {message && <div className="asr-alert is-success" role="status">{message}</div>}

        {loading ? <div className="asr-loading">Loading study resources…</div> : !draft ? (
          <div className="asr-empty">No study resource departments were found.</div>
        ) : <>
          <div className="asr-overview">
            <label className="asr-department">
              <span>Department</span>
              <select value={slug} onChange={(event) => changeDepartment(event.target.value)}>
                {departments.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
            </label>
            <div className="asr-stat"><strong>{totals.categories}</strong><span>Categories</span></div>
            <div className="asr-stat"><strong>{totals.files}</strong><span>Resources</span></div>

          </div>

          <section className={`ahm-card${openCard === "details" ? " is-open" : ""}`}>
            <button type="button" className="ahm-card__head" aria-expanded={openCard === "details"} onClick={() => toggleCard("details")}>
              <h3>Page details</h3><span>heading, introduction, banner <FiChevronRight /></span>
            </button>
            {openCard === "details" && <div className="ahm-card__body">
              <div className="asr-resource-grid">
                <div className="asr-field"><label>Eyebrow text</label><input value={draft.intro?.eyebrow || ""} onChange={(e) => setDraft({ ...draft, intro: { ...draft.intro, eyebrow: e.target.value } })} /></div>
                <div className="asr-field"><label>Main title</label><input value={draft.intro?.title || ""} onChange={(e) => setDraft({ ...draft, intro: { ...draft.intro, title: e.target.value }, name: e.target.value })} /></div>
                <div className="asr-field"><label>Subtitle</label><input value={draft.intro?.subtitle || ""} onChange={(e) => setDraft({ ...draft, intro: { ...draft.intro, subtitle: e.target.value } })} /></div>
              </div>
              <div className="asr-field asr-field--wide"><label>Introduction text</label><textarea rows="3" value={draft.intro?.lead || ""} onChange={(e) => setDraft({ ...draft, intro: { ...draft.intro, lead: e.target.value } })} /></div>
              <div className="asr-field asr-field--wide"><label>Page banner</label><div className="asr-banner-preview">{draft.heroImage ? <img src={draft.heroImage} alt={`${draft.name || "Department"} banner preview`} /> : <span>No banner image selected</span>}</div><div className="asr-banner-upload"><label className="asr-upload"><FiUpload /> {uploadingBanner ? "Uploading…" : draft.heroImage ? "Replace banner" : "Upload banner"}<input type="file" accept="image/*" disabled={uploadingBanner} onChange={(e) => { uploadBanner(e.target.files?.[0]); e.target.value = ""; }} /></label>{draft.heroImage && <button type="button" className="asr-btn asr-btn--light" onClick={() => setDraft((current) => ({ ...current, heroImage: "" }))}>Remove banner</button>}</div><small>Preview the banner here. Save changes to publish it.</small></div>
            </div>}
          </section>

          <section ref={categoryCardRef} className={`ahm-card asr-category-card${openCard === "categories" ? " is-open" : ""}`}>
            <button type="button" className="ahm-card__head" aria-expanded={openCard === "categories"} onClick={() => toggleCard("categories")}>
              <h3>Categories & resources</h3><span>{draft.tabs.length} categories <FiChevronRight /></span>
            </button>
            {openCard === "categories" && <div className="ahm-card__body">
              <p className="ahm-hint">Choose a category on the left to manage its semester filters and learning materials on the right.</p>
              <div className="asr-category-layout">
                <aside className="asr-category-sidebar">
                  <div className="asr-category-panel">
                    <div className="asr-section-head"><div><span>RESOURCE CATEGORIES</span><h3>Categories</h3></div><button type="button" className="asr-btn asr-btn--light asr-add-category" onClick={() => { setDraft((current) => ({ ...current, tabs: [...current.tabs, blankTab()] })); setTabIndex(draft.tabs.length); }}><FiPlus /> Add</button></div>
                    <div ref={categoryListRef} className="asr-category-list" role="tablist" aria-label="Resource categories">
                      {draft.tabs.map((tab, index) => <button type="button" role="tab" aria-selected={index === tabIndex} key={`${tab.id}-${index}`} ref={index === tabIndex ? activeCategoryRef : null} className={index === tabIndex ? "is-active" : ""} onClick={() => setTabIndex(index)}><span>{tab.label || "Untitled category"}</span><small>{tab.files.length} files</small></button>)}
                    </div>
                  </div>
                  {activeTab && <div className="asr-category-edit asr-category-settings">
                    <div className="asr-section-head"><div><span>CATEGORY SETTINGS</span><h3>Edit category</h3></div><button type="button" className="asr-danger-icon" title="Delete category" onClick={() => { if (window.confirm("Delete this category and all its resources?")) { const next = draft.tabs.filter((_, i) => i !== tabIndex); setDraft({ ...draft, tabs: next }); setTabIndex(Math.max(0, tabIndex - 1)); } }}><FiTrash2 /></button></div>
                    <div className="asr-field"><label>Category name</label><input value={activeTab.label} onChange={(e) => updateTab({ label: e.target.value })} placeholder="e.g. Lesson plan" /></div>
                  </div>}
                </aside>
                {activeTab && <div className="asr-category-main">
                  <div className="asr-category-edit">
                    <div className="asr-section-head"><div><span>PUBLIC FILTERS</span><h3>Semester filter options</h3><p>These options appear as filter chips on the public page.</p></div><button type="button" className="asr-btn asr-btn--light" onClick={addFilter}><FiPlus /> Add filter</button></div>
                    {activeTab.filters.map((filter, index) => <div className="asr-filter-row" key={`${filter.value}-${index}`}><select aria-label="Semester value" value={filter.value} onChange={(e) => updateFilter(index, { value: Number(e.target.value) })}>{[0,1,2,3,4,5,6].map((value) => <option key={value} value={value} disabled={activeTab.filters.some((other, i) => i !== index && Number(other.value) === value)}>{value === 0 ? "General / All" : `Semester ${value}`}</option>)}</select><input aria-label="Filter label" value={filter.label} onChange={(e) => updateFilter(index, { label: e.target.value })} placeholder="Visible filter label" /><button type="button" className="asr-danger-icon" title="Remove filter" onClick={() => updateTab({ filters: activeTab.filters.filter((_, i) => i !== index) })}><FiTrash2 /></button></div>)}
                    {!activeTab.filters.length && <p className="asr-hint">No semester filters. Add an option to show filter chips.</p>}
                  </div>

                  <div className="asr-category-edit asr-learning-panel">
                    <div className="asr-section-head"><div><span>LEARNING MATERIAL</span><h3>{activeTab.label || "Selected category"}</h3><p>Manage all files for this category here.</p></div><button type="button" className="asr-btn asr-btn--light" onClick={() => updateTab({ files: [...activeTab.files, blankFile()] })}><FiPlus /> Add resource</button></div>
                    {activeTab.files.map((file, index) => <article className="asr-resource" key={`${file.file}-${index}`}><div className="asr-resource-head"><b>Resource {index + 1}</b><button type="button" className="asr-danger-icon" title="Delete resource" onClick={() => updateTab({ files: activeTab.files.filter((_, i) => i !== index) })}><FiTrash2 /></button></div><div className="asr-resource-grid"><div className="asr-field"><label>Resource title</label><input value={file.name} onChange={(e) => updateFile(index, { name: e.target.value })} placeholder="Enter resource title" /></div><div className="asr-field"><label>Semester</label><select value={file.semester} onChange={(e) => updateFile(index, { semester: Number(e.target.value) })}>{[0,1,2,3,4,5,6].map((v) => <option key={v} value={v}>{v === 0 ? "General / All semesters" : `Semester ${v}`}</option>)}</select></div></div><div className="asr-file-row"><div className="asr-file-current"><FiFileText /><span>{file.file ? file.source || file.file.split("/").pop() : "No file selected"}</span></div><label className="asr-upload"><FiUpload /> {uploading === index ? "Uploading…" : file.file ? "Replace file" : "Upload file"}<input type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip" disabled={uploading === index} onChange={(e) => { uploadFile(index, e.target.files?.[0]); e.target.value = ""; }} /></label>{file.file && <a className="asr-file-link" href={studyResourceFileUrl(file.file)} target="_blank" rel="noreferrer">Open</a>}</div></article>)}
                    {!activeTab.files.length && <div className="asr-empty-inline">No resources in this category yet. Add a resource to get started.</div>}
                  </div>
                </div>}
              </div>
            </div>}
          </section>

          <section className={`ahm-card${openCard === "related" ? " is-open" : ""}`}>
            <button type="button" className="ahm-card__head" aria-expanded={openCard === "related"} onClick={() => toggleCard("related")}>
              <h3>Related links</h3><span>{(draft.related || []).length} links <FiChevronRight /></span>
            </button>
            {openCard === "related" && <div className="ahm-card__body">
              <div className="asr-section-head"><div><span>RELATED LINKS</span><h3>More for students</h3><p>Edit the supporting links at the bottom of the public page.</p></div><button type="button" className="asr-btn asr-btn--light" onClick={() => setDraft({ ...draft, related: [...(draft.related || []), { label: "", text: "", href: "", to: "", external: false }] })}><FiPlus /> Add link</button></div>
              {(draft.related || []).map((item, index) => <div className="asr-resource" key={index}><div className="asr-resource-head"><b>Related link {index + 1}</b><button type="button" className="asr-danger-icon" title="Delete link" onClick={() => setDraft({ ...draft, related: draft.related.filter((_, i) => i !== index) })}><FiTrash2 /></button></div><div className="asr-resource-grid"><div className="asr-field"><label>Link type</label><select value={item.external ? "external" : "internal"} onChange={(e) => setDraft({ ...draft, related: draft.related.map((v, i) => i === index ? { ...v, external: e.target.value === "external" } : v) })}><option value="internal">Internal page</option><option value="external">External link / file</option></select></div><div className="asr-field"><label>Link title</label><input value={item.label} onChange={(e) => setDraft({ ...draft, related: draft.related.map((v, i) => i === index ? { ...v, label: e.target.value } : v) })} /></div><div className="asr-field"><label>Link description</label><input value={item.text} onChange={(e) => setDraft({ ...draft, related: draft.related.map((v, i) => i === index ? { ...v, text: e.target.value } : v) })} /></div>{!item.external && <div className="asr-field"><label>Destination</label><input value={item.to ? "Existing internal page selected" : "No destination selected"} readOnly /></div>}<div className="asr-field"><label>External website link</label><input value={item.href} onChange={(e) => setDraft({ ...draft, related: draft.related.map((v, i) => i === index ? { ...v, href: e.target.value, to: "" } : v) })} placeholder="https://example.com" /></div></div></div>)}
            </div>}
          </section>

          <div className="ahm-save asr-savebar">
            <span role="status">{message || "Remember to save your changes before leaving this page."}</span>
            <button type="button" className="ahm-btn" onClick={reset} disabled={saving}><FiRotateCcw /> Reset</button>
            <button type="button" className="ahm-btn ahm-btn--save" onClick={save} disabled={saving}><FiSave /> {saving ? "Saving…" : "Save changes"}</button>
          </div>
        </>}
      </section>
    </AdminSidebar>
  );
}
