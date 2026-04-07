const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  patientName: { type: String, required: true },
  location:    { type: String, required: true },
  notes:       { type: String, default: '' },
  type:        { type: String, default: 'SOS' },
  status:      { type: String, enum: ['active','resolved','false-alarm'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('EmergencyRequest', emergencySchema);
