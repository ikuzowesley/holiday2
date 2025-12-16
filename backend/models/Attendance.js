const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  studentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true},
  date: {type: Date, required: true},
  status: {type: String, enum: ['present','absent','late'], required: true}
}, {timestamps: true});

module.exports = mongoose.model('Attendance', AttendanceSchema);
