const mongoose = require("mongoose");
const crypto = require("crypto");

// One document per admin. The password is never stored: only a salted scrypt hash of it.
const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    salt: { type: String, required: true },
    hash: { type: String, required: true },
  },
  { timestamps: true }
);

const scrypt = (password, salt) => crypto.scryptSync(String(password), salt, 64).toString("hex");

adminSchema.statics.hashPassword = function (password) {
  const salt = crypto.randomBytes(16).toString("hex");
  return { salt, hash: scrypt(password, salt) };
};

adminSchema.methods.checkPassword = function (password) {
  return crypto.timingSafeEqual(Buffer.from(scrypt(password, this.salt), "hex"), Buffer.from(this.hash, "hex"));
};

// Used when the username does not exist, so a wrong name takes as long as a wrong password.
adminSchema.statics.fakeCheck = function (password) {
  scrypt(password, "0".repeat(32));
};

module.exports = mongoose.models.Admin || mongoose.model("Admin", adminSchema);