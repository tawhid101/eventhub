const Event = require('../models/Event');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get all events with filters
const getEvents = async (req, res) => {
  try {
    const {
      category,
      search,
      date,
      location,
      price,
      page = 1,
      limit = 12,
      sortBy = 'date'
    } = req.query;

    // Build query
    let query = { isActive: true };
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Date filter
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    
    // Price filter
    if (price === 'free') {
      query.price = 0;
    } else if (price === 'paid') {
      query.price = { $gt: 0 };
    }
    
    // Location filter
    if (location) {
      query['location.address'] = { $regex: location, $options: 'i' };
    }

    // Sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'date':
        sortOptions = { date: 1 };
        break;
      case 'date-desc':
        sortOptions = { date: -1 };
        break;
      case 'price':
        sortOptions = { price: 1 };
        break;
      case 'price-desc':
        sortOptions = { price: -1 };
        break;
      case 'created':
        sortOptions = { createdAt: -1 };
        break;
      default:
        sortOptions = { date: 1 };
    }

    // Pagination
    const skip = (page - 1) * limit;
    const limitNum = parseInt(limit);

    // Execute queries
    const [events, totalCount] = await Promise.all([
      Event.find(query)
        .populate('organizer', 'name')
        .sort(sortOptions)
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
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching events'
    });
  }
};

// Get single event
const getEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findById(id)
      .populate('organizer', 'name email');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (!event.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Event is no longer available'
      });
    }

    // Check if current user has saved this event
    let isSaved = false;
    if (req.user) {
      const user = await User.findById(req.user._id);
      isSaved = user.savedEvents.includes(event._id);
    }

    res.json({
      success: true,
      data: {
        event: {
          ...event.toObject(),
          isSaved
        }
      }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching event'
    });
  }
};

// Create new event
const createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const eventData = {
      ...req.body,
      organizer: req.user._id
    };

    const event = new Event(eventData);
    await event.save();

    // Populate organizer information
    await event.populate('organizer', 'name');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating event'
    });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user owns this event
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('organizer', 'name');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event: updatedEvent }
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating event'
    });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user owns this event
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await Event.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting event'
    });
  }
};

// Save/unsave event
const toggleSaveEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(id);
    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    const user = await User.findById(userId);
    const isSaved = user.savedEvents.includes(id);

    if (isSaved) {
      // Remove from saved events
      user.savedEvents.pull(id);
      await user.save();
      
      res.json({
        success: true,
        message: 'Event removed from saved events',
        data: { isSaved: false }
      });
    } else {
      // Add to saved events
      user.savedEvents.push(id);
      await user.save();
      
      res.json({
        success: true,
        message: 'Event saved successfully',
        data: { isSaved: true }
      });
    }
  } catch (error) {
    console.error('Toggle save event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error saving event'
    });
  }
};

// Get saved events
const getSavedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedEvents',
      populate: {
        path: 'organizer',
        select: 'name'
      }
    });

    res.json({
      success: true,
      data: {
        events: user.savedEvents.filter(event => event.isActive)
      }
    });
  } catch (error) {
    console.error('Get saved events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching saved events'
    });
  }
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleSaveEvent,
  getSavedEvents
};