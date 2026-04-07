const router = require('express').Router();
const {
  getMyAppointments,
  getAllAppointments,
  createAppointment,
  cancelAppointment,
  updateStatus,
} = require('../controllers/appointmentController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/',             protect, getMyAppointments);
router.get('/all',          protect, adminOnly, getAllAppointments);
router.post('/',            protect, createAppointment);
router.patch('/:id/cancel', protect, cancelAppointment);
router.patch('/:id/status', protect, adminOnly, updateStatus);

module.exports = router;
