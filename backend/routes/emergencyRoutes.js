const router = require('express').Router();
const {
  createEmergency,
  getAllEmergencies,
  updateEmergencyStatus,
} = require('../controllers/emergencyController');
const { protect, adminOnly } = require('../middleware/auth');

// Public-ish: allow unauthenticated calls (emergency can happen without login)
// We optionally attach user if token present
const optionalAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    try {
      const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
      User.findById(decoded.id).select('-password').then((u) => {
        req.user = u;
        next();
      }).catch(() => next());
    } catch { next(); }
  } else { next(); }
};

router.post('/',             optionalAuth, createEmergency);
router.get('/all',           protect, adminOnly, getAllEmergencies);
router.patch('/:id/status',  protect, adminOnly, updateEmergencyStatus);

module.exports = router;
