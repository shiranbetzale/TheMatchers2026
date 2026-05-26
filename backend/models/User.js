const crypto = require('crypto');
const {Buffer} = require('buffer');
const {createFirestoreModel} = require('./firestoreModel');

const User = createFirestoreModel('users', {
  modelName: 'User',
  uniqueFields: ['phone', 'email'],
  defaults: {
    role: 'matchmaker',
    isActive: true,
  },
});

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return `${salt}:${hash}`;
}

User.prototype.setPassword = function setPassword(password) {
  this.passwordHash = hashPassword(password);
};

User.prototype.verifyPassword = function verifyPassword(password) {
  if (!this.passwordHash) return false;
  const [salt, storedHash] = this.passwordHash.split(':');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return crypto.timingSafeEqual(Buffer.from(storedHash), Buffer.from(hash));
};

module.exports = User;
