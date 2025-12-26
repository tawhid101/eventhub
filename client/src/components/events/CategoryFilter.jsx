import React from 'react';
import { motion } from 'framer-motion';
import useEventStore from '../../store/eventStore';

const CategoryFilter = () => {
  const { categories, filters, setFilters } = useEventStore();
  const selectedCategory = filters.category;

  const categoryIcons = {
    Music: '🎵',
    Sports: '⚽',
    Business: '💼',
    Arts: '🎨',
    Food: '🍕',
    Health: '🏥',
    Technology: '💻',
    Education: '📚',
    Entertainment: '🎭',
    Other: '🎪'
  };

  const handleCategoryChange = (category) => {
    setFilters({ category: category === 'all' ? 'all' : category });
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 font-display">Browse by Category</h2>
      
      <div className="flex flex-wrap gap-3">
        {/* All Categories */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleCategoryChange('all')}
          className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
            selectedCategory === 'all'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
          }`}
        >
          All Events
        </motion.button>

        {/* Individual Categories */}
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-all flex items-center space-x-2 ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            <span className="text-lg">{categoryIcons[category] || '🎪'}</span>
            <span>{category}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;