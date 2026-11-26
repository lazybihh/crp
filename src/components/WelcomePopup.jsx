import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiBell, FiX } from "react-icons/fi";
import { useSite } from "../context/SiteSettingsContext";
import siteDefaults from "../data/siteDefaults";
import "./WelcomePopup.css";

// Opens automatically after site settings load. Dismissing it keeps it closed
// while the visitor navigates within this visit; a refresh/new visit opens it again.
export default function WelcomePopup() {
  const { settingsLoaded, welcomePopup, mediaUrl } = useSite();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (settingsLoaded) setOpen(true);
  }, [settingsLoaded]);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      // A page loader can also lock scrolling while this global popup is open.
      // Clear our lock instead of restoring a stale "hidden" value from that race.
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!open) return null;
  const title = welcomePopup?.title || siteDefaults.welcomePopup.title;
  const image = mediaUrl(welcomePopup?.image || siteDefaults.welcomePopup.image);

  return createPortal(
    <div className="welcome-popup" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section className="welcome-popup__panel" role="dialog" aria-modal="true" aria-labelledby="welcome-popup-title">
        <button type="button" className="welcome-popup__close" onClick={() => setOpen(false)} aria-label="Close welcome popup"><FiX aria-hidden="true" /></button>
        {image && <img className="welcome-popup__image" src={image} alt="" />}
        <div className="welcome-popup__content">
          <div className="welcome-popup__announcement"><span><FiBell aria-hidden="true" /></span><strong>Special Announcement</strong></div>
          <h2 id="welcome-popup-title">{title}</h2>
        </div>
      </section>
    </div>,
    document.body,
  );
}
