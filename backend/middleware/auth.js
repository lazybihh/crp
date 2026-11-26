// auth.js - one admin account. The login gives a signed token that is valid for 12 hours.
// Nothing to install: it uses Node's built-in crypto.
const crypto = require("crypto");

const TOKEN_HOURS = 12;

const secret = () => process.env.AUTH_SECRET || "";
const sign = (text) => crypto.createHmac("sha256", secret()).update(text).digest("base64url");

function safeEqual(a, b) {
  const x = crypto.createHash("sha256").update(String(a)).digest();
  const y = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

function createToken(username) {
  const body = Buffer.from(JSON.stringify({ u: username, exp: Date.now() + TOKEN_HOURS * 3600 * 1000 })).toString("base64url");
  return `${body}.${sign(body)}`;
}

function readToken(header) {
  if (!secret()) return null;
  const token = String(header || "").replace(/^Bearer\s+/i, "");
  const [body, signature] = token.split(".");
  if (!body || !signature || !safeEqual(signature, sign(body))) return null;
  try {
    const data = JSON.parse(Buffer.from(body, "base64url").toString());
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

// Things the public website must still be able to do without logging in.
const PUBLIC_WRITES = new Set(["POST /enquiries", "POST /enquiries/complaint"]);
// Reading these is for the admin only.
const PRIVATE_READS = new Set(["/enquiries", "/events/all", "/notices/all"]);

// Mounted on /api: every save, upload and delete needs the token, and so do the admin-only lists.
function authGate(req, res, next) {
  const path = req.path.replace(/\/+$/, "") || "/";
  const isRead = ["GET", "HEAD", "OPTIONS"].includes(req.method);
  if (isRead && !PRIVATE_READS.has(path)) return next();
  if (PUBLIC_WRITES.has(`${req.method} ${path}`)) return next();
  if (readToken(req.headers.authorization)) return next();
  res.status(401).json({ message: "Please log in as admin." });
}

// Stops guessing: 8 wrong tries from one address -> wait 15 minutes.
const attempts = new Map();
function tooManyTries(ip) {
  const row = attempts.get(ip);
  return row && row.count >= 8 && Date.now() - row.first < 15 * 60 * 1000;
}
function noteTry(ip, ok) {
  if (ok) return attempts.delete(ip);
  const row = attempts.get(ip);
  if (!row || Date.now() - row.first > 15 * 60 * 1000) attempts.set(ip, { count: 1, first: Date.now() });
  else row.count += 1;
}

module.exports = { authGate, createToken, readToken, safeEqual, tooManyTries, noteTry };
