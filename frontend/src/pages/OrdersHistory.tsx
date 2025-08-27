import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAppDispatch } from '../store';
import { addToast } from '../store/toastSlice';
import { addToCart } from '../store/cartSlice';

export default function OrdersHistory() {
  const { data } = useQuery({
    queryKey: ['orders-history'],
    queryFn: async () => (await api.get('/api/orders/history')).data,
  });
  const dispatch = useAppDispatch();

  const reorder = (order: any) => {
    if (!order?.items?.length) return;
    for (const it of order.items) {
      dispatch(addToCart({ id: it.menuItem.id, name: it.menuItem.name, price: Number(it.price), quantity: it.quantity, restaurantId: order.restaurant?.id }));
    }
    dispatch(addToast({ message: 'Items added to cart', type: 'success' }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>
      <div className="space-y-4">
        {data?.map((o: any) => (
          <div key={o.id} className="rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Order #{o.id} • {o.restaurant?.name}</div>
                <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()} • <span className="px-2 py-0.5 rounded-md bg-gray-100">{o.status}</span></div>
              </div>
              <div className="text-right">
                <div className="font-semibold">₹ {o.total}</div>
                <button onClick={() => reorder(o)} className="mt-2 px-3 py-1.5 rounded-md border hover:bg-gray-50">Reorder</button>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              {o.items?.map((it: any) => (
                <span key={it.id} className="inline-block mr-2">{it.quantity}× {it.menuItem?.name}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

