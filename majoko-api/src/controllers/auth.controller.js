// src/controllers/auth.controller.js
const admin = require('firebase-admin');
const axios = require('axios');

exports.registerUser = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await admin.auth().createUser({
      email,
      password,
      displayName,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: { uid: user.uid, email: user.email, displayName: user.displayName },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const apiKey = process.env.FIREBASE_WEB_API_KEY; // You’ll add this below

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required' });

  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      { email, password, returnSecureToken: true }
    );

    const { idToken, refreshToken } = response.data;
    res.json({
      message: 'Login successful',
      idToken,
      refreshToken,
    });
  } catch (error) {
    const message = error.response?.data?.error?.message || 'Login failed';
    res.status(400).json({ message });
  }
};
