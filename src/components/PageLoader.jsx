import { useEffect, useRef, useState } from "react";
import { useSite } from "../context/SiteSettingsContext";
import { mediaUrl } from "../services/settingsService";
import "./PageLoader.css";

function findBannerImages(data) {
  const images = new Set();

  const visit = (value, inBanner = false) => {
    if (Array.isArray(value)) {
      value.forEach((item) => visit(item, inBanner));
      return;
    }

    if (!value || typeof value !== "object") return;

    Object.entries(value).forEach(([key, item]) => {
      const isBanner = /banner|hero/i.test(key);
      if (typeof item === "string" && (isBanner || (inBanner && /image|src|gallery|videos?|sociallinks/i.test(key)))) {
        const url = mediaUrl(item);
        if (url) images.add(url);
      } else {
        visit(item, isBanner || inBanner);
      }
    });
  };

  visit(data);
  return [...images];
}

function preloadImages(urls) {
  if (typeof Image === "undefined") return Promise.resolve();

  return Promise.all(urls.map((url) => new Promise((resolve) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = resolve;
    image.src = url;
  })));
}

export function usePageReady(start, timeoutMs = 2500) {
  const startRef = useRef(start);
  const [result, setResult] = useState({ ready: false, data: null });
  startRef.current = start;

  useEffect(() => {
    let active = true;
    let finished = false;
    const finish = (data) => {
      if (!active || finished) return;
      finished = true;
      clearTimeout(timer);
      setResult({ ready: true, data });
    };
    const timer = setTimeout(() => finish(null), timeoutMs);

    Promise.resolve()
      .then(() => startRef.current())
      .then(async (data) => {
        if (!active || finished) return;
        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item?.status === "rejected") console.error("Page data request failed:", item.reason);
          });
        }
        await preloadImages(findBannerImages(data));
        finish(data);
      })
      .catch((error) => {
        console.error("Page data load failed:", error);
        finish(null);
      });

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [timeoutMs]);

  return result;
}

export default function PageLoader() {
  const { images } = useSite();

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, []);

  return (
    <div className="pld-loader" role="status" aria-label="Loading">
      <img
        className="pld-loader__logo"
        src={mediaUrl(images?.loadingAnimation) || "/images/crlogogif.gif"}
        alt="Chhotu Ram Polytechnic"
        onError={(event) => { event.currentTarget.style.display = "none"; }}
      />
    </div>
  );
}
