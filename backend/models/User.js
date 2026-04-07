const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:           { type: String, required: true, trim: true },
  email:          { type: String, required: true, unique: true, lowercase: true },
  password:       { type: String, required: true, minlength: 6 },
  phone:          { type: String, default: '' },
  role:           { type: String, enum: ['patient', 'admin'], default: 'patient' },
  age:            { type: Number, default: null },
  bloodGroup:     { type: String, default: '' },
  allergies:      { type: String, default: '' },
  medicalHistory: { type: String, default: '' },
}, { timestamps: true });

// Mongoose v9 async pre-save (no `next` needed)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
