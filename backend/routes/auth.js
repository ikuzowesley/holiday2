const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'verysecretkey';

// Register
router.post('/register', async (req, res) => {
  try {
    const {name, email, password, role} = req.body;
    if(!name || !email || !password) return res.status(400).json({error: 'Name, email and password required'});
    const existing = await User.findOne({email});
    if(existing) return res.status(400).json({error: 'Email already in use'});
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({name, email, password: hash, role: role || 'student'});
    return res.json({message: 'Registered', userId: user._id});
  } catch(err) {
    console.error(err);
    res.status(500).json({error: 'Server error'});
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    if(!email || !password) return res.status(400).json({error: 'Email and password required'});
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({error: 'Invalid credentials'});
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({error: 'Invalid credentials'});
    const token = jwt.sign({id: user._id, role: user.role, name: user.name}, JWT_SECRET, {expiresIn: '4h'});
    res.json({token, role: user.role, name: user.name});
  } catch(err) {
    console.error(err);
    res.status(500).json({error: 'Server error'});
  }
});

module.exports = router;
