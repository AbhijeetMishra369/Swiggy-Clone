import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import RestaurantCard from '../components/RestaurantCard';
import type { Restaurant } from '../types';

export default function Home() {
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('');
  const { data } = useQuery({
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
    <div className="max-w-6xl mx-auto px-4">
      <div className="py-6">
        <h1 className="text-2xl font-semibold mb-3">Discover great food near you</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="border rounded-md px-3 py-2" placeholder="Search restaurants" value={query} onChange={e => setQuery(e.target.value)} />
          <select className="border rounded-md px-3 py-2" value={cuisine} onChange={e => setCuisine(e.target.value)}>
            <option value="">All cuisines</option>
            <option>Indian</option>
            <option>Italian</option>
            <option>Chinese</option>
            <option>Mexican</option>
          </select>
          <div />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data?.map(r => (
          <RestaurantCard key={r.id} r={r} />
        ))}
      </div>
    </div>
  );
}