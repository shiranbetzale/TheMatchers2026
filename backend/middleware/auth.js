let jwt;
try {
  jwt = require('jsonwebtoken');
} catch (err) {
  jwt = null;
}
const User = require('../models/User');

function requireAuth(roles = []) {
  return async (req, res, next) => {
    try {
      if (!jwt) {
        return res.status(500).json({ error: 'server_error', message: 'jsonwebtoken not installed' });
      }
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
      if (!token) {
        return res.status(401).json({ error: 'unauthorized' });
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.sub);
      if (!user || !user.isActive) {
        return res.status(401).json({ error: 'unauthorized' });
      }

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ error: 'forbidden' });
      }

      req.user = user;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'unauthorized' });
    }
  };
}

module.exports = { requireAuth };
