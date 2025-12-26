import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  FiPlus,
  FiCalendar,
  FiUsers,
  FiHeart,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiBarChart2,
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import useEventStore from '../store/eventStore'
import useUIStore from '../store/uiStore'
import EventCard from '../components/events/EventCard'
import EventForm from '../components/events/EventForm'
import ConfirmModal from '../components/common/ConfirmModal'
import toast from 'react-hot-toast'

const DashboardPage = () => {
  const { user, isAuthenticated, getCurrentUser } = useAuthStore()
  const {
    events,
    savedEvents,
    dashboardStats, // Get stats from the store
    fetchMyEvents,
    fetchSavedEvents,
    deleteEvent,
    getDashboardStats,
  } = useEventStore()
  const { openEventForm } = useUIStore()

  const [activeTab, setActiveTab] = useState('events')
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMyEvents()
      fetchSavedEvents()
      getDashboardStats() // Initial fetch
    }
  }, [isAuthenticated, user, fetchMyEvents, fetchSavedEvents, getDashboardStats])

  const handleCreateEvent = () => {
    openEventForm()
  }

  const handleEditEvent = (eventId) => {
    const eventToEdit = events.find(event => event._id === eventId);
    if (eventToEdit) {
      openEventForm(eventToEdit);
    } else {
      toast.error('Could not find event to edit.');
    }
  }

  const openDeleteConfirm = (eventId) => {
    setEventToDelete(eventId);
    setIsConfirmModalOpen(true);
  }

  const confirmDeleteHandler = async () => {
    if (eventToDelete) {
      const result = await deleteEvent(eventToDelete)
      if (result.success) {
        toast.success('Event deleted successfully!')
      } else {
        toast.error(result.error || 'Failed to delete event')
      }
      setEventToDelete(null);
      setIsConfirmModalOpen(false);
    }
  }

  const tabs = [
    {
      id: 'events',
      label: 'My Events',
      icon: FiCalendar,
      count: dashboardStats.totalEvents,
    },
    {
      id: 'saved',
      label: 'Saved Events',
      icon: FiHeart,
      count: (savedEvents ?? []).length,
    }
  ]

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Please login to access your dashboard.
          </p>
          <Link
            to="/login"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2 font-display">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-xl text-gray-600">
                  Manage your events and discover new ones
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateEvent}
                className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                <FiPlus className="mr-2" />
                Create Event
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="flex justify-center"> {/* Added flex justify-center here */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-4xl" /* Changed lg:grid-cols-4 to lg:grid-cols-3 and added max-w-4xl for better centering */
            >
            {[
              {
                title: 'Total Events',
                value: dashboardStats.totalEvents,
                icon: FiCalendar,
                color: 'bg-blue-500',
              },
              {
                title: 'Active Events',
                value: dashboardStats.activeEvents,
                icon: FiCalendar,
                color: 'bg-green-500',
              },
              {
                title: 'Saved Events',
                value: dashboardStats.savedEvents,
                icon: FiHeart,
                color: 'bg-red-500',
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            </motion.div>
          </div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 justify-center">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Tab Content */}
          <div>
            {/* My Events Tab */}
            {activeTab === 'events' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {(events ?? []).length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No events yet
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Create your first event to get started!
                    </p>
                    <button
                      onClick={handleCreateEvent}
                      className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      <FiPlus className="mr-2" />
                      Create Your First Event
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event, index) => (
                      <EventCard 
                        key={event._id} 
                        event={event} 
                        index={index}
                        showDashboardActions={true}
                        onEdit={() => handleEditEvent(event._id)}
                        onDelete={() => openDeleteConfirm(event._id)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Saved Events Tab */}
            {activeTab === 'saved' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {(savedEvents ?? []).length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                    <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                      <FiHeart className="w-12 h-12 text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No saved events
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Start saving events you're interested in!
                    </p>
                    <Link
                      to="/events"
                      className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Browse Events
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedEvents.map((event, index) => (
                      <EventCard key={event._id} event={event} index={index} />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal 
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeleteHandler}
        title="Are you sure?"
        message="This action cannot be undone. All data associated with this event will be permanently deleted."
      />
    </>
  )
}

export default DashboardPage
