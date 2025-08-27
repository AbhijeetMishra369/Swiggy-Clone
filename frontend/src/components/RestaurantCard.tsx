import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Restaurant } from '../types';
import SmartImage from './SmartImage';

export default function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }}
      className="group rounded-xl border border-gray-100 hover:shadow-md transition bg-white overflow-hidden">
      <div className="relative h-36 overflow-hidden">
        <SmartImage src={r.imageUrl} alt={r.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        <div className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] rounded bg-black/70 text-white">50% OFF</div>
      </div>
      <div className="p-3">
        <h3 className="text-base font-semibold text-gray-900 truncate">{r.name}</h3>
        <p className="text-xs text-gray-600 truncate">{r.cuisine} • {r.address?.city}</p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-700">
          <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 inline-flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.176L12 18.896l-7.336 3.878 1.402-8.176L.132 9.21l8.2-1.192L12 .587z"/></svg>
            {r.averageRating ?? '4.3'}
          </span>
          <span>30-40 mins</span>
          <span>₹₹ for two</span>
        </div>
        <div className="mt-2">
          <Link to={`/restaurants/${r.id}`} className="text-brand-600 hover:text-brand-700 text-sm">View menu</Link>
        </div>
      </div>
    </motion.div>
  );
}