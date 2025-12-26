import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiUsers, FiHeart, FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { format } from 'date-fns';
import useAuthStore from '../../store/authStore';
import useEventStore from '../../store/eventStore';
import toast from 'react-hot-toast';

const EventCard = ({ event, index = 0, showDashboardActions = false, onEdit, onDelete }) => {
  const { isAuthenticated } = useAuthStore();
  const { toggleSaveEvent } = useEventStore();
  
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate >= new Date();
  const formattedDate = format(eventDate, 'MMM dd, yyyy');
  const formattedTime = format(eventDate, 'h:mm a');

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to save events');
      return;
    }

    const result = await toggleSaveEvent(event._id);
    if (result.success) {
      toast.success(result.isSaved ? 'Event saved!' : 'Event removed from saved');
    } else {
      toast.error(result.error || 'Failed to save event');
    }
  };

  const categoryColors = {
    Music: 'bg-red-100 text-red-800',
    Sports: 'bg-green-100 text-green-800',
    Business: 'bg-blue-100 text-blue-800',
    Arts: 'bg-purple-100 text-purple-800',
    Food: 'bg-yellow-100 text-yellow-800',
    Health: 'bg-pink-100 text-pink-800',
    Technology: 'bg-indigo-100 text-indigo-800',
    Education: 'bg-teal-100 text-teal-800',
    Entertainment: 'bg-orange-100 text-orange-800',
    Other: 'bg-gray-100 text-gray-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <Link to={`/events/${event._id}`} className="block">
        {/* Event Image */}
        <div className="relative overflow-hidden">
          <img
            src={event.image || '/placeholder-event.jpg'}
            alt={event.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              categoryColors[event.category] || categoryColors.Other
            }`}>
              {event.category}
            </span>
          </div>
          {!isUpcoming && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Event Ended</span>
            </div>
          )}
        </div>

        {/* Event Content */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-500">
              <FiCalendar className="w-4 h-4 mr-2" />
              <span>{formattedDate} at {formattedTime}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500">
              <FiMapPin className="w-4 h-4 mr-2" />
              <span className="line-clamp-1">{event.location.address}</span>
            </div>
          </div>

          {/* Price and Organizer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="text-lg font-bold text-primary">
              {event.price > 0 ? `$${event.price}` : 'Free'}
            </div>
            <div className="text-sm text-gray-500">
              by {event.organizer?.name || 'Organizer'}
            </div>
          </div>
        </div>
      </Link>

      {/* Action Buttons - Positioned on top of the link */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-center space-y-2">
        <button
          onClick={handleSaveEvent}
          className={`p-2 rounded-full backdrop-blur-sm transition-all ${
            event.isSaved
              ? 'bg-red-500 text-white'
              : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
          }`}
        >
          <FiHeart className={`w-4 h-4 ${event.isSaved ? 'fill-current' : ''}`} />
        </button>

        {showDashboardActions && (
          <>
            <Link
              to={`/events/${event._id}`}
              className="p-2 bg-white/90 text-gray-600 rounded-full hover:bg-white hover:text-primary transition-colors shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <FiEye className="w-4 h-4" />
            </Link>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 bg-white/90 text-gray-600 rounded-full hover:bg-white hover:text-primary transition-colors shadow-lg"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 bg-white/90 text-red-600 rounded-full hover:bg-red-500 hover:text-white transition-colors shadow-lg"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Hover Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default EventCard;