import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { FaFacebookF, FaInstagram, FaLink, FaYoutube, FaTwitter, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import siteDefaults from "../data/siteDefaults";
import { getSiteSettings, mediaUrl } from "../services/settingsService";

const SiteSettingsContext = createContext(siteDefaults);

const merge = (fallback, saved) => ({
  ...fallback,
  ...(saved || {}),
  institute: { ...fallback.institute, ...(saved?.institute || {}) },
  contact: { ...fallback.contact, ...(saved?.contact || {}) },
  links: { ...fallback.links, ...(saved?.links || {}) },
  images: { ...fallback.images, ...(saved?.images || {}) },
  headerButton: { ...fallback.headerButton, ...(saved?.headerButton || {}) },
  socialLinks: Array.isArray(saved?.socialLinks) ? saved.socialLinks : fallback.socialLinks,
});

export function telHref(phone) {
  return phone ? `tel:${String(phone).replace(/[^\d+]/g, "")}` : "";
}

export function oneLineAddress(addressLines) {
  return (Array.isArray(addressLines) ? addressLines : []).filter(Boolean).join(", ");
}

export function socialIcon(platform) {
  const icons = {
    facebook: FaFacebookF,
    instagram: FaInstagram,
    youtube: FaYoutube,
    twitter: FaTwitter,
    linkedin: FaLinkedinIn,
    whatsapp: FaWhatsapp,
  };
  return icons[String(platform || "").toLowerCase()] || FaLink;
}

export function SiteSettingsProvider({ children }) {
  const [site, setSite] = useState(siteDefaults);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    getSiteSettings()
      .then((saved) => {
        if (!active) return;
        const merged = merge(siteDefaults, saved);
        setSite(merged);
        setSettingsLoaded(true);
        if (merged.images?.tabIcon) {
          let icon = document.querySelector('link[rel="icon"]');
          if (!icon) {
            icon = document.createElement("link");
            icon.rel = "icon";
            document.head.appendChild(icon);
          }
          icon.href = mediaUrl(merged.images.tabIcon);
        }
      })
      .catch(() => { if (active) { setSite(siteDefaults); setSettingsLoaded(true); } });
    return () => { active = false; };
  }, []);

  const value = useMemo(() => ({ ...site, site, mediaUrl, settingsLoaded }), [site, settingsLoaded]);
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSite() {
  return useContext(SiteSettingsContext);
}
