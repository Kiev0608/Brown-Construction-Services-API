const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const { authenticate } = require('../middleware/auth');
const {
  createRequest,
  getRequests,
  updateStatus
} = require('../controllers/maintenance.controller');

// ✅ Create maintenance request (any logged-in user)
router.post(
  '/',
  authenticate(),
  body('title').notEmpty(),
  body('description').notEmpty(),
  createRequest
);

// ✅ Get all requests (admin view)
router.get('/', authenticate(), getRequests);

// ✅ Update status / assign contractor (admin only)
router.patch('/:id', authenticate(), updateStatus);

module.exports = router;
