import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Restaurant } from '../types';

export default function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4, scale: 1.01 }}
      className="group rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition bg-white overflow-hidden">
      <div className="relative h-40 overflow-hidden">
        {r.imageUrl ? (
          <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200" />
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{r.name}</h3>
        <p className="text-sm text-gray-600">{r.cuisine} • {r.address?.city}</p>
        <div className="flex items-center gap-3 mt-2 text-sm text-gray-700">
          <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-700">⭐ {r.averageRating ?? '4.3'}</span>
          <span>30-40 mins</span>
          <span>₹₹ for two</span>
        </div>
        <div className="mt-3">
          <Link to={`/restaurants/${r.id}`} className="text-brand-600 hover:text-brand-700">View menu</Link>
        </div>
      </div>
    </motion.div>
  );
}