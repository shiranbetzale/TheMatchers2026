const crypto = require('crypto');
const {Buffer} = require('buffer');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, unique: true },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    passwordHash: { type: String, select: false },
    role: { type: String, enum: ['admin', 'matchmaker', 'user'], default: 'matchmaker' },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        return ret;
      },
    },
    toObject: {
      transform(_doc, ret) {
        delete ret.passwordHash;
        return ret;
      },
    },
  },
);

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

userSchema.methods.setPassword = function setPassword(password) {
  this.passwordHash = hashPassword(password);
};

userSchema.methods.verifyPassword = function verifyPassword(password) {
  if (!this.passwordHash) return false;
  const [salt, storedHash] = this.passwordHash.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(storedHash), Buffer.from(hash));
};

module.exports = mongoose.model('User', userSchema);
