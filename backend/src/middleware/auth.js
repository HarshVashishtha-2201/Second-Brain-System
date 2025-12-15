const jwt = require('jsonwebtoken');
const store = require('../store');

const secret = process.env.JWT_SECRET || 'secret';

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, secret);
    const user = store.findUserById(payload.id);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    req.user = { _id: user._id, id: user._id, email: user.email, name: user.name };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = authMiddleware;
