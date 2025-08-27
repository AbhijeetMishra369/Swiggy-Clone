import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { addToast } from '../store/toastSlice';
import { useAppDispatch } from '../store';

const steps = ['Pending', 'Preparing', 'OutForDelivery', 'Delivered'];

export default function OrderTracking() {
  const { id } = useParams();
  const orderId = Number(id);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const [driver, setDriver] = useState<{ lat: number; lng: number } | null>(null);
  const dispatch = useAppDispatch();
  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => (await api.get(`/api/orders/${orderId}/track`)).data,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    enabled: !!orderId,
  });
  const currentStatus = liveStatus || order?.status;
  const idx = steps.findIndex(s => s === currentStatus);

  useEffect(() => {
    if (!orderId) return;
    const ev = new EventSource(`${api.defaults.baseURL}/api/orders/${orderId}/events`);
    ev.addEventListener('status', (e: MessageEvent) => {
      setLiveStatus(String(e.data));
      if (Notification?.permission === 'granted') {
        new Notification('Order update', { body: String(e.data) });
      } else if (Notification && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
      if (String(e.data) === 'Delivered') {
        dispatch(addToast({ message: 'Order delivered 🎉', type: 'success' }));
      }
    });
    ev.addEventListener('location', (e: MessageEvent) => {
      const [lat, lng] = String(e.data).split(',').map(Number);
      setDriver({ lat, lng });
    });
    ev.onerror = () => {
      ev.close();
    };
    return () => ev.close();
  }, [orderId]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Order Tracking</h1>
      <div className="mb-4 h-48 rounded-xl border bg-gray-100 grid place-items-center relative overflow-hidden">
        {/* Simple map mock */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
        {driver ? (
          <div className="relative z-10 text-sm bg-white px-2 py-1 rounded-md shadow">Driver at {driver.lat.toFixed(3)}, {driver.lng.toFixed(3)}</div>
        ) : (
          <div className="relative z-10 text-sm text-gray-600">Waiting for driver location…</div>
        )}
      </div>
      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center">
            <motion.div initial={{ scale: 0.9, opacity: 0.7 }} animate={{ scale: i <= idx ? 1.05 : 1, opacity: 1 }}
              className={`w-10 h-10 rounded-full grid place-items-center ${i <= idx ? 'bg-brand-600 text-white shadow' : 'bg-gray-200 text-gray-600'}`}>
              {i < 3 ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5zM10.72 15.53l-3-3a.75.75 0 111.06-1.06l2.47 2.47 4.97-4.97a.75.75 0 111.06 1.06l-5.5 5.5a.75.75 0 01-1.06 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              )}
            </motion.div>
            <span className="text-xs mt-2">{s}</span>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-brand-600 transition-all" style={{ width: `${((idx + 1) / steps.length) * 100}%` }} />
        </div>
        <div className="mt-2 text-sm text-gray-600">Status: {currentStatus ?? 'Loading...'}</div>
      </div>
    </div>
  );
}