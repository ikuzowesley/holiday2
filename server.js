/*
  Simple Node + Express server for KDA Student Portal (Wesley)
  Run:
    1) Install MongoDB locally or use Atlas.
    2) npm install
    3) npm start
  Default Mongo URI: mongodb://127.0.0.1:27017/kda_portal
*/
require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./backend/routes/auth');
const studentsRoutes = require('./backend/routes/students');
const attendanceRoutes = require('./backend/routes/attendance');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kda_portal';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/attendance', attendanceRoutes);

// Serve frontend static files
app.use('/', express.static(path.join(__dirname, 'frontend')));

// fallback to index.html for SPA routes (simple)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
