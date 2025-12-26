import React from 'react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';

const EventGrid = ({ events, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-300" />
            <div className="p-6">
              <div className="h-6 bg-gray-300 rounded mb-2" />
              <div className="h-4 bg-gray-300 rounded mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded" />
                <div className="h-4 bg-gray-300 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or check back later for new events.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {events.map((event, index) => (
        <EventCard key={event._id} event={event} index={index} />
      ))}
    </motion.div>
  );
};

export default EventGrid;