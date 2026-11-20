const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { uploadsFolder, collectUploads, getModels } = require("../utils/uploads");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

async function main() {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured in backend/.env");
  await mongoose.connect(process.env.MONGO_URI);
  try {
    const { models, loadFailed } = getModels();
    if (loadFailed) throw new Error("One or more models could not be loaded; no cleanup was performed.");

    const references = new Map();
    for (const Model of models) {
      const collection = Model.collection.collectionName;
      const documents = await Model.find({}).lean();
      for (const document of documents) {
        for (const uploadPath of collectUploads(document)) {
          if (!references.has(uploadPath)) references.set(uploadPath, new Set());
          references.get(uploadPath).add(collection);
        }
      }
    }

    console.log("Uploaded files referenced by MongoDB:");
    if (!references.size) console.log("  (none)");
    for (const [uploadPath, collections] of references) {
      const filename = path.basename(uploadPath);
      const filePath = path.resolve(uploadsFolder, filename);
      const relative = path.relative(uploadsFolder, filePath);
      if (!relative || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
        console.log(`  ${uploadPath} — skipped unsafe path`);
        continue;
      }
      let exists = true;
      try { await fs.promises.access(filePath); } catch { exists = false; }
      console.log(`  ${uploadPath} — ${[...collections].join(", ")}${exists ? "" : " (file missing)"}`);
    }

    const entries = await fs.promises.readdir(uploadsFolder, { withFileTypes: true });
    const deleteMode = process.argv.includes("--delete");
    const orphaned = [];
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const uploadPath = `/uploads/${entry.name}`;
      if (/^\/uploads\/[A-Za-z0-9._-]+$/.test(uploadPath) && !references.has(uploadPath)) {
        const filePath = path.resolve(uploadsFolder, path.basename(uploadPath));
        const relative = path.relative(uploadsFolder, filePath);
        if (relative && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative)) orphaned.push({ uploadPath, filePath });
      }
    }

    console.log(deleteMode ? "Unreferenced uploaded files:" : "Dry run — unreferenced uploaded files (not deleted):");
    if (!orphaned.length) console.log("  (none)");
    for (const item of orphaned) {
      const stats = await fs.promises.stat(item.filePath);
      if (deleteMode) {
        await fs.promises.unlink(item.filePath);
        console.log(`  Deleted ${item.uploadPath} (${stats.size} bytes)`);
      } else {
        console.log(`  ${item.uploadPath} (${stats.size} bytes)`);
      }
    }
    if (!deleteMode) console.log("Run with --delete to remove only these unreferenced upload files.");
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((error) => {
  console.error("Upload cleanup failed:", error.message);
  process.exitCode = 1;
});
