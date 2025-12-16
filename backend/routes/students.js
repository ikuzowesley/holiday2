const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'verysecretkey';

// middleware to protect routes
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

// Create student (admin/teacher)
router.post('/', auth, async (req, res) => {
  try {
    if(!['admin','teacher'].includes(req.user.role)) return res.status(403).json({error: 'Forbidden'});
    const {fullName, classLevel, parentPhone, regNo} = req.body;
    if(!fullName) return res.status(400).json({error: 'fullName required'});
    const s = await Student.create({fullName, classLevel, parentPhone, regNo});
    res.json({message: 'Student created', student: s});
  } catch(err){ console.error(err); res.status(500).json({error:'Server error'}); }
});

// Read all students
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find().sort({createdAt:-1});
    res.json({students});
  } catch(err){ console.error(err); res.status(500).json({error:'Server error'}); }
});

// Update student
router.put('/:id', auth, async (req, res) => {
  try {
    if(!['admin','teacher'].includes(req.user.role)) return res.status(403).json({error: 'Forbidden'});
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {new:true});
    res.json({message: 'Updated', student: updated});
  } catch(err){ console.error(err); res.status(500).json({error:'Server error'}); }
});

// Delete
router.delete('/:id', auth, async (req, res) => {
  try {
    if(req.user.role !== 'admin') return res.status(403).json({error: 'Only admin can delete'});
    await Student.findByIdAndDelete(req.params.id);
    res.json({message: 'Deleted'});
  } catch(err){ console.error(err); res.status(500).json({error:'Server error'}); }
});

module.exports = router;
