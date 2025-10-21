// generateToken.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Define your test user payload
const user = {
  id: 1,
  role: 'client', // can be 'admin', 'project_manager', 'contractor', etc.
  email: 'test@example.com'
};

// Generate token
const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });

console.log('✅ Your test JWT token:');
console.log(token);
