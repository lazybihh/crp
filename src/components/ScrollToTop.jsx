// ScrollToTop.jsx - every time the page (route) changes, jump to the top. Links with a #section (like #adn-notices) are left alone.
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) return; // a link to a section on the page: let the browser scroll to it
    // global.css has "scroll-behavior: smooth" on <html>, so say "instant" or the new page would slide up slowly
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}