import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import RestaurantCard from '../components/RestaurantCard';
import { CardSkeleton } from '../components/Skeletons';

function FiltersBar({ setFastOnly }: { setFastOnly: (v: boolean | ((v: boolean) => boolean)) => void }) {
  const filters = ['Offers', 'Fast Delivery', 'Rating 4.0+', 'Pure Veg', 'New on Swiggy'];
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
      {filters.map(f => (
        <button key={f} onClick={() => setFastOnly(v => !v)} className="px-3 py-1.5 rounded-full border text-sm whitespace-nowrap hover:border-gray-300">
          {f}
        </button>
      ))}
    </div>
  );
}

export default function Restaurants() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [sort, setSort] = useState<'rating' | 'name'>('rating');
  const [fastOnly, setFastOnly] = useState(false);
  useEffect(() => { setQuery(params.get('q') || ''); }, [params]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurants', cuisine, query, sort, fastOnly],
    queryFn: async () => {
      const req: any = {};
      if (cuisine) req.cuisine = cuisine;
      if (query) req.q = query;
      const res = await api.get('/api/restaurants', { params: req });
      let list = res.data as any[];
      if (sort === 'rating') list = list.sort((a: any, b: any) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
      if (sort === 'name') list = list.sort((a: any, b: any) => a.name.localeCompare(b.name));
      // fastOnly is a UI-only filter; using name heuristic for demo
      if (fastOnly) list = list.filter((r: any) => /pizza|burger|biryan/i.test(r.name + ' ' + r.cuisine));
      return list;
    },
  });

  return (
    <div className="container py-6">
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
          <select value={sort} onChange={e => setSort(e.target.value as any)} className="border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700">
            <option value="rating">Top rated</option>
            <option value="name">Name A-Z</option>
          </select>
          <button onClick={() => setFastOnly(v => !v)} className={`px-3 py-2 rounded-full border ${fastOnly ? 'bg-brand-600 text-white border-brand-600' : ''}`}>Fast Delivery</button>
        </div>
      </div>
      <FiltersBar setFastOnly={setFastOnly} />
      {error && <div className="rounded-md bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-100">Failed to load restaurants</div>}
      {!isLoading && !error && (!data || data.length === 0) && (
        <div className="mt-6 rounded-xl border bg-white p-6 text-center text-sm text-gray-600">
          No restaurants match your filters. Try clearing filters or searching a different term.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(isLoading ? Array.from({ length: 9 }) : data)?.map((r: any, i: number) => (
          <div key={r?.id ?? i}>
            {r ? <RestaurantCard r={r} /> : <CardSkeleton />}
          </div>
        ))}
      </div>
    </div>
  );
}

