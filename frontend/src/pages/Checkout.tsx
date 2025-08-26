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
        key: 'rzp_test_xxxxxxxxxx',
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
      <div className="border rounded-xl p-4 bg-white">
        <p className="text-lg">Total payable: ₹ {subtotal.toFixed(2)}</p>
        <button onClick={handlePay} className="mt-4 px-4 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700">Pay with Razorpay</button>
      </div>
    </div>
  );
}