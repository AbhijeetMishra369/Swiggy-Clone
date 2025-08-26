import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

const steps = ['Pending', 'Preparing', 'OutForDelivery', 'Delivered'];

export default function OrderTracking() {
  const { id } = useParams();
  const orderId = Number(id);
  const { data: order } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => (await api.get(`/api/orders/${orderId}/track`)).data,
    enabled: !!orderId,
  });
  const idx = steps.findIndex(s => s === order?.status);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Order Tracking</h1>
      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${i <= idx ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{i+1}</div>
            <span className="text-xs mt-2">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}