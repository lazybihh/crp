// Gallery.jsx - Media > Photos
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
  FiMaximize2,
  FiSearch,
  FiPlus,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin, FiChevronRight as FiCrumbArrow } from "react-icons/fi";
import "./Gallery.css";
import { getMedia, mediaUrl } from "../../services/mediaService";
import PageLoader, { usePageReady } from "../../components/PageLoader";

const PAGE_SIZE = 12;

const FALLBACK_PHOTOS = [
  { src: "/images/campus-2.jpg", title: "Main campus", category: "Campus" },
  { src: "/images/campus-3.jpg", title: "Campus grounds", category: "Campus" },
  { src: "/images/campus-workshop.jpg", title: "Workshop session", category: "Workshop" },
  { src: "/images/events.jpg", title: "College events", category: "Events" },
  { src: "/images/facilities/communication-lab-1.jpg", title: "Communication lab", category: "Labs" },
  { src: "/images/facilities/facility-computer-labs.jpg", title: "Computer lab", category: "Labs" },
  { src: "/images/facilities/library-2.jpg", title: "Library", category: "Library" },
  { src: "/images/facilities/facility-hostels.jpg", title: "Hostel premises", category: "Hostels" },
  { src: "/images/facilities/facility-sports.jpg", title: "Sports facilities", category: "Sports" },
  { src: "/images/placement-activities.jpg", title: "Placement activities", category: "Placements" },
];

const FALLBACK_CATEGORIES = [
  "Campus",
  "Workshop",
  "Events",
  "Labs",
  "Library",
  "Hostels",
  "Sports",
  "Placements",
];

const intro = {
  eyebrow: "Media",
  title: "Photo Gallery",
  lead: "Campus life, labs, hostels, events and sports - all in pictures. Search or pick a category, then tap any photo to see it full screen.",
};

function Empty() {
  return (
    <div className="gal-empty" aria-hidden="true">
      <FiImage />
      <span>Photo coming soon</span>
    </div>
  );
}

function Tile({ photo, index, onOpen }) {
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      className="gal-tile"
      style={{ "--delay": `${(index % PAGE_SIZE) * 45}ms` }}
      onClick={(event) => onOpen(index, event.currentTarget)}
      aria-label={`View full screen: ${photo.title}`}
    >
      {failed ? (
        <Empty />
      ) : (
        <img
          src={mediaUrl(photo.src)}
          alt={photo.title}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}

      <span className="gal-tile__tag">{photo.category}</span>
      <span className="gal-tile__zoom" aria-hidden="true">
        <FiMaximize2 />
      </span>
      <span className="gal-tile__caption">{photo.title}</span>
    </button>
  );
}

function Picture({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <Empty />;

  return (
    <img
      src={mediaUrl(src)}
      alt={alt}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

export default function Gallery() {
  const { ready, data } = usePageReady(() => getMedia());
  const media = data?.media;
  const photos = media
    ? (media.photos || []).filter((photo) => photo.src)
    : FALLBACK_PHOTOS;
  const photoCategories = media
    ? (media.photoCategories?.length ? media.photoCategories : FALLBACK_CATEGORIES)
    : FALLBACK_CATEGORIES;
  const banner = media?.banners?.gallery || "";
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [openAt, setOpenAt] = useState(null);

  const closeRef = useRef(null);
  const returnRef = useRef(null);
  const touchX = useRef(null);

  const categories = useMemo(
    () =>
      photoCategories.filter((name) =>
        photos.some((photo) => photo.category === name)
      ),
    [photoCategories, photos]
  );

  const countOf = (name) =>
    photos.filter((photo) => photo.category === name).length;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();

    return photos.filter(
      (photo) =>
        (category === "All" || photo.category === category) &&
        (!q ||
          photo.title.toLowerCase().includes(q) ||
          photo.category.toLowerCase().includes(q))
    );
  }, [category, query, photos]);

  const shown = results.slice(0, limit);
  const remaining = results.length - shown.length;
  const open = openAt === null ? null : results[openAt];

  const pickCategory = (name) => {
    setCategory(name);
    setLimit(PAGE_SIZE);
  };

  const changeQuery = (value) => {
    setQuery(value);
    setLimit(PAGE_SIZE);
  };

  const openPhoto = (index, button) => {
    returnRef.current = button;
    setOpenAt(index);
  };

  const closePhoto = () => {
    setOpenAt(null);
    returnRef.current?.focus();
  };

  const step = (by) =>
    setOpenAt((i) => (i + by + results.length) % results.length);

  useEffect(() => {
    if (openAt === null) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") closePhoto();
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKey);

    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = before;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAt === null, results.length]);

  useEffect(() => {
    if (openAt === null || results.length < 2) return;

    [1, -1].forEach((by) => {
      const image = new Image();
      image.src = mediaUrl(
        results[(openAt + by + results.length) % results.length].src
      );
    });
  }, [openAt, results]);

  const onTouchEnd = (event) => {
    if (touchX.current === null) return;

    const dx = event.changedTouches[0].clientX - touchX.current;
    touchX.current = null;

    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };

  const thumbFrom =
    openAt === null
      ? 0
      : Math.max(0, Math.min(openAt - 4, results.length - 9));

  const thumbs = results.slice(thumbFrom, thumbFrom + 9);

  if (!ready) return <main id="main" className="gal-page"><PageLoader /></main>;

  return (
    <main id="main" className="gal-page">
      <section
        className="gal-hero"
        aria-label="Photo gallery"
        style={{
          "--img": `url("${mediaUrl(
            banner || "/images/pages-banner.png"
          )}")`,
        }}
      >
        <div className="gal-hero__photo" />

        <div className="gal-hero__tags">
          <span className="gal-hero__tag gal-hero__tag--left">
            <span className="gal-hero__tag-icon">
              <FaGraduationCap aria-hidden="true" />
            </span>
            Government Polytechnic
          </span>

          <span className="gal-hero__tag gal-hero__tag--right">
            <span className="gal-hero__tag-icon">
              <FiMapPin aria-hidden="true" />
            </span>
            Rohtak (Haryana)
          </span>
        </div>

        <nav className="gal-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiCrumbArrow aria-hidden="true" />
          <span>Media</span>
          <FiCrumbArrow aria-hidden="true" />
          <span aria-current="page">Photos</span>
        </nav>
      </section>

      <div className="container gal-wrap">
        <div className="gal-top">
          <header className="gal-intro">
            <span className="gal-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <dl className="gal-stats">
            <div>
              <dt>{photos.length}</dt>
              <dd>Photos</dd>
            </div>
            <div>
              <dt>{categories.length}</dt>
              <dd>Categories</dd>
            </div>
            <div>
              <dt>1956</dt>
              <dd>Serving students since</dd>
            </div>
          </dl>
        </div>

        <section className="gal-browser" aria-label="Browse photos">
          <div className="gal-toolbar">
            <div className="gal-toolbar__row">
              <label className="gal-search">
                <FiSearch aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => changeQuery(event.target.value)}
                  placeholder="Search photos"
                  aria-label="Search photos"
                />
              </label>

              <p className="gal-count" aria-live="polite">
                Showing <b>{shown.length}</b> of {results.length}
              </p>
            </div>

            <div
              className="gal-filters"
              role="group"
              aria-label="Filter photos by category"
            >
              {["All", ...categories].map((name) => (
                <button
                  key={name}
                  type="button"
                  className={`gal-chip${name === category ? " is-active" : ""}`}
                  aria-pressed={name === category}
                  onClick={() => pickCategory(name)}
                >
                  {name}
                  <span className="gal-chip__n">
                    {name === "All" ? photos.length : countOf(name)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {results.length > 0 ? (
            <div className="gal-grid">
              {shown.map((photo, index) => (
                <Tile
                  key={photo.src}
                  photo={photo}
                  index={index}
                  onOpen={openPhoto}
                />
              ))}
            </div>
          ) : (
            <div className="gal-none">
              <span className="gal-none__icon">
                <FiImage aria-hidden="true" />
              </span>
              <h2>No photos found</h2>
              <p>Try another word or choose a different category.</p>
              <button
                type="button"
                className="gal-btn"
                onClick={() => {
                  setQuery("");
                  pickCategory("All");
                }}
              >
                Show all photos
              </button>
            </div>
          )}

          {remaining > 0 && (
            <div className="gal-more">
              <button
                type="button"
                className="gal-btn"
                onClick={() => setLimit((n) => n + PAGE_SIZE)}
              >
                <FiPlus aria-hidden="true" />
                Show {Math.min(PAGE_SIZE, remaining)} more photos
              </button>
              <span>{remaining} more in this view</span>
            </div>
          )}
        </section>
      </div>

      {open && (
        <div
          className="gal-viewer"
          role="dialog"
          aria-modal="true"
          aria-label={`Photo viewer: ${open.title}`}
        >
          <div className="gal-viewer__top">
            <span className="gal-viewer__count">
              <b>{openAt + 1}</b> / {results.length}
            </span>

            <button
              ref={closeRef}
              type="button"
              className="gal-viewer__btn"
              onClick={closePhoto}
              aria-label="Close viewer"
            >
              <FiX aria-hidden="true" />
            </button>
          </div>

          <div
            className="gal-viewer__stage"
            onClick={(event) => {
              if (event.target === event.currentTarget) closePhoto();
            }}
            onTouchStart={(event) => {
              touchX.current = event.touches[0].clientX;
            }}
            onTouchEnd={onTouchEnd}
          >
            {results.length > 1 && (
              <button
                type="button"
                className="gal-viewer__btn gal-viewer__nav gal-viewer__nav--prev"
                onClick={() => step(-1)}
                aria-label="Previous photo"
              >
                <FiChevronLeft aria-hidden="true" />
              </button>
            )}

            <figure className="gal-viewer__figure" key={open.src}>
              <Picture src={open.src} alt={open.title} />
            </figure>

            {results.length > 1 && (
              <button
                type="button"
                className="gal-viewer__btn gal-viewer__nav gal-viewer__nav--next"
                onClick={() => step(1)}
                aria-label="Next photo"
              >
                <FiChevronRight aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="gal-viewer__bottom">
            <p className="gal-viewer__title">
              <small>{open.category}</small>
              {open.title}
            </p>

            {thumbs.length > 1 && (
              <ul className="gal-viewer__thumbs" aria-label="More photos">
                {thumbs.map((photo, n) => {
                  const index = thumbFrom + n;

                  return (
                    <li key={photo.src}>
                      <button
                        type="button"
                        className={`gal-thumb${
                          index === openAt ? " is-active" : ""
                        }`}
                        onClick={() => setOpenAt(index)}
                        aria-label={`Show photo ${index + 1}: ${photo.title}`}
                        aria-current={
                          index === openAt ? "true" : undefined
                        }
                      >
                        <Picture src={photo.src} alt="" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </main>
  );
}