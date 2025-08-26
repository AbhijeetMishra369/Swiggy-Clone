import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Restaurant } from '../types';

export default function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }}
      className="rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="p-4">
        <div className="h-36 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 mb-3" />
        <h3 className="text-lg font-semibold text-gray-900">{r.name}</h3>
        <p className="text-sm text-gray-600">{r.cuisine} • {r.address?.city}</p>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-700">
          <span>⭐ {r.averageRating ?? '4.3'}</span>
          <Link to={`/restaurants/${r.id}`} className="text-brand-600 hover:text-brand-700">View</Link>
        </div>
      </div>
    </motion.div>
  );
}