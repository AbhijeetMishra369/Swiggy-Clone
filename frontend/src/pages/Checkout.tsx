import { useAppSelector } from '../store';
import { api } from '../lib/api';
import { loadRazorpay, openRazorpay } from '../lib/razorpay';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const items = useAppSelector(s => s.cart.items);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePay = async () => {
    setError(null);
    const ok = await loadRazorpay();
    if (!ok) return setError('Razorpay failed to load');
    try {
      // Sync cart items into backend cart (best effort)
      for (const it of items) {
        await api.post('/api/cart/add', { menuItemId: it.id, quantity: it.quantity });
      }
      // Place order; use first item's restaurantId if available
      const restaurantId = items[0]?.restaurantId || 1;
      const place = await api.post('/api/orders/place', { restaurantId, paymentMethod: 'RAZORPAY' });
      const orderId = place.data.id;
      const res = await api.post('/api/payment/create', { orderId, amount: Math.round(subtotal * 100) });
      const { providerOrderId } = res.data;
      openRazorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxx',
        amount: Math.round(subtotal * 100),
        currency: 'INR',
        name: 'Foodly',
        description: 'Order payment',
        order_id: providerOrderId,
        handler: async (response: any) => {
          await api.post('/api/payment/verify', response);
          navigate(`/orders/${orderId}/track`);
        },
        prefill: {},
        theme: { color: '#ff5a5f' },
      });
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Payment init failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-2xl font-semibold py-6">Checkout</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div className="border rounded-xl p-4 bg-white shadow-sm">
        <h3 className="font-semibold mb-2">Delivery Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <input className="border rounded-md px-3 py-2" placeholder="House / Flat No" />
          <input className="border rounded-md px-3 py-2" placeholder="Street / Area" />
          <input className="border rounded-md px-3 py-2" placeholder="City" />
          <input className="border rounded-md px-3 py-2" placeholder="Postal Code" />
        </div>
        <div className="h-36 bg-gray-100 rounded-md grid place-items-center text-gray-500 text-sm mb-4">Map placeholder</div>
        <div className="flex items-center justify-between">
          <p className="text-lg">Total payable</p>
          <p className="text-2xl font-bold">₹ {subtotal.toFixed(2)}</p>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <button onClick={handlePay} className="px-4 py-3 rounded-lg bg-black text-white hover:opacity-90 transition">Pay with Razorpay</button>
          <button className="px-4 py-3 rounded-lg border hover:bg-gray-50 transition">Cash on Delivery</button>
        </div>
        <p className="text-xs text-gray-500 mt-3">Secured by Razorpay • Test Mode</p>
      </div>
    </div>
  );
}