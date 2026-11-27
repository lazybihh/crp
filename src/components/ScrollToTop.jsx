// ScrollToTop.jsx - every time the page (route) changes, jump to the top. Links with a #section (like #adn-notices) are left alone.
import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash, key } = useLocation();

  useLayoutEffect(() => {
    // Let this component own scroll position instead of restoring the old
    // browser history position when the user returns with Back.
    window.history.scrollRestoration = "manual";
    if (hash) return; // a link to a section on the page: let the browser scroll to it

    const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    // Scroll now and once after the browser has applied the route's layout.
    scrollToTop();
    const frame = window.requestAnimationFrame(scrollToTop);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash, key]);

  return null;
}
