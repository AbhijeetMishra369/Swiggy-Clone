import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Restaurant } from '../types';
import SmartImage from './SmartImage';

export default function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4, scale: 1.01 }}
      className="group rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition bg-white overflow-hidden">
      <div className="relative h-40 overflow-hidden">
        <SmartImage src={r.imageUrl} alt={r.name} className="transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute top-2 left-2 px-2 py-0.5 text-xs rounded-md bg-black/70 text-white">50% OFF</div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{r.name}</h3>
        <p className="text-sm text-gray-600">{r.cuisine} • {r.address?.city}</p>
        <div className="flex items-center gap-3 mt-2 text-sm text-gray-700">
          <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-700 inline-flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.176L12 18.896l-7.336 3.878 1.402-8.176L.132 9.21l8.2-1.192L12 .587z"/></svg>
            {r.averageRating ?? '4.3'}
          </span>
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