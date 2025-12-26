const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Event address is required']
    },
    coordinates: {
      lat: {
        type: Number,
        required: false
      },
      lng: {
        type: Number,
        required: false
      }
    }
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: {
      values: ['Music', 'Sports', 'Business', 'Arts', 'Food', 'Health', 'Technology', 'Education', 'Entertainment', 'Other'],
      message: 'Please select a valid category'
    }
  },
  image: {
    type: String,
    required: [true, 'Event image is required']
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
eventSchema.index({ date: 1, isActive: 1 });
eventSchema.index({ category: 1, isActive: 1 });
eventSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for formatted date
eventSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return this.date >= new Date();
});

module.exports = mongoose.model('Event', eventSchema);