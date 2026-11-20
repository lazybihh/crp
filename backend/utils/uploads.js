const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const uploadsFolder = path.resolve(__dirname, "..", "uploads");
const modelsFolder = path.resolve(__dirname, "..", "models");
const uploadPattern = /^\/uploads\/[A-Za-z0-9._-]+$/;

function collectUploads(value) {
  const found = new Set();
  const visited = new WeakSet();
  const visit = (item) => {
    if (typeof item === "string") {
      if (uploadPattern.test(item)) found.add(item);
      return;
    }
    if (!item || typeof item !== "object") return;
    if (visited.has(item)) return;
    visited.add(item);
    if (!Array.isArray(item) && typeof item.toObject === "function") {
      try {
        visit(item.toObject());
        return;
      } catch (error) {
        console.log("Could not inspect an uploaded-image document:", error.message);
      }
    }
    for (const child of Array.isArray(item) ? item : Object.values(item)) visit(child);
  };
  visit(value);
  return found;
}

function getModels() {
  let loadFailed = false;
  for (const file of fs.readdirSync(modelsFolder).filter((name) => name.endsWith(".js"))) {
    try {
      require(path.join(modelsFolder, file));
    } catch (error) {
      loadFailed = true;
      console.log(`Could not load model ${file}:`, error.message);
    }
  }
  return { models: [...new Set(Object.values(mongoose.models))], loadFailed };
}

async function isStillUsed(uploadPath) {
  const { models, loadFailed } = getModels();
  if (loadFailed) return true;
  for (const Model of models) {
    try {
      const documents = await Model.find({}).lean();
      if (documents.some((document) => collectUploads(document).has(uploadPath))) return true;
    } catch (error) {
      console.log(`Could not check ${Model.collection.collectionName} for ${uploadPath}:`, error.message);
      return true;
    }
  }
  return false;
}

async function removeUnused(before, after) {
  try {
    const oldUploads = collectUploads(before);
    const newUploads = collectUploads(after);
    for (const uploadPath of oldUploads) {
      if (newUploads.has(uploadPath) || await isStillUsed(uploadPath)) continue;
      const filename = path.basename(uploadPath);
      if (!filename || filename === "." || filename === "..") continue;
      const target = path.resolve(uploadsFolder, filename);
      const relative = path.relative(uploadsFolder, target);
      if (!relative || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
        console.log(`Skipped unsafe upload path: ${uploadPath}`);
        continue;
      }
      try {
        await fs.promises.unlink(target);
        console.log(`Removed unused upload: ${uploadPath}`);
      } catch (error) {
        if (error.code !== "ENOENT") console.log(`Could not remove ${uploadPath}:`, error.message);
      }
    }
  } catch (error) {
    console.log("Could not complete unused-upload cleanup:", error.message);
  }
}

module.exports = { uploadsFolder, collectUploads, isStillUsed, removeUnused, getModels };
