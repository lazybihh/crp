// Media > Videos. The player uses external YouTube/Vimeo links only; video files are not uploaded.
import { useEffect, useRef, useState } from "react";
import { FiPlay, FiX, FiYoutube, FiVideo } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight } from "react-icons/fi";
import "./Videos.css";
import { getMedia, getVideoEmbedUrl, mediaUrl } from "../../services/mediaService";
import PageLoader, { usePageReady } from "../../components/PageLoader";

const intro = {
  eyebrow: "Media",
  title: "Videos",
  lead: "Watch the campus in motion. Choose a video to play it right here on the page.",
};

// Local fallback content remains visible when the backend is offline.
const FALLBACK_VIDEOS = [
  {
    _id: "welcome-video",
    title: "Welcome to C.R. Polytechnic",
    text: "An introduction to the institute.",
    url: "https://www.youtube.com/watch?v=91vKQc6-W5o",
    poster: "/images/campus-workshop.jpg",
    published: true,
  },
];

function youtubeId(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] || "";
    }

    if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      return (
        url.searchParams.get("v") ||
        url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] ||
        ""
      );
    }
  } catch {
    // Unsupported or incomplete URL.
  }

  return "";
}

function Poster({ video }) {
  const id = youtubeId(video.url);

  const thumbnails = [
    video.poster ? mediaUrl(video.poster) : "",
    id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "",
  ].filter((value, index, list) => value && list.indexOf(value) === index);

  const [sourceIndex, setSourceIndex] = useState(0);
  const thumbnail = thumbnails[sourceIndex];

  return (
    <div className="vid-poster">
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={`${video.title} thumbnail`}
          loading="lazy"
          decoding="async"
          onError={() => setSourceIndex((index) => index + 1)}
        />
      ) : (
        <FiYoutube className="vid-poster__fallback" aria-hidden="true" />
      )}

      <span className="vid-poster__play" aria-hidden="true">
        <FiPlay />
      </span>
    </div>
  );
}

export default function Videos() {
  const { ready, data } = usePageReady(() => getMedia());
  const media = data?.media;
  const videos = media
    ? (media.videos || []).filter((video) => video.published !== false)
    : FALLBACK_VIDEOS;
  const banner = media?.banners?.videos || "";
  const [current, setCurrent] = useState(null);

  const closeRef = useRef(null);
  const returnRef = useRef(null);

  const openVideo = (video, button) => {
    returnRef.current = button;
    setCurrent(video);
  };

  const closeVideo = () => {
    setCurrent(null);
    returnRef.current?.focus();
  };

  useEffect(() => {
    if (!current) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") closeVideo();
    };

    document.addEventListener("keydown", onKey);

    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = before;
    };
  }, [current]);

  const embedUrl = current ? getVideoEmbedUrl(current.url) : "";

  if (!ready) return <main id="main" className="vid-page"><PageLoader /></main>;

  return (
    <main id="main" className="vid-page">
      <section
        className="vid-hero"
        aria-label="Videos"
        style={{
          "--img": `url("${mediaUrl(
            banner && banner !== "/images/pages-banner.png" ? banner : "/images/campus-2.jpg"
          )}")`,
        }}
      >
        <div className="vid-hero__photo" />

        <div className="vid-hero__tags">
          <span className="vid-hero__tag vid-hero__tag--left">
            <span className="vid-hero__tag-icon">
              <FaGraduationCap aria-hidden="true" />
            </span>
            Government Polytechnic
          </span>

          <span className="vid-hero__tag vid-hero__tag--right">
            <span className="vid-hero__tag-icon">
              <FiMapPin aria-hidden="true" />
            </span>
            Rohtak (Haryana)
          </span>
        </div>

        <nav className="vid-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>Media</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Videos</span>
        </nav>
      </section>

      <div className="container vid-wrap">
        <header className="vid-intro">
          <span className="vid-eyebrow">{intro.eyebrow}</span>
          <h1>{intro.title}</h1>
          <p>{intro.lead}</p>
        </header>

        {videos.length ? (
          <ul className="vid-grid">
            {videos.map((video) => (
              <li key={video._id || video.url}>
                <button
                  type="button"
                  className="vid-card"
                  onClick={(event) =>
                    openVideo(video, event.currentTarget)
                  }
                  aria-label={`Play video: ${video.title}`}
                >
                  <Poster video={video} />

                  <span className="vid-card__body">
                    <span className="vid-card__kind">
                      {video.url?.includes("vimeo")
                        ? "Vimeo"
                        : "YouTube"}
                    </span>

                    <strong>{video.title}</strong>

                    <span>
                      {video.text || "Watch this institute video."}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="vid-empty">
            <span className="vid-empty__icon">
              <FiVideo aria-hidden="true" />
            </span>
            <h2>Videos coming soon</h2>
            <p>
              We are preparing campus videos. Please check back shortly.
            </p>
          </div>
        )}
      </div>

      {current && (
        <div
          className="vid-modal"
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          onClick={closeVideo}
        >
          <div
            className="vid-modal__box"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="vid-modal__top">
              <h2>{current.title}</h2>

              <button
                ref={closeRef}
                type="button"
                className="vid-modal__close"
                onClick={closeVideo}
                aria-label="Close video"
              >
                <FiX aria-hidden="true" />
              </button>
            </div>

            <div className="vid-modal__player">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={current.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <p>
                  This video link is not supported. Please update it from
                  the admin panel.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}