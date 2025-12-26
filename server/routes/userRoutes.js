const express = require('express');
const { body } = require('express-validator');
const {
  getProfile,
  getMyEvents,
  updateProfile,
  getDashboardStats,
  deleteAccount
} = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
];

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/profile', getProfile);
router.get('/events', getMyEvents);
router.put('/profile', updateProfileValidation, updateProfile);
router.get('/dashboard', getDashboardStats);
router.delete('/account', deleteAccount);

module.exports = router;