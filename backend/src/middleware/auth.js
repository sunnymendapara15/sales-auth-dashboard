const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ status: 'error', message: 'Authorization header missing or malformed' });
  }

  const token = authHeader.slice(7);
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    }

    req.user = payload;
    next();
  });
};
