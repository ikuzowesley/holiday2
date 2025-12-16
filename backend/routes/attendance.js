const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'verysecretkey';

function auth(req, res, next){
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({error: 'No token'});
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch(e) {
    return res.status(401).json({error: 'Invalid token'});
  }
}

// Add attendance
router.post('/', auth, async (req, res) => {
  try {
    if(!['admin','teacher'].includes(req.user.role)) return res.status(403).json({error: 'Forbidden'});
    const {studentId, date, status} = req.body;
    if(!studentId || !date || !status) return res.status(400).json({error: 'studentId, date and status required'});
    const s = await Student.findById(studentId);
    if(!s) return res.status(400).json({error: 'Student not found'});
    const a = await Attendance.create({studentId, date: new Date(date), status});
    res.json({message: 'Attendance recorded', attendance: a});
  } catch(err){ console.error(err); res.status(500).json({error:'Server error'}); }
});

// Get attendance (by date)
router.get('/', auth, async (req, res) => {
  try {
    const {date} = req.query;
    const filter = {};
    if(date) {
      const d = new Date(date);
      const next = new Date(d); next.setDate(d.getDate()+1);
      filter.date = { $gte: d, $lt: next };
    }
    const records = await Attendance.find(filter).populate('studentId');
    res.json({records});
  } catch(err){ console.error(err); res.status(500).json({error:'Server error'}); }
});

module.exports = router;
