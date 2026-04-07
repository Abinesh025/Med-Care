const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName:     { type: String },
  doctorId:        { type: String, required: true },
  doctorName:      { type: String, required: true },
  doctorSpecialty: { type: String },
  date:            { type: Date, required: true },
  timeSlot:        { type: String, required: true },
  reason:          { type: String, required: true },
  status:          { type: String, enum: ['scheduled','completed','cancelled'], default: 'scheduled' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
