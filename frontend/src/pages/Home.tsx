import { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import RestaurantCard from '../components/RestaurantCard';
import { CardSkeleton } from '../components/Skeletons';
import type { Restaurant } from '../types';
import { useSearchParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';

export default function Home() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState('');
  useEffect(() => { setQuery(params.get('q') || ''); }, [params]);
  const [cuisine, setCuisine] = useState('');
  const [page, setPage] = useState(1);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setPage((p) => p + 1);
      });
    }, { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, [loadMoreRef]);

  const banners = useMemo(() => ([
    {
      title: '50% OFF on First Order',
      subtitle: 'Use code NEW50 at checkout',
      image: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?q=80&w=1800&auto=format&fit=crop',
      color: 'from-rose-500/90 to-orange-500/90',
    },
    {
      title: 'Free Delivery over ₹199',
      subtitle: 'No hidden fees. Fast delivery.',
      image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1800&auto=format&fit=crop',
      color: 'from-emerald-500/90 to-teal-500/90',
    },
    {
      title: 'Trending Dishes Near You',
      subtitle: 'Handpicked favorites from top chefs',
      image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1800&auto=format&fit=crop',
      color: 'from-indigo-500/90 to-purple-500/90',
    },
  ]), []);

  return (
    <div>
      {/* Hero Carousel */}
      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="h-[260px] md:h-[360px]"
        >
          {banners.map((b, i) => (
            <SwiperSlide key={i}>
              <div className="relative h-full">
                <img src={b.image} alt={b.title} className="w-full h-full object-cover" loading="eager" decoding="async" />
                <div className={`absolute inset-0 bg-gradient-to-r ${b.color}`} />
                <div className="absolute inset-0 max-w-6xl mx-auto px-4 flex items-center">
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="text-white">
                    <h2 className="text-2xl md:text-4xl font-extrabold drop-shadow">{b.title}</h2>
                    <p className="mt-1 md:mt-2 text-sm md:text-base opacity-90">{b.subtitle}</p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input className="border rounded-md px-3 py-2 text-gray-900" placeholder="Search restaurants" value={query} onChange={e => setQuery(e.target.value)} />
                      <select className="border rounded-md px-3 py-2 text-gray-900" value={cuisine} onChange={e => setCuisine(e.target.value)}>
                        <option value="">All cuisines</option>
                        <option>Indian</option>
                        <option>Italian</option>
                        <option>Chinese</option>
                        <option>Mexican</option>
                      </select>
                      <button className="px-4 py-2 rounded-md bg-black/90 hover:bg-black transition text-white">Search</button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Popular Restaurants (horizontal scroll) */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Popular Restaurants Near You</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {(isLoading ? Array.from({ length: 8 }) : data)?.map((r: any, i: number) => (
            <motion.div whileHover={{ y: -3 }} key={r?.id ?? i} className="min-w-[250px]">
              {r ? <RestaurantCard r={r} /> : <CardSkeleton className="w-[250px]" />}
            </motion.div>
          ))}
        </div>

        {/* Top Offers */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Top Offers</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {(isLoading ? Array.from({ length: 8 }) : data)?.slice(0, page * 8).map((r: any, i: number) => (
            <motion.div key={r?.id ?? i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              {r ? <RestaurantCard r={r} /> : <CardSkeleton />}
            </motion.div>
          ))}
        </div>
        <div ref={loadMoreRef} className="h-6" />

        {/* Trending Dishes */}
        <div className="mt-10 flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Trending Dishes</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} className="border rounded-xl overflow-hidden bg-white">
              <div className="h-28 bg-gray-100">
                <img src={`https://images.unsplash.com/photo-15${40+i}674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop`} alt="dish" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </div>
              <div className="p-3">
                <p className="font-medium">Popular Dish {i}</p>
                <p className="text-sm text-gray-600">₹ {149 + i * 10}</p>
                <button className="mt-2 w-full px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-700">Add to Cart</button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cuisine Categories */}
        <div className="mt-10 flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Cuisine Categories</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {['Pizza','Biryani','Burgers','Desserts','Chinese','South Indian'].map((c) => (
            <motion.div key={c} whileHover={{ y: -3 }} className="rounded-xl overflow-hidden border bg-white">
              <div className="h-24 bg-gray-100">
                <img src={`https://source.unsplash.com/800x600/?${encodeURIComponent(c)}&sig=1`} alt={c} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </div>
              <div className="p-2 text-center text-sm font-medium">{c}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}