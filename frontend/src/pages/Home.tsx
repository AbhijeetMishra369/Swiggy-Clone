import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import RestaurantCard from '../components/RestaurantCard';
import type { Restaurant } from '../types';
import { useSearchParams } from 'react-router-dom';

export default function Home() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState('');
  useEffect(() => { setQuery(params.get('q') || ''); }, [params]);
  const [cuisine, setCuisine] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['restaurants', query, cuisine],
    queryFn: async () => {
      const params: any = {};
      if (cuisine) params.cuisine = cuisine;
      const res = await api.get<Restaurant[]>('/api/restaurants', { params });
      const list = res.data;
      if (!query) return list;
      return list.filter(r => r.name.toLowerCase().includes(query.toLowerCase()));
    },
  });

  return (
    <div>
      <div className="bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center">
        <div className="backdrop-brightness-50">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Food from top restaurants near you</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="border rounded-md px-3 py-3" placeholder="Search restaurants" value={query} onChange={e => setQuery(e.target.value)} />
              <select className="border rounded-md px-3 py-3" value={cuisine} onChange={e => setCuisine(e.target.value)}>
                <option value="">All cuisines</option>
                <option>Indian</option>
                <option>Italian</option>
                <option>Chinese</option>
                <option>Mexican</option>
              </select>
              <button className="px-4 py-3 rounded-md bg-black text-white">Search</button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 -mt-6 pb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Popular restaurants</h2>
          <div className="flex gap-2 text-sm text-gray-600">
            <button className="px-3 py-1 rounded-full border">Fast delivery</button>
            <button className="px-3 py-1 rounded-full border">Ratings 4.0+</button>
            <button className="px-3 py-1 rounded-full border">Offers</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading ? Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm h-64 animate-pulse bg-gray-50 dark:bg-gray-800" />
          )) : data?.map(r => (
            <RestaurantCard key={r.id} r={r} />
          ))}
        </div>
      </div>
    </div>
  );
}