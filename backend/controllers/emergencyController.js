const EmergencyRequest = require('../models/EmergencyRequest');

const createEmergency = async (req, res) => {
  const { location, patientName, notes, type } = req.body;
  if (!location || !patientName)
    return res.status(400).json({ message: 'Location and patient name are required' });

  const emergency = await EmergencyRequest.create({
    userId:      req.user?._id || null,
    patientName, location,
    notes:       notes || '',
    type:        type  || 'SOS',
  });
  res.status(201).json({ success: true, emergency });
};

const getAllEmergencies = async (req, res) => {
  const emergencies = await EmergencyRequest.find().sort({ createdAt: -1 });
  res.json(emergencies);
};

const updateEmergencyStatus = async (req, res) => {
  const em = await EmergencyRequest.findByIdAndUpdate(
    req.params.id, { status: req.body.status }, { new: true }
  );
  if (!em) return res.status(404).json({ message: 'Not found' });
  res.json(em);
};

module.exports = { createEmergency, getAllEmergencies, updateEmergencyStatus };
