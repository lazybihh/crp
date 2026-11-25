import { useEffect, useRef, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { createNotice, getAllNotices, getNoticePage, mediaUrl, noticeFileUrl, removeNotice, saveNoticePage, updateNotice, uploadNoticeFile } from "../../services/noticeService";
import "./AdminNotices.css";

const CATEGORIES = [{id:"admissions",label:"Admissions"},{id:"exams",label:"Exams"},{id:"scholarships",label:"Scholarships"},{id:"events",label:"Holidays & events"},{id:"tenders",label:"Tenders"},{id:"other",label:"Other"}];
const blankNotice = { title:"", category:"admissions", file:"", link:"", date:"", note:"", published:true };
const pageFields = [
  ["eyebrow","Small heading"],["title","Page title"],["lead","Page introduction"],["leftTag","Left banner label"],["rightTag","Right banner label"],
  ["glanceTitle","At-a-glance heading"],["noticesLabel","Notices tab label"],["activitiesLabel","Activities tab label"],["latestLabel","Latest notice label"],
  ["browseEyebrow","Browse small heading"],["listTitle","Announcement section heading"],["searchPlaceholder","Search placeholder"],["helpTitle","Help heading"],["helpText","Help description"],["homeBreadcrumb","Breadcrumb: Home"],["noticesBreadcrumb","Breadcrumb: Notices"],
  ["allLabel","All categories label"],["chooseCategoryLabel","Category dropdown placeholder"],["fileMissingLabel","Missing file label"],["openFileLabel","Open file button"],["emptyMessage","No results message"],["showMoreLabel","Show more button"],["showingLabel","Showing count label"],
  ["categoryAdmissions","Category: Admissions"],["categoryExams","Category: Exams"],["categoryScholarships","Category: Scholarships"],["categoryEvents","Category: Holidays & events"],["categoryTenders","Category: Tenders"],["categoryOther","Category: Other"]
];
export default function AdminNotices() {
  const [notices,setNotices] = useState([]); const [page,setPage] = useState({}); const [draft,setDraft] = useState(blankNotice); const [editing,setEditing] = useState(""); const [attachmentType,setAttachmentType] = useState("none");
  const [busy,setBusy] = useState(false); const [message,setMessage] = useState(""); const [error,setError] = useState(false);
  const [query,setQuery] = useState(""); const [categoryFilter,setCategoryFilter] = useState("all");
  const editFormRef = useRef(null); const titleInputRef = useRef(null);
  const say=(text,isError=false)=>{setMessage(text);setError(isError);};
  const load=async()=>{const [n,p]=await Promise.all([getAllNotices(),getNoticePage()]);setNotices(n.notices||[]);setPage(p.page||{});};
  useEffect(()=>{load().catch(e=>say(e.message,true));},[]);
  useEffect(()=>{
    if (!editing) return;
    editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    titleInputRef.current?.focus({ preventScroll: true });
  },[editing]);
  const visibleNotices = notices.filter(row => {
    const matchesQuery = `${row.title || ""} ${row.note || ""}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesCategory = categoryFilter === "all" || row.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });
  const upload=async (file, field)=>{if(!file)return;setBusy(true);try{const url=await uploadNoticeFile(file);if(field==="banner")setPage(v=>({...v,banner:url}));else{setDraft(v=>({...v,file:url,link:""}));setAttachmentType("file");}say("File uploaded. Save your changes to publish it.");}catch(e){say(e.message,true);}finally{setBusy(false);}};
  const savePage=async()=>{setBusy(true);try{const r=await saveNoticePage(page);setPage(r.page);say("Notices page content saved.");}catch(e){say(e.message,true);}finally{setBusy(false);}};
  const saveRow=async()=>{if(!draft.title.trim())return say("Please enter a notice title.",true);if(attachmentType==="file"&&!draft.file)return say("Please upload a notice file or choose another attachment type.",true);if(attachmentType==="link"){try{const url=new URL(draft.link.trim());if(!["http:","https:"].includes(url.protocol))throw new Error();}catch{return say("Please enter a valid HTTP or HTTPS link.",true);}}const data={...draft,file:attachmentType==="file"?draft.file:"",link:attachmentType==="link"?draft.link.trim():""};setBusy(true);try{if(editing)await updateNotice(editing,data);else await createNotice(data);setDraft(blankNotice);setAttachmentType("none");setEditing("");await load();say(editing?"Notice updated.":"New notice added.");}catch(e){say(e.message,true);}finally{setBusy(false);}};
  const editRow=(row)=>{setDraft({title:row.title||"",category:row.category||"other",file:row.file||"",link:row.link||"",date:row.date||"",note:row.note||"",published:row.published!==false});setAttachmentType(row.link?"link":row.file?"file":"none");setEditing(row._id);};
  const deleteRow=async(row)=>{if(!window.confirm(`Delete “${row.title}”?`))return;setBusy(true);try{await removeNotice(row._id);await load();if(editing===row._id){setEditing("");setDraft(blankNotice);setAttachmentType("none");}say("Notice deleted.");}catch(e){say(e.message,true);}finally{setBusy(false);}};
  return <AdminSidebar title="Notices"><main className="an-page">
    <header className="an-heading"><div><h2>Notices management</h2><p>Manage the banner, page content and notice attachments from here.</p></div><a href="/notices" target="_blank" rel="noreferrer">View live page ↗</a></header>
    {message&&<p className={`an-message${error?" is-error":""}`} role="status">{message}</p>}
    <section className="an-panel"><div className="an-panel-title"><div><h3>Page banner & content</h3><p>Only the new banner file is uploaded. The previous admin-uploaded banner is removed after saving.</p></div></div>
      <label className="an-upload">Upload / replace banner<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{upload(e.target.files?.[0],"banner");e.target.value="";}} /></label>
      {page.banner&&<img className="an-banner-preview" src={mediaUrl(page.banner)} alt="Notices banner preview"/>}
      <div className="an-fields">{pageFields.map(([key,label])=><label key={key} className="an-field"><span>{label}</span>{["lead","helpText","emptyMessage"].includes(key)?<textarea rows="3" value={page[key]||""} onChange={e=>setPage(v=>({...v,[key]:e.target.value}))}/>:<input value={page[key]||""} onChange={e=>setPage(v=>({...v,[key]:e.target.value}))}/>}</label>)}</div>
      <button className="an-primary" disabled={busy} onClick={savePage}>{busy?"Saving…":"Save page content"}</button>
    </section>
    <section className={`an-panel an-editor${editing?" is-editing":""}`} ref={editFormRef}><div className="an-panel-title"><div><h3>{editing?"Edit notice":"Add a notice"}</h3><p>Choose either one file or one link as the notice attachment.</p></div></div>
      <div className="an-fields"><label className="an-field"><span>Notice title *</span><input ref={titleInputRef} value={draft.title} onChange={e=>setDraft(v=>({...v,title:e.target.value}))}/></label>
      <label className="an-field"><span>Category</span><select value={draft.category} onChange={e=>setDraft(v=>({...v,category:e.target.value}))}>{CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
      <label className="an-field"><span>Date (optional)</span><input type="date" value={draft.date} onChange={e=>setDraft(v=>({...v,date:e.target.value}))}/></label>
      <label className="an-field an-wide"><span>Short description (optional)</span><textarea rows="3" value={draft.note} onChange={e=>setDraft(v=>({...v,note:e.target.value}))}/></label></div>
      <fieldset className="an-attachment"><legend>Attachment</legend><label><input type="radio" name="notice-attachment" checked={attachmentType==="none"} onChange={()=>{setAttachmentType("none");setDraft(v=>({...v,file:"",link:""}));}}/> No attachment</label><label><input type="radio" name="notice-attachment" checked={attachmentType==="file"} onChange={()=>{setAttachmentType("file");setDraft(v=>({...v,link:""}));}}/> Upload a file</label><label><input type="radio" name="notice-attachment" checked={attachmentType==="link"} onChange={()=>{setAttachmentType("link");setDraft(v=>({...v,file:""}));}}/> Add a link</label></fieldset>
      {attachmentType==="file"&&<div className="an-file-row"><label className="an-upload">{draft.file?"Replace attached file":"Upload notice file"}<input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.rtf,.odt,.ods,.odp,.jpg,.jpeg,.png,.webp" onChange={e=>{upload(e.target.files?.[0],"file");e.target.value="";}}/></label>{draft.file&&<a href={noticeFileUrl(draft.file)} target="_blank" rel="noreferrer">Preview current file ↗</a>}</div>}
      {attachmentType==="link"&&<label className="an-field"><span>Notice link *</span><input type="url" value={draft.link} placeholder="https://example.com/notice" onChange={e=>setDraft(v=>({...v,link:e.target.value,file:""}))}/></label>}
      <label className="an-check"><input type="checkbox" checked={draft.published} onChange={e=>setDraft(v=>({...v,published:e.target.checked}))}/> Published on public website</label>
      <div className="an-actions"><button className="an-primary" disabled={busy} onClick={saveRow}>{busy?"Saving…":editing?"Update notice":"Add notice"}</button>{editing&&<button className="an-secondary" onClick={()=>{setEditing("");setDraft(blankNotice);setAttachmentType("none");}}>Cancel edit</button>}</div>
    </section>
    <section className="an-panel"><div className="an-panel-title an-list-heading"><div><h3>Existing notices <span className="an-count">{notices.length}</span></h3><p>Search, review and manage the notices currently stored on your website.</p></div></div>
      <div className="an-list-tools"><label className="an-search"><span className="an-sr-only">Search notices</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by notice title or description…" /></label><label className="an-filter"><span className="an-sr-only">Filter by category</span><select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)}><option value="all">All categories</option>{CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></label></div>
      <div className="an-list">{visibleNotices.map(row=><article className="an-item" key={row._id}><div><strong>{row.title}</strong><small>{CATEGORIES.find(c=>c.id===row.category)?.label||"Other"} · {row.published===false?"Hidden":"Published"}{row.file?" · File attached":row.link?" · Link attached":" · No attachment"}</small></div><div className="an-item-actions"><button onClick={()=>editRow(row)}>Edit</button><button className="is-delete" onClick={()=>deleteRow(row)}>Delete</button></div></article>)}{visibleNotices.length===0&&<p className="an-empty">{notices.length===0?"No notices have been added yet.":"No notices match your search."}</p>}</div>
    </section>
  </main></AdminSidebar>;
}
