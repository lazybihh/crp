// Media > Social Links. Official links are managed from the Media admin section.
import { useEffect, useRef, useState } from "react";
import {
  FiArrowUpRight,
  FiCopy,
  FiCheck,
  FiCheckCircle,
  FiShare2,
  FiPhone,
  FiMail,
  FiMapPin as FiPin,
  FiChevronRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import "./SocialLinks.css";
import { useSite, socialIcon } from "../../context/SiteSettingsContext";
import { getMedia, mediaUrl } from "../../services/mediaService";

const intro = {
  eyebrow: "Media",
  title: "Social Links",
  lead: "Follow Chhotu Ram Polytechnic for campus updates, events and announcements. Our official pages are listed below - always use these links.",
};

const FALLBACK_SOCIAL_LINKS = [
  {
    platform: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/C.R.POLYTECHNIC.ROHTAK",
    handle: "C.R. Polytechnic Rohtak",
    description:
      "The official page for news, notices and event updates from the institute.",
    topics: ["Notices", "News", "Event updates"],
    accent: "sky",
    cta: "Visit our Facebook page",
  },
  {
    platform: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/crprohtak/",
    handle: "@crprohtak",
    description:
      "Photos and short stories from campus life, events and celebrations.",
    topics: ["Campus life", "Events", "Student moments"],
    accent: "orange",
    cta: "Follow on Instagram",
  },
];

function formatChannels(items) {
  return (items || [])
    .filter((item) => item.url && item.published !== false)
    .map((item) => ({
      ...item,
      id: item._id || `${item.platform}-${item.label}`,
      name: item.label || item.platform,
      icon: socialIcon(item.platform),
      text:
        item.description ||
        "Visit the institute's official page for updates.",
      topics: item.topics || [],
      cta: item.cta || "Visit page",
      accent: item.accent || "sky",
    }));
}

export default function SocialLinks() {
  const { contact: contactSettings } = useSite();

  const [channels, setChannels] = useState(
    formatChannels(FALLBACK_SOCIAL_LINKS)
  );

  const [banner, setBanner] = useState("");
  const [copied, setCopied] = useState(null);

  const timer = useRef(null);

  useEffect(() => {
    let active = true;

    getMedia()
      .then(({ media }) => {
        if (!active) return;

        setBanner(media?.banners?.socialLinks || "");
        setChannels(formatChannels(media?.socialLinks || []));
      })
      .catch((loadError) => {
        console.warn(
          "Media API unavailable; showing local social links.",
          loadError
        );
      });

    return () => {
      active = false;
    };
  }, []);

  const phones = (contactSettings?.phones || []).filter(Boolean);

  const address = (contactSettings?.addressLines || [])
    .filter(Boolean)
    .join(", ");

  const mapUrl =
    contactSettings?.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;

  const reach = [
    ...(phones.length
      ? [
          {
            id: "phone",
            icon: FiPhone,
            label: "Phone",
            value: phones.join(", "),
            action: "Call now",
            href: `tel:${phones[0].replace(/[^\d+]/g, "")}`,
          },
        ]
      : []),

    ...(contactSettings?.alumniEmail
      ? [
          {
            id: "email",
            icon: FiMail,
            label: "Email",
            value: contactSettings.alumniEmail,
            action: "Write an email",
            href: `mailto:${contactSettings.alumniEmail}`,
          },
        ]
      : []),

    ...(address
      ? [
          {
            id: "address",
            icon: FiPin,
            label: "Address",
            value: address,
            action: "Open in Maps",
            href: mapUrl,
            external: true,
          },
        ]
      : []),
  ];

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt("Copy this link", text);
      return;
    }

    setCopied(id);
    clearTimeout(timer.current);

    timer.current = setTimeout(() => setCopied(null), 2000);
  };

  const sharePage = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
      } catch {
        // Share sheet closed.
      }
      return;
    }

    copy("page", url);
  };

  return (
    <main id="main" className="soc-page">
      <section
        className="soc-hero"
        aria-label="Social links"
        style={{
          "--img": `url("${mediaUrl(
            banner || "/images/pages-banner.png"
          )}")`,
        }}
      >
        <div className="soc-hero__photo" />

        <div className="soc-hero__tags">
          <span className="soc-hero__tag soc-hero__tag--left">
            <span className="soc-hero__tag-icon">
              <FaGraduationCap aria-hidden="true" />
            </span>
            Government Polytechnic
          </span>

          <span className="soc-hero__tag soc-hero__tag--right">
            <span className="soc-hero__tag-icon">
              <FiMapPin aria-hidden="true" />
            </span>
            Rohtak (Haryana)
          </span>
        </div>

        <nav className="soc-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <FiChevronRight aria-hidden="true" />
          <span>Media</span>
          <FiChevronRight aria-hidden="true" />
          <span aria-current="page">Social Links</span>
        </nav>
      </section>

      <div className="container soc-wrap">
        <div className="soc-top">
          <header className="soc-intro">
            <span className="soc-eyebrow">{intro.eyebrow}</span>
            <h1>{intro.title}</h1>
            <p>{intro.lead}</p>
          </header>

          <aside className="soc-reach" aria-label="Contact details">
            <h2>Reach us directly</h2>

            <ul>
              {reach.map((item) => {
                const Icon = item.icon;

                return (
                  <li key={item.id}>
                    <span className="soc-reach__icon">
                      <Icon aria-hidden="true" />
                    </span>

                    <div>
                      <span className="soc-reach__label">
                        {item.label}
                      </span>

                      <strong>{item.value}</strong>

                      <a
                        href={item.href}
                        {...(item.external
                          ? {
                              target: "_blank",
                              rel: "noopener noreferrer",
                            }
                          : {})}
                      >
                        {item.action}
                        <FiArrowUpRight aria-hidden="true" />
                      </a>
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>

        <section
          className="soc-channels"
          aria-labelledby="soc-channels-title"
        >
          <header className="soc-head">
            <span className="soc-eyebrow">Official pages</span>
            <h2 id="soc-channels-title">
              Find us <span>online</span>
            </h2>
          </header>

          {channels.length ? (
            <ul className="soc-grid">
              {channels.map((channel) => {
                const Icon = channel.icon;

                return (
                  <li key={channel.id}>
                    <article
                      className={`soc-card soc-card--${channel.accent}`}
                    >
                      <Icon
                        className="soc-card__ghost"
                        aria-hidden="true"
                      />

                      <div className="soc-card__head">
                        <span className="soc-card__icon">
                          <Icon aria-hidden="true" />
                        </span>

                        <span className="soc-card__badge">
                          <FiCheckCircle aria-hidden="true" />
                          Official page
                        </span>
                      </div>

                      <div className="soc-card__body">
                        <span className="soc-card__name">
                          {channel.name}
                        </span>

                        <strong>
                          {channel.handle || channel.name}
                        </strong>

                        <p>{channel.text}</p>

                        {channel.topics?.length > 0 && (
                          <ul
                            className="soc-card__topics"
                            aria-label={`What you will find on ${channel.name}`}
                          >
                            {channel.topics.map((topic) => (
                              <li key={topic}>{topic}</li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="soc-card__actions">
                        <a
                          className="soc-btn soc-btn--primary"
                          href={channel.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {channel.cta}
                          <FiArrowUpRight aria-hidden="true" />
                        </a>

                        <button
                          type="button"
                          className="soc-btn soc-btn--ghost"
                          onClick={() =>
                            copy(channel.id, channel.url)
                          }
                          aria-label={`Copy the ${channel.name} link`}
                        >
                          {copied === channel.id ? (
                            <FiCheck aria-hidden="true" />
                          ) : (
                            <FiCopy aria-hidden="true" />
                          )}

                          {copied === channel.id
                            ? "Copied"
                            : "Copy link"}
                        </button>
                      </div>
                    </article>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="soc-empty">
              Official social links will appear here when they are added
              by the institute.
            </p>
          )}
        </section>

        <section className="soc-share" aria-label="Share this page">
          <div>
            <h2>Know someone who should follow us?</h2>
            <p>
              Share this page with friends, parents and alumni so they
              never miss an update.
            </p>
          </div>

          <button
            type="button"
            className="soc-btn soc-btn--primary"
            onClick={sharePage}
          >
            {copied === "page" ? (
              <FiCheck aria-hidden="true" />
            ) : (
              <FiShare2 aria-hidden="true" />
            )}

            {copied === "page" ? "Link copied" : "Share this page"}
          </button>
        </section>
      </div>
    </main>
  );
}