const User = require('../models/User');
const Event = require('../models/Event');
const { validationResult } = require('express-validator');

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
};

// Get user's events
const getMyEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'all' } = req.query;
    const userId = req.user._id;

    // Build query
    let query = { organizer: userId };
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    // Pagination
    const skip = (page - 1) * limit;
    const limitNum = parseInt(limit);

    const [events, totalCount] = await Promise.all([
      Event.find(query)
        .populate('organizer', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Event.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get my events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching user events'
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [totalEvents, activeEvents, savedEventsCount] = await Promise.all([
      Event.countDocuments({ organizer: userId }),
      Event.countDocuments({ organizer: userId, isActive: true }),
      User.findById(userId).select('savedEvents').then(user => user.savedEvents.length)
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalEvents,
          activeEvents,
          savedEvents: savedEventsCount
        }
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard statistics'
    });
  }
};

// Delete user account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // Delete all events created by this user
    await Event.updateMany(
      { organizer: userId },
      { isActive: false }
    );

    // Delete user account
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting account'
    });
  }
};

module.exports = {
  getProfile,
  getMyEvents,
  updateProfile,
  getDashboardStats,
  deleteAccount
};