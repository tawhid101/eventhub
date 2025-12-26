import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiX, FiCalendar, FiMapPin, FiDollarSign, FiUsers, FiImage } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import useEventStore from '../../store/eventStore';
import useUIStore from '../../store/uiStore';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const EventForm = () => {
  const { isEventFormOpen, closeEventForm } = useUIStore();
  const { createEvent, updateEvent, currentEvent } = useEventStore();
  const { user } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    setError,
    clearErrors
  } = useForm();

  const isEditMode = !!currentEvent;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedDate = watch('date');

  useEffect(() => {
    if (currentEvent) {
      reset({
        ...currentEvent,
        date: new Date(currentEvent.date),
      });
    } else {
      // Reset to empty/default values for create mode
      reset({
        title: '',
        description: '',
        date: null,
        time: '',
        location: { address: '' },
        category: 'Other',
        image: '',
        price: 0,
      });
    }
  }, [currentEvent, reset]);

  const categories = [
    'Music', 'Sports', 'Business', 'Arts', 'Food', 
    'Health', 'Technology', 'Education', 'Entertainment', 'Other'
  ];

  const onSubmit = async (data) => {
    if (!user) {
      toast.error('You must be logged in to create events');
      return;
    }

    setIsSubmitting(true);
    try {
      const eventData = {
        ...data,
        date: selectedDate,
        price: parseFloat(data.price) || 0
      };

      let result;
      if (isEditMode) {
        result = await updateEvent(currentEvent._id, eventData);
      } else {
        result = await createEvent(eventData);
      }
      
      if (result?.success) {
        toast.success(isEditMode ? 'Event updated successfully!' : 'Event created successfully!');
        reset();
        closeEventForm();
      }
      
    } catch (error) {
        if (error && error.errors) {
            error.errors.forEach(err => {
                setError(err.path, {
                    type: "manual",
                    message: err.msg
                });
            });
            toast.error(error.message || 'Please correct the errors below');
        } else {
            toast.error('An error occurred while saving the event');
        }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    closeEventForm();
  };

  return (
    <AnimatePresence>
      {isEventFormOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 font-display">
                {isEditMode ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    onInput={() => clearErrors('title')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter event title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={4}
                    onInput={() => clearErrors('description')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Describe your event..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                  )}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setValue('date', date);
                        clearErrors('date');
                      }}
                      minDate={new Date()}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholderText="Select date"
                    />
                     {errors.date && (
                        <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time *
                    </label>
                    <input
                      type="time"
                      {...register('time', { required: 'Time is required' })}
                      onInput={() => clearErrors('time')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    {errors.time && (
                      <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    {...register('location.address', { required: 'Address is required' })}
                    onInput={() => clearErrors('location.address')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., 123 Main St, City, State"
                  />
                  {errors.location?.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.location.address.message}</p>
                  )}
                </div>

                {/* Category and Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      onChange={() => clearErrors('category')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      {...register('price')}
                      onInput={() => clearErrors('price')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Image URL
                  </label>
                  <input
                    type="url"
                    {...register('image')}
                    onInput={() => clearErrors('image')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                      </div>
                    ) : (
                      isEditMode ? 'Update Event' : 'Create Event'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventForm;