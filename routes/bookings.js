const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create a booking (customer)
router.post('/', (req, res) => {
  const { customer_id, turf_id, start_time, end_time } = req.body;

  if (!customer_id || !turf_id || !start_time || !end_time) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `INSERT INTO bookings (customer_id, turf_id, start_time, end_time) VALUES (?, ?, ?, ?)`;
  db.query(query, [customer_id, turf_id, start_time, end_time], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ message: 'Booking created successfully', bookingId: result.insertId });
  });
});

// Get bookings for a turf or customer by date
router.get('/', (req, res) => {
  const { turf_id, customer_id, date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  let query = `SELECT * FROM bookings WHERE DATE(start_time) = ?`;
  let params = [date];

  if (turf_id) {
    query += ' AND turf_id = ?';
    params.push(turf_id);
  }

  if (customer_id) {
    query += ' AND customer_id = ?';
    params.push(customer_id);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json(results);
  });
});

module.exports = router;
