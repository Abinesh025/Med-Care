const Appointment = require('../models/Appointment');

// GET /api/appointments  — own appointments
const getMyAppointments = async (req, res) => {
  const appointments = await Appointment.find({ userId: req.user._id }).sort({ date: -1 });
  res.json(appointments);
};

// GET /api/appointments/all  — admin: all
const getAllAppointments = async (req, res) => {
  const appointments = await Appointment
    .find()
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  const result = appointments.map((a) => ({
    ...a.toObject(),
    patientName: a.userId?.name || a.patientName || 'Unknown',
  }));
  res.json(result);
};

// POST /api/appointments
const createAppointment = async (req, res) => {
  const { doctorId, doctorName, doctorSpecialty, date, timeSlot, reason } = req.body;
  if (!doctorId || !date || !timeSlot || !reason)
    return res.status(400).json({ message: 'All fields are required' });

  const conflict = await Appointment.findOne({ doctorId, date: new Date(date), timeSlot, status: 'scheduled' });
  if (conflict) return res.status(409).json({ message: 'This time slot is already booked' });

  const appointment = await Appointment.create({
    userId: req.user._id,
    patientName: req.user.name,
    doctorId, doctorName, doctorSpecialty,
    date: new Date(date),
    timeSlot, reason,
  });
  res.status(201).json(appointment);
};

// PATCH /api/appointments/:id/cancel
const cancelAppointment = async (req, res) => {
  const apt = await Appointment.findOne({ _id: req.params.id, userId: req.user._id });
  if (!apt) return res.status(404).json({ message: 'Appointment not found' });
  if (apt.status !== 'scheduled') return res.status(400).json({ message: 'Cannot cancel this appointment' });
  apt.status = 'cancelled';
  await apt.save();
  res.json(apt);
};

// PATCH /api/appointments/:id/status  — admin
const updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!['scheduled', 'completed', 'cancelled'].includes(status))
    return res.status(400).json({ message: 'Invalid status' });

  const apt = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!apt) return res.status(404).json({ message: 'Appointment not found' });
  res.json(apt);
};

module.exports = { getMyAppointments, getAllAppointments, createAppointment, cancelAppointment, updateStatus };
