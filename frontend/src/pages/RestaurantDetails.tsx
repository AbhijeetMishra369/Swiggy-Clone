import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { MenuItem, Restaurant } from '../types';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/cartSlice';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import { addToast } from '../store/toastSlice';
import SmartImage from '../components/SmartImage';

export default function RestaurantDetails() {
  const { id } = useParams();
  const restaurantId = Number(id);
  const dispatch = useAppDispatch();

  const { data: restaurants } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => (await api.get<Restaurant[]>('/api/restaurants')).data,
  });
  const restaurant = restaurants?.find(r => r.id === restaurantId);

  const { data: menu } = useQuery({
    queryKey: ['menu', restaurantId],
    queryFn: async () => (await api.get<MenuItem[]>(`/api/restaurants/${restaurantId}/menu`)).data,
    enabled: !!restaurantId,
  });

  const qc = useQueryClient();
  const { data: reviews } = useQuery({
    queryKey: ['reviews', restaurantId],
    queryFn: async () => (await api.get(`/api/restaurants/${restaurantId}/reviews`)).data,
    enabled: !!restaurantId,
  });

  const createReview = useMutation({
    mutationFn: async (payload: { rating: number; comment: string }) => (await api.post(`/api/restaurants/${restaurantId}/reviews`, payload)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['reviews', restaurantId] }); dispatch(addToast({ message: 'Review submitted', type: 'success' })); },
    onError: () => { dispatch(addToast({ message: 'Failed to submit review', type: 'error' })); },
  });

  return (
    <div className="container">
      <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
        <div className="h-44 md:h-56 bg-gray-50 relative">
          {restaurant?.imageUrl && (
            <SmartImage src={restaurant.imageUrl} alt={restaurant.name ?? 'Restaurant'} eager />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
        <div className="p-4 md:p-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">{restaurant?.name ?? 'Restaurant'}</h1>
            <p className="text-gray-600 text-sm md:text-base">{restaurant?.cuisine} • {restaurant?.address?.city}</p>
            <div className="text-xs md:text-sm text-gray-700 mt-1 flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-700">⭐ {restaurant?.averageRating ?? '4.3'}</span>
              <span>30-40 mins</span>
              <span>₹₹ for two</span>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <div className="px-3 py-2 rounded-lg bg-amber-100 text-amber-800 text-sm font-medium">Use NEW50 for 50% OFF</div>
          </div>
        </div>
      </div>
      <div className="py-5 space-y-6">
        {/* Mini category slider */}
        <Swiper modules={[FreeMode]} freeMode slidesPerView={3.5} spaceBetween={12} className="pb-1">
          {['starters','main course','beverages','desserts','sides'].map(cat => (
            <SwiperSlide key={cat}>
              <a href={`#${cat}`} className="block px-4 py-2 rounded-full border hover:bg-gray-50 capitalize">{cat}</a>
            </SwiperSlide>
          ))}
        </Swiper>
        {['starters', 'main course', 'beverages'].map(section => (
          <div key={section} id={section}>
            <h2 className="text-xl font-semibold mb-3 capitalize">{section}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menu?.filter(mi => mi.category.toLowerCase() === section).map(mi => (
                <motion.div key={mi.id} whileHover={{ scale: 1.01 }} className="border border-gray-100 rounded-xl p-3 flex items-start justify-between bg-white gap-3">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                    {mi.imageUrl && <SmartImage src={mi.imageUrl} alt={mi.name} />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm md:text-base">{mi.name}</h3>
                    <p className="text-xs md:text-sm text-gray-600">{mi.description}</p>
                    <p className="mt-1 font-semibold text-sm md:text-base">₹ {mi.price}</p>
                  </div>
                  <button className="px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-700 shadow hover:shadow-md transition text-sm" onClick={async () => {
                    dispatch(addToCart({ id: mi.id, name: mi.name, price: Number(mi.price), quantity: 1, restaurantId }));
                    try { await api.post('/api/cart/add', { menuItemId: mi.id, quantity: 1 }); } catch {}
                  }}>Add</button>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-3">Recent Reviews</h2>
            <div className="space-y-3">
              {reviews?.length ? reviews.map((rv: any) => (
                <div key={rv.id} className="rounded-xl border p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{rv.user?.name ?? 'User'}</div>
                    <div className="text-sm">⭐ {rv.rating}</div>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{rv.comment}</p>
                </div>
              )) : <div className="text-sm text-gray-500">No reviews yet</div>}
            </div>
          </div>
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-2">Write a Review</h3>
            <form onSubmit={(e) => { e.preventDefault(); const form = e.target as HTMLFormElement; const fd = new FormData(form); const rating = Number(fd.get('rating')); const comment = String(fd.get('comment') || ''); createReview.mutate({ rating, comment }); form.reset(); }} className="space-y-2">
              <select name="rating" required className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700">
                <option value="">Rating</option>
                {[5,4,3,2,1].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <textarea name="comment" rows={3} placeholder="Share your experience" className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700" />
              <button type="submit" className="w-full px-3 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700" disabled={createReview.isPending}>Submit</button>
              <p className="text-xs text-gray-500">Reviews are auto-approved</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}