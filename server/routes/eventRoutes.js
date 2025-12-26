const express = require('express');
const { body } = require('express-validator');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleSaveEvent,
  getSavedEvents
} = require('../controllers/eventController');
const { authMiddleware, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const createEventValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Event title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .notEmpty().withMessage('Event description is required')
    .isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('date')
    .isISO8601().withMessage('Please provide a valid date')
    .custom(value => {
      if (new Date(value) < new Date()) {
        throw new Error('Event date cannot be in the past');
      }
      return true;
    }),
  body('time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Please provide a valid time (HH:MM format)'),
  body('location.address')
    .trim()
    .notEmpty().withMessage('Event address is required'),
  body('category')
    .isIn(['Music', 'Sports', 'Business', 'Arts', 'Food', 'Health', 'Technology', 'Education', 'Entertainment', 'Other'])
    .withMessage('Please select a valid category'),
  body('image')
    .isURL().withMessage('Event image must be a valid URL'),
  body('price')
    .optional()
    .isNumeric().withMessage('Price must be a number')
    .custom(value => value >= 0).withMessage('Price cannot be negative')
];

const updateEventValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 }).withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 }).withMessage('Description must be between 10 and 2000 characters'),
  body('date')
    .optional()
    .isISO8601().withMessage('Please provide a valid date'),
  body('time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Please provide a valid time (HH:MM format)'),
  body('location.address')
    .optional()
    .trim()
    .notEmpty().withMessage('Event address cannot be empty'),
  body('category')
    .optional()
    .isIn(['Music', 'Sports', 'Business', 'Arts', 'Food', 'Health', 'Technology', 'Education', 'Entertainment', 'Other'])
    .withMessage('Please select a valid category'),
  body('image')
    .optional()
    .isURL().withMessage('Event image must be a valid URL'),
  body('price')
    .optional()
    .isNumeric().withMessage('Price must be a number')
    .custom(value => value >= 0).withMessage('Price cannot be negative')
];

// Public routes (no auth required)
router.get('/', optionalAuth, getEvents);
router.get('/saved', authMiddleware, getSavedEvents);
router.get('/:id', optionalAuth, getEvent);

// Protected routes (auth required)
router.post('/', authMiddleware, createEventValidation, createEvent);
router.put('/:id', authMiddleware, updateEventValidation, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);
router.post('/:id/save', authMiddleware, toggleSaveEvent);

module.exports = router;