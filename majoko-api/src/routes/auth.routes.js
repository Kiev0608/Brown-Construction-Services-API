const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/firebase.config'); // Firestore

router.post(
  '/login',
  body('username').notEmpty(),
  body('password').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;

    try {
      // Fetch user from Firestore
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('username', '==', username).get();

      if (snapshot.empty) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      const isMatch = await bcrypt.compare(password, userData.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

      // Create JWT token
      const token = jwt.sign(
        { id: userDoc.id, username: userData.username, role: userData.role },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.json({ success: true, token, role: userData.role });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

module.exports = router;
