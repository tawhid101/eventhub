import React, { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiFilter, FiSearch, FiCalendar, FiMapPin } from 'react-icons/fi'
import EventGrid from '../components/events/EventGrid'
import CategoryFilter from '../components/events/CategoryFilter'
import useEventStore from '../store/eventStore'
import useAuthStore from '../store/authStore'

const EventsPage = () => {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    events,
    fetchEvents,
    isLoading,
    error,
    filters,
    setFilters,
    pagination,
  } = useEventStore()
  const { isAuthenticated } = useAuthStore()

  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [locationTerm, setLocationTerm] = useState(searchParams.get('location') || '')

  const handleFilterChange = React.useCallback((key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Update URL
    if (value && value !== 'all') {
      searchParams.set(key, value)
    } else {
      searchParams.delete(key)
    }
    setSearchParams(searchParams)
  }, [filters, setFilters, searchParams, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault()
    handleFilterChange('search', searchTerm);
  }

  const handlePageChange = (page) => {
    fetchEvents(page)
  }

  // Extract filters from URL on mount
  useEffect(() => {
    const urlFilters = {
      category: searchParams.get('category') || 'all',
      search: searchParams.get('search') || '',
      date: searchParams.get('date') || '',
      location: searchParams.get('location') || '',
      price: searchParams.get('price') || 'all',
      sortBy: searchParams.get('sortBy') || 'date',
    }

    setFilters(urlFilters)
    setSearchTerm(urlFilters.search)
    setLocationTerm(urlFilters.location)
  }, [searchParams, setFilters])

  // Debounce for location filter
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (locationTerm !== filters.location) {
        handleFilterChange('location', locationTerm);
      }
    }, 500); // 500ms delay

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [locationTerm, handleFilterChange, filters.location]);

  // Fetch events when filters change
  useEffect(() => {
    fetchEvents()
  }, [filters, fetchEvents])

  return (
    <div className="min-h-screen bg-gray-50 pt-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-display">
            Discover Events
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find amazing events happening in your area. Filter by category,
            date, location, and more.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events by title, description, or location..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-lg"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
              >
                Search
              </button>
            </div>
          </form>
        </motion.div>

        {/* Filter Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <FiFilter className="w-4 h-4" />
            <span>Filters</span>
            {(filters.category !== 'all' ||
              filters.price !== 'all' ||
              filters.date || filters.location) && (
              <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </button>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange('category', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Categories</option>
                    {[
                      'Music',
                      'Sports',
                      'Business',
                      'Arts',
                      'Food',
                      'Health',
                      'Technology',
                      'Education',
                      'Entertainment',
                      'Other',
                    ].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={locationTerm}
                    onChange={(e) => setLocationTerm(e.target.value)}
                    placeholder="City, State, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <select
                    value={filters.price}
                    onChange={(e) =>
                      handleFilterChange('price', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Prices</option>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      handleFilterChange('sortBy', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="date">Date (Upcoming)</option>
                    <option value="date-desc">Date (Newest)</option>
                    <option value="price">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="created">Recently Added</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    setFilters({
                      category: 'all',
                      search: '',
                      date: '',
                      location: '',
                      price: 'all',
                      sortBy: 'date',
                    })
                    setSearchParams({})
                    setSearchTerm('')
                    setLocationTerm('')
                  }}
                  className="text-sm text-primary hover:text-primary/80"
                >
                  Clear all filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6 flex items-center justify-between"
        >
          <p className="text-gray-600">
            Showing {(events ?? []).length} of {(pagination ?? []).totalCount}{' '}
            events
          </p>
          {searchTerm && (
            <p className="text-sm text-gray-500">
              Search results for: "
              <span className="font-medium">{searchTerm}</span>"
            </p>
          )}
        </motion.div>

        {/* Events Grid */}
        <EventGrid events={events} isLoading={isLoading} />

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-red-600 mb-4">{error}</div>
            <button
              onClick={() => fetchEvents()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Pagination */}
        {(pagination ?? []).totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex justify-center"
          >
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg ${
                    page === pagination.currentPage
                      ? 'bg-primary text-white'
                      : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default EventsPage
