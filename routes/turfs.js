const express = require("express");
const router = express.Router();
const db = require("../config/db");

// === Add Turf ===
router.post("/add", (req, res) => {
  const { turfName, turfLocation, turfPrice, managerId } = req.body;

  if (!turfName || !turfLocation || !turfPrice || !managerId) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const sql = `
    INSERT INTO turfs (manager_id, name, location, price_per_hour)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [managerId, turfName, turfLocation, turfPrice], (err) => {
    if (err) {
      console.error("DB Insert Error:", err);
      return res.status(500).json({ message: "Database error while adding turf" });
    }
    res.json({ message: "Turf added successfully!" });
  });
});

module.exports = router;
