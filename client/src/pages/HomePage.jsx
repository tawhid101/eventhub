import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCalendar, FiUsers, FiMapPin } from 'react-icons/fi';
import Typed from 'typed.js';
import EventGrid from '../components/events/EventGrid';
import CategoryFilter from '../components/events/CategoryFilter';
import useEventStore from '../store/eventStore';
import useAuthStore from '../store/authStore';

const HomePage = () => {
  const { events, fetchEvents, getUpcomingEvents } = useEventStore();
  const { isAuthenticated } = useAuthStore();
  const upcomingEvents = getUpcomingEvents();

  useEffect(() => {
    // Initialize typed.js for hero text
    const typed = new Typed('#typed-text', {
      strings: [
        'Discover Amazing Events',
        'Create Unforgettable Experiences',
        'Connect with Your Community',
        'Find Your Next Adventure'
      ],
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: '|'
    });

    // Fetch events on mount
    fetchEvents();

    return () => {
      typed.destroy();
    };
  }, [fetchEvents]);

  const stats = [
    { number: '10K+', label: 'Events Created', icon: FiCalendar },
    { number: '50K+', label: 'Happy Attendees', icon: FiUsers },
    { number: '25+', label: 'Cities Covered', icon: FiMapPin }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center aurora-bg">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-display">
              <span id="typed-text" />
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              Join thousands of event organizers and attendees. Create, discover, and share amazing experiences in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/events"
                className="inline-flex items-center px-8 py-4 bg-white text-primary font-semibold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Explore Events
                <FiArrowRight className="ml-2" />
              </Link>
              {!isAuthenticated && (
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-primary transition-all"
                >
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-3 bg-white rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2 font-display">{stat.number}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find events that match your interests and passions
            </p>
          </motion.div>
          <CategoryFilter />
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-display">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't miss out on these exciting upcoming events
            </p>
          </motion.div>
          
          <EventGrid events={upcomingEvents} isLoading={false} />
          
          <div className="text-center mt-12">
            <Link
              to="/events"
              className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary/90 transition-all transform hover:scale-105"
            >
              View All Events
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 font-display">
              How EventHub Works
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Simple steps to discover and create amazing events
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Discover Events',
                description: 'Browse through a wide variety of events in your area or online. Filter by category, date, or location.',
                icon: '🔍'
              },
              {
                step: 2,
                title: 'Save & Share',
                description: 'Save events you\'re interested in and share them with friends. Never miss out on exciting opportunities.',
                icon: '❤️'
              },
              {
                step: 3,
                title: 'Create & Host',
                description: 'Create your own events and invite others to join. Manage attendees and make your event a success.',
                icon: '🎉'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                  {item.icon}
                </div>
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="opacity-90">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;