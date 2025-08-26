import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { MenuItem, Restaurant } from '../types';
import { useAppDispatch } from '../store';
import { addToCart } from '../store/cartSlice';

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

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
        <div className="h-44 bg-gradient-to-br from-orange-100 to-orange-200" />
        <div className="p-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{restaurant?.name ?? 'Restaurant'}</h1>
            <p className="text-gray-600">{restaurant?.cuisine} • {restaurant?.address?.city}</p>
            <div className="text-sm text-gray-700 mt-1 flex items-center gap-3">
              <span className="px-2 py-0.5 rounded-md bg-green-100 text-green-700">⭐ {restaurant?.averageRating ?? '4.3'}</span>
              <span>30-40 mins</span>
              <span>₹₹ for two</span>
            </div>
          </div>
        </div>
      </div>
      <div className="py-6 space-y-6">
        {['starters', 'main course', 'beverages'].map(section => (
          <div key={section}>
            <h2 className="text-xl font-semibold mb-3 capitalize">{section}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menu?.filter(mi => mi.category.toLowerCase() === section).map(mi => (
                <div key={mi.id} className="border border-gray-100 rounded-xl p-4 flex items-start justify-between bg-white">
                  <div>
                    <h3 className="font-medium text-gray-900">{mi.name}</h3>
                    <p className="text-sm text-gray-600">{mi.description}</p>
                    <p className="mt-1 font-semibold">₹ {mi.price}</p>
                  </div>
                  <button
                    className="px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-700"
                    onClick={() => dispatch(addToCart({ id: mi.id, name: mi.name, price: Number(mi.price), quantity: 1, restaurantId }))}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}