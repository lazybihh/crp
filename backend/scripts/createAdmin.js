// Creates an admin, or sets a new password for an existing one.
//   npm run create-admin
// Run it on the computer/server that has backend/.env. The password is typed here and only its hash is saved.
const path = require("path");
const readline = require("readline");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Admin = require("../models/Admin");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (question) => new Promise((resolve) => rl.question(question, resolve));

// The password is shown while you type, so you can see what you are entering.
const askHidden = ask;

(async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing in backend/.env");
    const username = (await ask("Admin username: ")).trim().toLowerCase();
    if (!username) throw new Error("Username cannot be empty.");
    const password = await askHidden("Password (at least 10 characters): ");
    if (password.length < 10) throw new Error("Password must be at least 10 characters.");
    const again = await askHidden("Type the password again: ");
    if (password !== again) throw new Error("The two passwords do not match.");

    await mongoose.connect(process.env.MONGO_URI);
    const existing = await Admin.findOne({ username });
    await Admin.findOneAndUpdate({ username }, { username, ...Admin.hashPassword(password) }, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log(existing ? `Password updated for "${username}".` : `Admin "${username}" created. You can log in now.`);
  } catch (error) {
    console.log("Not saved:", error.message);
    process.exitCode = 1;
  } finally {
    rl.close();
    await mongoose.disconnect().catch(() => {});
  }
})();