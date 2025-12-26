import React, { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import EventCard from '../components/events/EventCard'
import { motion } from 'framer-motion'
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiHeart,
  FiShare2,
  FiArrowLeft,
  // FiClock,
  FiTag,
} from 'react-icons/fi'
import { format } from 'date-fns'
import useEventStore from '../store/eventStore'
import useAuthStore from '../store/authStore'
import useUIStore from '../store/uiStore'
import toast from 'react-hot-toast'

const EventDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    currentEvent,
    fetchEvent,
    toggleSaveEvent,
    isLoading,
    error,
    events,
  } = useEventStore()
  const { isAuthenticated, user } = useAuthStore()
  const { openAuthModal } = useUIStore()

  useEffect(() => {
    if (id) {
      fetchEvent(id)
    }
  }, [id, fetchEvent])

  const handleSaveEvent = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to save events')
      openAuthModal('login')
      return
    }

    const result = await toggleSaveEvent(currentEvent._id)
    if (result.success) {
      toast.success(
        result.isSaved ? 'Event saved!' : 'Event removed from saved',
      )
    } else {
      toast.error(result.error || 'Failed to save event')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentEvent?.title,
          text: currentEvent?.description,
          url: window.location.href,
        })
        toast.success('Event shared successfully!')
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Event link copied to clipboard!')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
              <div className="w-full h-96 bg-gray-300" />
              <div className="p-8">
                <div className="h-8 bg-gray-300 rounded mb-4" />
                <div className="h-4 bg-gray-300 rounded mb-2" />
                <div className="h-4 bg-gray-300 rounded mb-6" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-4 bg-gray-300 rounded" />
                  <div className="h-4 bg-gray-300 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !currentEvent) {
    return (
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Event not found'}
            </h2>
            <p className="text-gray-600 mb-6">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/events"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const eventDate = new Date(currentEvent.date)
  const formattedDate = format(eventDate, 'EEEE, MMMM do, yyyy')
  const formattedTime = format(eventDate, 'h:mm a')
  const isUpcoming = eventDate >= new Date()
  const isOrganizer = user && user.id === currentEvent.organizer._id

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Events
            </button>
          </motion.div>

          {/* Event Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            {/* Event Image */}
            <div className="relative">
              <img
                src={currentEvent.image || '/placeholder-event.jpg'}
                alt={currentEvent.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute top-4 left-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    currentEvent.category === 'Music'
                      ? 'bg-red-100 text-red-800'
                      : currentEvent.category === 'Sports'
                        ? 'bg-green-100 text-green-800'
                        : currentEvent.category === 'Business'
                          ? 'bg-blue-100 text-blue-800'
                          : currentEvent.category === 'Arts'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {currentEvent.category}
                </span>
              </div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={handleSaveEvent}
                  className={`p-3 rounded-full backdrop-blur-sm transition-all ${
                    currentEvent.isSaved
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                  }`}
                >
                  <FiHeart
                    className={`w-5 h-5 ${currentEvent.isSaved ? 'fill-current' : ''}`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-white/80 text-gray-600 hover:bg-white hover:text-primary transition-all backdrop-blur-sm"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>
              {!isUpcoming && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-semibold text-2xl">
                    Event Ended
                  </span>
                </div>
              )}
            </div>

            {/* Event Content */}
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4 font-display">
                {currentEvent.title}
              </h1>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {currentEvent.description}
              </p>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Date & Time */}
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <FiCalendar className="w-5 h-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium">{formattedDate}</p>
                      <p className="text-sm text-gray-500">{formattedTime}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <FiMapPin className="w-5 h-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium">
                        {currentEvent.location.venue || 'Venue'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {currentEvent.location.address}
                      </p>
                    </div>
                  </div>

                  {currentEvent.capacity && (
                    <div className="flex items-center text-gray-700">
                      <FiUsers className="w-5 h-5 mr-3 text-primary" />
                      <div>
                        <p className="font-medium">
                          {currentEvent.attendees?.length || 0} /{' '}
                          {currentEvent.capacity} attendees
                        </p>
                        <p className="text-sm text-gray-500">
                          {currentEvent.capacity -
                            (currentEvent.attendees?.length || 0)}{' '}
                          spots remaining
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price & Organizer */}
                <div className="space-y-4">
                  <div className="flex items-center text-gray-700">
                    <FiDollarSign className="w-5 h-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium text-2xl">
                        {currentEvent.price > 0
                          ? `$${currentEvent.price}`
                          : 'Free Event'}
                      </p>
                      {currentEvent.price > 0 && (
                        <p className="text-sm text-gray-500">per person</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center text-gray-700">
                    <FiUsers className="w-5 h-5 mr-3 text-primary" />
                    <div>
                      <p className="font-medium">Organized by</p>
                      <p className="text-sm text-gray-500">
                        {currentEvent.organizer.name}
                      </p>
                    </div>
                  </div>

                  {currentEvent.tags && currentEvent.tags.length > 0 && (
                    <div className="flex items-start text-gray-700">
                      <FiTag className="w-5 h-5 mr-3 text-primary mt-1" />
                      <div>
                        <p className="font-medium mb-2">Tags</p>
                        <div className="flex flex-wrap gap-2">
                          {currentEvent.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 border-t border-gray-200 pt-8">
                {isUpcoming ? (
                  <>
                    <button className="flex-1 px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                      {currentEvent.price > 0 ? 'Buy Tickets' : 'RSVP Now'}
                    </button>
                    {isOrganizer && (
                      <Link
                        to={`/dashboard?edit=${currentEvent._id}`}
                        className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
                      >
                        Edit Event
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="text-center w-full">
                    <p className="text-gray-500 text-lg">
                      This event has already ended.
                    </p>
                    <Link
                      to="/events"
                      className="inline-flex items-center mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <FiCalendar className="mr-2" />
                      Find Similar Events
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Related Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6 font-display">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter(
                  (event) =>
                    event._id !== currentEvent._id &&
                    (event.category === currentEvent.category ||
                      new Date(event.date) > new Date()),
                )
                .slice(0, 3)
                .map((event, index) => (
                  <EventCard key={event._id} event={event} index={index} />
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailPage
