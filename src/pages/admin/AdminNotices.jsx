import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import { createNotice, getAllNotices, getNoticePage, mediaUrl, noticeFileUrl, removeNotice, saveNoticePage, updateNotice, uploadNoticeFile } from "../../services/noticeService";
import "./AdminNotices.css";

const CATEGORIES = [{id:"admissions",label:"Admissions"},{id:"exams",label:"Exams"},{id:"scholarships",label:"Scholarships"},{id:"events",label:"Holidays & events"},{id:"tenders",label:"Tenders"},{id:"other",label:"Other"}];
const blankNotice = { title:"", category:"admissions", file:"", date:"", note:"", published:true };
const pageFields = [
  ["eyebrow","Small heading"],["title","Page title"],["lead","Page introduction"],["leftTag","Left banner label"],["rightTag","Right banner label"],
  ["glanceTitle","At-a-glance heading"],["noticesLabel","Notices tab label"],["activitiesLabel","Activities tab label"],["latestLabel","Latest notice label"],
  ["browseEyebrow","Browse small heading"],["listTitle","Announcement section heading"],["searchPlaceholder","Search placeholder"],["helpTitle","Help heading"],["helpText","Help description"],["homeBreadcrumb","Breadcrumb: Home"],["noticesBreadcrumb","Breadcrumb: Notices"],
  ["allLabel","All categories label"],["chooseCategoryLabel","Category dropdown placeholder"],["fileMissingLabel","Missing file label"],["openFileLabel","Open file button"],["emptyMessage","No results message"],["showMoreLabel","Show more button"],["showingLabel","Showing count label"],
  ["categoryAdmissions","Category: Admissions"],["categoryExams","Category: Exams"],["categoryScholarships","Category: Scholarships"],["categoryEvents","Category: Holidays & events"],["categoryTenders","Category: Tenders"],["categoryOther","Category: Other"]
];
export default function AdminNotices() {
  const [notices,setNotices] = useState([]); const [page,setPage] = useState({}); const [draft,setDraft] = useState(blankNotice); const [editing,setEditing] = useState("");
  const [busy,setBusy] = useState(false); const [message,setMessage] = useState(""); const [error,setError] = useState(false);
  const say=(text,isError=false)=>{setMessage(text);setError(isError);};
  const load=async()=>{const [n,p]=await Promise.all([getAllNotices(),getNoticePage()]);setNotices(n.notices||[]);setPage(p.page||{});};
  useEffect(()=>{load().catch(e=>say(e.message,true));},[]);
  const upload=async (file, field)=>{if(!file)return;setBusy(true);try{const url=await uploadNoticeFile(file);if(field==="banner")setPage(v=>({...v,banner:url}));else setDraft(v=>({...v,file:url}));say("File uploaded. Save your changes to publish it.");}catch(e){say(e.message,true);}finally{setBusy(false);}};
  const savePage=async()=>{setBusy(true);try{const r=await saveNoticePage(page);setPage(r.page);say("Notices page content saved.");}catch(e){say(e.message,true);}finally{setBusy(false);}};
  const saveRow=async()=>{if(!draft.title.trim())return say("Please enter a notice title.",true);setBusy(true);try{if(editing)await updateNotice(editing,draft);else await createNotice(draft);setDraft(blankNotice);setEditing("");await load();say(editing?"Notice updated.":"New notice added.");}catch(e){say(e.message,true);}finally{setBusy(false);}};
  const editRow=(row)=>{setEditing(row._id);setDraft({title:row.title||"",category:row.category||"other",file:row.file||"",date:row.date||"",note:row.note||"",published:row.published!==false});window.scrollTo({top:0,behavior:"smooth"});};
  const deleteRow=async(row)=>{if(!window.confirm(`Delete “${row.title}”?`))return;setBusy(true);try{await removeNotice(row._id);await load();if(editing===row._id){setEditing("");setDraft(blankNotice);}say("Notice deleted.");}catch(e){say(e.message,true);}finally{setBusy(false);}};
  return <AdminSidebar title="Notices"><main className="an-page">
    <header className="an-heading"><div><h2>Notices management</h2><p>Manage the banner, every page text and all notice documents from here.</p></div><a href="/notices" target="_blank" rel="noreferrer">View live page ↗</a></header>
    {message&&<p className={`an-message${error?" is-error":""}`} role="status">{message}</p>}
    <section className="an-panel"><div className="an-panel-title"><div><h3>Page banner & content</h3><p>Only the new banner file is uploaded. The previous admin-uploaded banner is removed after saving.</p></div></div>
      <label className="an-upload">Upload / replace banner<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>{upload(e.target.files?.[0],"banner");e.target.value="";}} /></label>
      {page.banner&&<img className="an-banner-preview" src={mediaUrl(page.banner)} alt="Notices banner preview"/>}
      <div className="an-fields">{pageFields.map(([key,label])=><label key={key} className="an-field"><span>{label}</span>{["lead","helpText","emptyMessage"].includes(key)?<textarea rows="3" value={page[key]||""} onChange={e=>setPage(v=>({...v,[key]:e.target.value}))}/>:<input value={page[key]||""} onChange={e=>setPage(v=>({...v,[key]:e.target.value}))}/>}</label>)}</div>
      <button className="an-primary" disabled={busy} onClick={savePage}>{busy?"Saving…":"Save page content"}</button>
    </section>
    <section className="an-panel"><div className="an-panel-title"><div><h3>{editing?"Edit notice":"Add a notice"}</h3><p>Upload a file only when adding a new document or replacing an existing one.</p></div></div>
      <div className="an-fields"><label className="an-field"><span>Notice title *</span><input value={draft.title} onChange={e=>setDraft(v=>({...v,title:e.target.value}))}/></label>
      <label className="an-field"><span>Category</span><select value={draft.category} onChange={e=>setDraft(v=>({...v,category:e.target.value}))}>{CATEGORIES.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
      <label className="an-field"><span>Date (optional)</span><input type="date" value={draft.date} onChange={e=>setDraft(v=>({...v,date:e.target.value}))}/></label>
      <label className="an-field an-wide"><span>Short description (optional)</span><textarea rows="3" value={draft.note} onChange={e=>setDraft(v=>({...v,note:e.target.value}))}/></label></div>
      <div className="an-file-row"><label className="an-upload">{draft.file?"Replace attached file":"Upload notice file"}<input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.txt,.rtf,.odt,.ods,.odp,.jpg,.jpeg,.png,.webp" onChange={e=>{upload(e.target.files?.[0],"file");e.target.value="";}}/></label>{draft.file&&<a href={noticeFileUrl(draft.file)} target="_blank" rel="noreferrer">Preview current file ↗</a>}</div>
      <label className="an-check"><input type="checkbox" checked={draft.published} onChange={e=>setDraft(v=>({...v,published:e.target.checked}))}/> Published on public website</label>
      <div className="an-actions"><button className="an-primary" disabled={busy} onClick={saveRow}>{busy?"Saving…":editing?"Update notice":"Add notice"}</button>{editing&&<button className="an-secondary" onClick={()=>{setEditing("");setDraft(blankNotice);}}>Cancel edit</button>}</div>
    </section>
    <section className="an-panel"><div className="an-panel-title"><div><h3>Existing notices ({notices.length})</h3><p>Edit or delete any notice. Existing frontend documents remain untouched.</p></div></div>
      <div className="an-list">{notices.map(row=><article className="an-item" key={row._id}><div><strong>{row.title}</strong><small>{CATEGORIES.find(c=>c.id===row.category)?.label||"Other"} · {row.published===false?"Hidden":"Published"}{row.file?" · File attached":" · No file"}</small></div><div className="an-item-actions"><button onClick={()=>editRow(row)}>Edit</button><button className="is-delete" onClick={()=>deleteRow(row)}>Delete</button></div></article>)}</div>
    </section>
  </main></AdminSidebar>;
}
