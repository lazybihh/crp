import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiCheckCircle, FiSend, FiX } from "react-icons/fi";
import { sendEnquiry } from "../services/enquiryService";
import "./LeadForm.css";

/**
 * SHARED ADMISSION + COURSE ENQUIRY FORMS
 *
 * Popup buttons:
 *   <AdmissionFormButton>Admissions Open</AdmissionFormButton>
 *   <CourseEnquiryButton department="Civil Engineering">Enquiry</CourseEnquiryButton>
 *
 * Inline form (Admissions page only):
 *   <LeadForm kind="admission-form" />
 *
 * The `kind` sent to sendEnquiry keeps each form's records separate in MongoDB.
 */
const diplomaCourses = ["Civil Engineering", "Computer Engineering", "Electrical Engineering", "Electronics & Communication", "Mechanical Engineering", "Plastic Technology"];

// FORM BODY: renders either Admission or Course Enquiry fields based on `kind`.
// Use this directly when the form should appear inline instead of inside a popup.
export function LeadForm({ kind = "course-enquiry", department = "", onClose }) {
  const admission = kind === "admission-form";
  const [values, setValues] = useState({ name: "", phone: "", email: "", department, qualification: "", admissionSession: "2026-27", message: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const change = (event) => setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending"); setError("");
    try {
      await sendEnquiry({ ...values, kind, website: "" });
      setStatus("sent");
      window.dispatchEvent(new Event("enquiries-updated"));
    } catch (err) {
      setError(err.message || "We could not send your request. Please try again.");
      setStatus("idle");
    }
  };
  return (
    <div className="lead-form-shell">
      {onClose && <button type="button" className="lead-form__close" onClick={onClose} aria-label="Close form"><FiX /></button>}
      {status === "sent" ? (
        <div className="lead-form__success" role="status"><FiCheckCircle /><h3>Thank you for reaching out</h3><p>{admission ? "The admission team has received your details." : "The department has received your enquiry."}</p><button className="lead-form__submit" type="button" onClick={onClose || (() => { setStatus("idle"); setValues({ name: "", phone: "", email: "", department, qualification: "", admissionSession: "2026-27", message: "" }); })}>Done</button></div>
      ) : (
        <>
          <header className="lead-form__heading"><span>{admission ? "Admissions" : "Course enquiry"}</span><h2>{admission ? "Start your admission enquiry" : `Ask about ${department || "a course"}`}</h2><p>{admission ? "Share your details and the institute team will get in touch about the admission process." : "Your selected department is included with your message."}</p></header>
          <form onSubmit={submit}>
            <input className="lead-form__trap" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div className="lead-form__grid">
              <label>Full name <input name="name" autoComplete="name" required maxLength={100} value={values.name} onChange={change} /></label>
              <label>Phone number <input name="phone" type="tel" autoComplete="tel" inputMode="tel" required value={values.phone} onChange={change} /></label>
              <label>Email address <input name="email" type="email" autoComplete="email" value={values.email} onChange={change} /></label>
              {/* ADMISSION FORM ONLY: course, qualification and admission session. */}
              {admission ? <>
                <label>Course of interest <select name="department" required value={values.department} onChange={change}><option value="">Choose a course</option>{diplomaCourses.map((course) => <option key={course}>{course}</option>)}</select></label>
                <label>Current qualification <input name="qualification" required maxLength={120} placeholder="e.g. Class 10 / ITI" value={values.qualification} onChange={change} /></label>
                <label>Admission session <select name="admissionSession" value={values.admissionSession} onChange={change}><option>2026-27</option><option>2027-28</option></select></label>
              </> : <>
                {/* COURSE ENQUIRY ONLY: the card's selected department is prefilled. */}
                <label>Department <input name="department" readOnly required value={values.department} /></label>
              </>}
              <label className="lead-form__wide">{admission ? "Anything you would like us to know?" : "Your question"}<textarea name="message" required minLength={10} maxLength={1000} rows={4} value={values.message} onChange={change} placeholder={admission ? "Add a question or useful details" : "Tell us what you would like to know"} /></label>
            </div>
            {error && <p className="lead-form__error" role="alert">{error}</p>}
            <button className="lead-form__submit" type="submit" disabled={status === "sending"}><FiSend />{status === "sending" ? "Sending…" : admission ? "Send admission enquiry" : "Send enquiry"}</button>
          </form>
        </>
      )}
    </div>
  );
}

// POPUP WRAPPER: shared by both named popup button components below.
export function LeadModal({ kind = "course-enquiry", department = "", onClose }) {
  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = oldOverflow; document.removeEventListener("keydown", onKeyDown); };
  }, [onClose]);
  return createPortal(<div className="lead-modal" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="lead-modal__panel" role="dialog" aria-modal="true" aria-label={kind === "admission-form" ? "Admission enquiry form" : `${department} enquiry form`}><LeadForm kind={kind} department={department} onClose={onClose} /></section></div>, document.body);
}

// GENERIC POPUP BUTTON: use `kind="admission-form"` or `kind="course-enquiry"`.
export function LeadFormButton({ kind = "course-enquiry", department = "", className = "", children, onClick, ...buttonProps }) {
  const [open, setOpen] = useState(false);
  return <><button type="button" className={className} {...buttonProps} onClick={(event) => { onClick?.(event); setOpen(true); }}>{children}</button>{open && <LeadModal kind={kind} department={department} onClose={() => setOpen(false)} />}</>;
}

// ADMISSION POPUP CALL: use this for any Admissions Open / Apply button.
export function AdmissionFormButton(props) {
  return <LeadFormButton kind="admission-form" {...props} />;
}

// COURSE ENQUIRY POPUP CALL: pass the selected card's department name.
export function CourseEnquiryButton(props) {
  return <LeadFormButton kind="course-enquiry" {...props} />;
}
