const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  fullName: {type: String, required: true},
  classLevel: {type: String},
  parentPhone: {type: String},
  regNo: {type: String, unique: true}
}, {timestamps: true});

module.exports = mongoose.model('Student', StudentSchema);
