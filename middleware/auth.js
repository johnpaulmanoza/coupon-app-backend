// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user data to request
    next();
  } catch (err) {
    res.status(401).send({ message: 'Unauthorized' });
  }
};

const authorizeMerchant = (req, res, next) => {
  if (req.user.role_id !== 2) { // 2 = merchant
    return res.status(403).send({ message: 'Forbidden' });
  }
  next();
};

module.exports = { authenticate, authorizeMerchant };
