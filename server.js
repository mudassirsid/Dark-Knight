const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); 
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'frontend')));

// **Serve uploaded images**
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Redirect root "/" to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/auth');
const turfRoutes = require('./routes/turfs');
const bookingRoutes = require('./routes/bookings');

app.use('/api/auth', authRoutes);
app.use('/api/turfs', turfRoutes);
app.use('/api/bookings', bookingRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
