import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import type { Restaurant } from '../types';
import RestaurantCard from '../components/RestaurantCard';
import { CardSkeleton } from '../components/Skeletons';

export default function Restaurants() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('');
  useEffect(() => { setQuery(params.get('q') || ''); }, [params]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurants', cuisine, query],
    queryFn: async () => {
      const req: any = {};
      if (cuisine) req.cuisine = cuisine;
      if (query) req.q = query;
      const res = await api.get<Restaurant[]>('/api/restaurants', { params: req });
      return res.data;
    },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-semibold">Restaurants</h1>
        <div className="flex items-center gap-3">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search restaurants" className="border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700" />
          <select value={cuisine} onChange={e => setCuisine(e.target.value)} className="border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700">
            <option value="">All cuisines</option>
            <option>Indian</option>
            <option>Italian</option>
            <option>Chinese</option>
            <option>Mexican</option>
          </select>
        </div>
      </div>
      {error && <div className="rounded-md bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-100">Failed to load restaurants</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(isLoading ? Array.from({ length: 9 }) : data)?.map((r: any, i: number) => (
          <div key={r?.id ?? i}>
            {r ? <RestaurantCard r={r} /> : <CardSkeleton />}
          </div>
        ))}
      </div>
    </div>
  );
}

