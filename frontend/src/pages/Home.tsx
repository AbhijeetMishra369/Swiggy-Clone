import { useState, useEffect, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import RestaurantCard from '../components/RestaurantCard';
import { CardSkeleton } from '../components/Skeletons';
import { useSearchParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { motion } from 'framer-motion';
import SmartImage from '../components/SmartImage';
import Carousel from '../components/Carousel';

export default function Home() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState('');
  useEffect(() => { setQuery(params.get('q') || ''); }, [params]);
  const [cuisine, setCuisine] = useState('');
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['restaurants', query, cuisine],
    queryFn: async ({ pageParam = 0 }) => {
      const params: any = { page: pageParam, size: 8 };
      if (cuisine) params.cuisine = cuisine;
      if (query) params.q = query;
      const res = await api.get('/api/restaurants', { params });
      return res.data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.last) return undefined;
      return lastPage.pageable.pageNumber + 1;
    },
  });

  const restaurants = useMemo(() => data?.pages.flatMap(page => page.content) ?? [], [data]);

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
      {/* Hero Carousel (compact) */}
      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="h-[180px] md:h-[260px]"
        >
          {banners.map((b, i) => (
            <SwiperSlide key={i}>
              <div className="relative h-full">
                <SmartImage src={b.image} alt={b.title} className="" eager />
                <div className={`absolute inset-0 bg-gradient-to-r ${b.color}`} />
                <div className="absolute inset-0 container flex items-center">
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="text-white">
                    <h2 className="text-xl md:text-3xl font-extrabold drop-shadow">{b.title}</h2>
                    <p className="mt-1 md:mt-1.5 text-sm md:text-base opacity-90">{b.subtitle}</p>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="container py-6">
        <div className="mb-6 p-4 rounded-lg bg-gray-50 border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className="border rounded-md px-3 py-2 text-gray-900 w-full" placeholder="Search restaurants..." value={query} onChange={e => setQuery(e.target.value)} />
            <select className="border rounded-md px-3 py-2 text-gray-900 w-full" value={cuisine} onChange={e => setCuisine(e.target.value)}>
              <option value="">All Cuisines</option>
              <option>Indian</option>
              <option>Italian</option>
              <option>Chinese</option>
              <option>Mexican</option>
            </select>
            <button className="px-4 py-2 rounded-md bg-brand-600 hover:bg-brand-700 transition text-white w-full">Search</button>
          </div>
        </div>

        {/* Featured Restaurants (carousel) */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Featured Restaurants</h2>
        </div>
        <Carousel withPagination autoplayMs={3500}>
          {(isLoading ? Array.from({ length: 8 }) : restaurants)?.map((r: any, i: number) => (
            <div key={r?.id ?? i} className="h-full">
              {r ? <RestaurantCard r={r} /> : <CardSkeleton />}
            </div>
          ))}
        </Carousel>

        {/* Top Offers */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Top Offers</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {(isLoading && !restaurants.length) ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />) : restaurants.map((r: any) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <RestaurantCard r={r} />
            </motion.div>
          ))}
        </div>
        {hasNextPage && (
          <div className="mt-6 text-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="px-6 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700 disabled:bg-gray-400"
            >
              {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {/* Trending Dishes (carousel on mobile) */}
        <div className="mt-10 flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Trending Dishes</h2>
        </div>
        <div className="hidden md:grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map((i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} className="border rounded-xl overflow-hidden bg-white">
              <div className="h-24 bg-gray-100">
                <SmartImage src={`https://images.unsplash.com/photo-15${40+i}674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop`} alt="dish" />
              </div>
              <div className="p-3">
                <p className="font-medium">Popular Dish {i}</p>
                <p className="text-sm text-gray-600">₹ {149 + i * 10}</p>
                <button className="mt-2 w-full px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-700">Add to Cart</button>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="md:hidden">
          <Carousel slidesPerView={{ 0: 1.2, 480: 1.6 }} spaceBetween={10} autoplayMs={3500}>
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="border rounded-xl overflow-hidden bg-white">
                <div className="h-24 bg-gray-100">
                  <SmartImage src={`https://images.unsplash.com/photo-15${40+i}674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop`} alt="dish" />
                </div>
                <div className="p-3">
                  <p className="font-medium">Popular Dish {i}</p>
                  <p className="text-sm text-gray-600">₹ {149 + i * 10}</p>
                  <button className="mt-2 w-full px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-700">Add to Cart</button>
                </div>
              </div>
            ))}
          </Carousel>
        </div>

        {/* Cuisine Categories */}
        <div className="mt-10 flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Cuisine Categories</h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {['Pizza','Biryani','Burgers','Desserts','Chinese','South Indian'].map((c) => (
            <motion.div
              key={c}
              whileHover={{ y: -3 }}
              className={`rounded-xl overflow-hidden border bg-white cursor-pointer ${cuisine === c ? 'ring-2 ring-brand-500' : ''}`}
              onClick={() => setCuisine(c === cuisine ? '' : c)}
            >
              <div className="h-20 bg-gray-100">
                <SmartImage src={`https://source.unsplash.com/800x600/?${encodeURIComponent(c)}&sig=1`} alt={c} />
              </div>
              <div className="p-2 text-center text-sm font-medium">{c}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}