
import { useEffect, useState } from "react";
import { FiImage, FiPlus, FiTrash2, FiUpload } from "react-icons/fi";
import AdminSidebar from "./AdminSidebar";
import {
  getMedia,
  mediaUrl,
  savePageBanner,
  savePhotos,
  savePhotoCategories,
  uploadMediaImage,
} from "../../services/mediaService";
import "./AdminPhotos.css";

export default function AdminPhotos() {
  const [photos, setPhotos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryDrafts, setCategoryDrafts] = useState([]);
  const [banner, setBanner] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Campus");
  const [newPhotoFile, setNewPhotoFile] = useState(null);
  const [newPhotoPreview, setNewPhotoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState({ text: "", error: false });

  const say = (text, error = false) => setMessage({ text, error });

  const load = async () => {
    const { media } = await getMedia();

    setPhotos((media?.photos || []).map((photo) => ({ ...photo })));

    const loadedCategories = media?.photoCategories || [];
    setCategories(loadedCategories);
    setCategoryDrafts(loadedCategories);
    setBanner(media?.banners?.gallery || "");
  };

  useEffect(() => {
    load()
      .catch((error) => say(error.message, true))
      .finally(() => setLoading(false));
  }, []);

  const selectNewPhoto = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return say("Please choose an image file.", true);
    }

    if (file.size > 5 * 1024 * 1024) {
      return say("Image must be 5 MB or smaller.", true);
    }

    if (newPhotoPreview) {
      URL.revokeObjectURL(newPhotoPreview);
    }

    setNewPhotoFile(file);
    setNewPhotoPreview(URL.createObjectURL(file));

    say(
      "Image selected. Preview it below, then save photo changes to upload it."
    );
  };

  const replaceImage = (index, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return say("Please choose an image file.", true);
    }

    if (file.size > 5 * 1024 * 1024) {
      return say("Image must be 5 MB or smaller.", true);
    }

    const previewUrl = URL.createObjectURL(file);

    setPhotos((items) =>
      items.map((photo, i) => {
        if (i !== index) return photo;

        if (photo._previewUrl) {
          URL.revokeObjectURL(photo._previewUrl);
        }

        return {
          ...photo,
          _pendingFile: file,
          _previewUrl: previewUrl,
        };
      })
    );

    say("Replacement selected. Save photo changes to upload it.");
  };

  const updateBanner = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setBusy(true);

    try {
      const src = await uploadMediaImage(file);
      const result = await savePageBanner("gallery", src);

      setBanner(result.banner || src);
      say("Photo Gallery banner updated successfully.");
    } catch (error) {
      say(error.message, true);
    } finally {
      setBusy(false);
    }
  };

  const removeBanner = async () => {
    if (
      !banner ||
      !window.confirm(
        "Remove the Photo Gallery custom banner? The existing website banner will be shown instead."
      )
    ) {
      return;
    }

    setBusy(true);

    try {
      await savePageBanner("gallery", "");
      setBanner("");
      say("Custom banner removed. The existing website banner is now shown.");
    } catch (error) {
      say(error.message, true);
    } finally {
      setBusy(false);
    }
  };

  const saveCategories = async () => {
    setBusy(true);

    try {
      const previousCategories = categories;
      const result = await savePhotoCategories(categoryDrafts);
      const updatedCategories = result.categories || categoryDrafts;

      const selectedIndex = previousCategories.indexOf(newCategory);

      if (selectedIndex >= 0) {
        setNewCategory(
          updatedCategories[selectedIndex] || updatedCategories[0] || ""
        );
      }

      setCategories(updatedCategories);
      setCategoryDrafts(updatedCategories);

      setPhotos(
        (result.photos || []).map((photo) => ({ ...photo }))
      );

      say("Existing photo category names updated successfully.");
    } catch (error) {
      say(error.message, true);
    } finally {
      setBusy(false);
    }
  };

  const save = async () => {
    if (!newTitle.trim() && newPhotoFile) {
      return say(
        "Enter a photo title before saving the selected image.",
        true
      );
    }

    setBusy(true);

    try {
      const prepared = [];

      for (const photo of photos) {
        if (photo._pendingFile) {
          const src = await uploadMediaImage(photo._pendingFile);

          prepared.push({
            ...photo,
            src,
          });
        } else {
          prepared.push(photo);
        }
      }

      if (newPhotoFile) {
        const src = await uploadMediaImage(newPhotoFile);

        prepared.push({
          src,
          title: newTitle.trim(),
          category: newCategory,
        });
      }

      const cleanPhotos = prepared.map(
        ({ _pendingFile, _previewUrl, ...photo }) => photo
      );

      const result = await savePhotos(cleanPhotos);

      photos.forEach((photo) => {
        if (photo._previewUrl) {
          URL.revokeObjectURL(photo._previewUrl);
        }
      });

      if (newPhotoPreview) {
        URL.revokeObjectURL(newPhotoPreview);
      }

      setPhotos(
        (result.photos || cleanPhotos).map((photo) => ({ ...photo }))
      );

      setNewPhotoFile(null);
      setNewPhotoPreview("");
      setNewTitle("");

      say("Photo gallery updated successfully.");
    } catch (error) {
      say(error.message, true);
    } finally {
      setBusy(false);
    }
  };

  const remove = (index) => {
    const photo = photos[index];

    if (
      !window.confirm(
        `Remove “${photo.title}” from the photo gallery?`
      )
    ) {
      return;
    }

    setPhotos((items) => items.filter((_, i) => i !== index));

    say("Photo removed from the draft. Save changes to confirm deletion.");
  };

  const edit = (index, patch) => {
    setPhotos((items) =>
      items.map((photo, i) =>
        i === index ? { ...photo, ...patch } : photo
      )
    );
  };

  return (
    <AdminSidebar title="Photos">
      <main className="am-page">
        <header className="am-heading">
          <div>
            <h2>Photo gallery management</h2>
            <p>
              Upload, replace, caption, categorize or remove gallery images.
              Existing categories can be renamed, but not added or deleted.
            </p>
          </div>

          <a
            className="am-view"
            href="/media/photos"
            target="_blank"
            rel="noreferrer"
          >
            View live page ↗
          </a>
        </header>

        {message.text && (
          <p
            className={`am-message${message.error ? " is-error" : ""}`}
            role="status"
          >
            {message.text}
          </p>
        )}

        <section className="am-panel am-banner-panel">
          <div className="am-panel__head">
            <div>
              <h3>Photo Gallery banner</h3>
              <p>
                Upload or replace this page's banner. Removing it shows the
                existing frontend banner.
              </p>
            </div>
          </div>

          <div className="am-banner-preview">
            <img
              src={banner ? mediaUrl(banner) : "/images/pages-banner.png"}
              alt="Photo Gallery banner preview"
            />
          </div>

          <div className="am-actions">
            <label className="am-upload">
              <FiUpload />
              {banner ? "Replace banner" : "Upload banner"}
              <input
                type="file"
                accept="image/*"
                onChange={updateBanner}
                disabled={busy}
              />
            </label>

            {banner && (
              <button
                type="button"
                className="am-btn am-btn--danger"
                onClick={removeBanner}
                disabled={busy}
              >
                <FiTrash2 /> Remove custom banner
              </button>
            )}
          </div>
        </section>

        <section className="am-panel">
          <div className="am-panel__head">
            <div>
              <h3>Manage existing categories</h3>
              <p>
                Rename the existing categories. You cannot add or delete
                categories here. Renaming a category updates every photo
                assigned to it.
              </p>
            </div>
          </div>

          <div className="am-category-grid">
            {categoryDrafts.map((category, index) => (
              <label
                className="am-field"
                key={`${categories[index] || index}-${index}`}
              >
                Category {index + 1}

                <input
                  value={category}
                  onChange={(event) =>
                    setCategoryDrafts((items) =>
                      items.map((item, i) =>
                        i === index ? event.target.value : item
                      )
                    )
                  }
                />
              </label>
            ))}
          </div>

          <div className="am-actions">
            <button
              type="button"
              className="am-btn am-btn--primary"
              onClick={saveCategories}
              disabled={busy || loading || !categoryDrafts.length}
            >
              Save category names
            </button>
          </div>
        </section>

        <section className="am-panel">
          <div className="am-panel__head">
            <div>
              <h3>Add a photo</h3>
              <p>
                Only image files are accepted. Maximum size: 5 MB.
                Images upload only when you save changes.
              </p>
            </div>
          </div>

          <div className="am-row">
            <label className="am-field">
              Photo title
              <input
                value={newTitle}
                onChange={(event) => setNewTitle(event.target.value)}
                placeholder="e.g. Annual sports day"
              />
            </label>

            <label className="am-field">
              Existing category
              <select
                value={newCategory}
                onChange={(event) => setNewCategory(event.target.value)}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="am-actions">
            <label className="am-upload">
              <FiUpload />
              Choose image
              <input
                type="file"
                accept="image/*"
                onChange={selectNewPhoto}
                disabled={busy}
              />
            </label>
          </div>

          {newPhotoPreview && (
            <div className="am-selected-preview">
              <img
                src={newPhotoPreview}
                alt="Selected new photo preview"
              />

              <div>
                <strong>Selected image preview</strong>

                <button
                  type="button"
                  className="am-btn am-btn--danger"
                  onClick={() => {
                    URL.revokeObjectURL(newPhotoPreview);
                    setNewPhotoPreview("");
                    setNewPhotoFile(null);
                  }}
                >
                  Cancel selection
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="am-panel">
          <div className="am-panel__head">
            <div>
              <h3>Existing photos ({photos.length})</h3>
              <p>
                Edit the title/category, replace an image, or remove it from
                the gallery.
              </p>
            </div>
          </div>

          {loading ? (
            <p className="am-empty">Loading photos…</p>
          ) : photos.length ? (
            <div className="am-grid">
              {photos.map((photo, index) => (
                <article
                  className="am-item"
                  key={photo._id || `${photo.src}-${index}`}
                >
                  <div className="am-preview">
                    {photo._previewUrl || photo.src ? (
                      <img
                        src={
                          photo._previewUrl || mediaUrl(photo.src)
                        }
                        alt={photo.title}
                      />
                    ) : (
                      <FiImage />
                    )}
                  </div>

                  <label className="am-field">
                    Photo title
                    <input
                      value={photo.title || ""}
                      onChange={(event) =>
                        edit(index, { title: event.target.value })
                      }
                    />
                  </label>

                  <label className="am-field">
                    Category
                    <select
                      value={photo.category || "Campus"}
                      onChange={(event) =>
                        edit(index, { category: event.target.value })
                      }
                    >
                      {categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </label>

                  <div className="am-actions">
                    <label className="am-upload">
                      <FiUpload />
                      Choose replacement
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          replaceImage(index, event)
                        }
                        disabled={busy}
                      />
                    </label>

                    <button
                      type="button"
                      className="am-btn am-btn--danger"
                      onClick={() => remove(index)}
                      disabled={busy}
                    >
                      <FiTrash2 /> Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="am-empty">No photos have been added yet.</p>
          )}
        </section>

        <div className="am-savebar">
          <button
            type="button"
            className="am-btn am-btn--primary"
            onClick={save}
            disabled={busy || loading}
          >
            {busy ? "Saving…" : "Save photo changes"}
          </button>
        </div>
      </main>
    </AdminSidebar>
  );
}
