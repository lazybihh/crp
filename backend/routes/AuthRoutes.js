const express = require("express");
const Admin = require("../models/Admin");
const { createToken, readToken, tooManyTries, noteTry } = require("../middleware/auth");

const router = express.Router();

// Log in -> { token }
router.post("/login", async (req, res) => {
  if (!process.env.AUTH_SECRET) {
    return res.status(503).json({ message: "Admin login is not set up. Add AUTH_SECRET to backend/.env and restart." });
  }
  if (tooManyTries(req.ip)) return res.status(429).json({ message: "Too many wrong tries. Please wait 15 minutes." });
  try {
    const username = String(req.body?.username || "").trim().toLowerCase();
    const password = String(req.body?.password || "");
    const admin = username ? await Admin.findOne({ username }) : null;
    let ok = false;
    if (admin) ok = admin.checkPassword(password);
    else Admin.fakeCheck(password);
    noteTry(req.ip, ok);
    if (!ok) return res.status(401).json({ message: "Wrong username or password." });
    res.json({ token: createToken(admin.username), username: admin.username });
  } catch (error) {
    res.status(500).json({ message: "Login failed. Is the database connected?" });
  }
});

// Is this token still good?
router.get("/me", (req, res) => {
  const data = readToken(req.headers.authorization);
  if (!data) return res.status(401).json({ message: "Please log in as admin." });
  res.json({ username: data.u });
});

module.exports = router;