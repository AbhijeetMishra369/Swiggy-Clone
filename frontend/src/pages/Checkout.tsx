import { useAppSelector } from '../store';
import { api } from '../lib/api';
import { loadRazorpay, openRazorpay } from '../lib/razorpay';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addToast } from '../store/toastSlice';
import { useAppDispatch } from '../store';
import { clearCart } from '../store/cartSlice';

export default function Checkout() {
  const items = useAppSelector(s => s.cart.items);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const [error, setError] = useState<string | null>(null);
  const [coupon, setCoupon] = useState('');
  const [totals, setTotals] = useState<{ subtotal: number; discount: number; total: number } | null>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => { setTotals(null); setCoupon(''); }, []);

  const applyCoupon = async () => {
    try {
      const restaurantId = items[0]?.restaurantId || 1;
      const res = await api.post('/api/orders/preview', { restaurantId, couponCode: coupon, paymentMethod: 'RAZORPAY' });
      setTotals(res.data);
      dispatch(addToast({ message: 'Coupon applied', type: 'success' }));
    } catch (e: any) {
      dispatch(addToast({ message: 'Invalid coupon', type: 'error' }));
    }
  };

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
      const place = await api.post('/api/orders/place', { restaurantId, couponCode: coupon || undefined, paymentMethod: 'RAZORPAY' });
      const orderId = place.data.id;
      const amount = Math.round((totals?.total ?? subtotal) * 100);
      const res = await api.post('/api/payment/create', { orderId, amount });
      const { providerOrderId } = res.data;
      openRazorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxx',
        amount,
        currency: 'INR',
        name: 'Foodly',
        description: 'Order payment',
        order_id: providerOrderId,
        handler: async (response: any) => {
          await api.post('/api/payment/verify', response);
          dispatch(clearCart());
          dispatch(addToast({ message: 'Payment successful', type: 'success' }));
          navigate(`/orders/${orderId}/track`);
        },
        prefill: {},
        theme: { color: '#ed6b00' },
      });
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Payment init failed');
    }
  };

  return (
    <div className="container">
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
          <p className="text-2xl font-bold">₹ {(totals?.total ?? subtotal).toFixed(2)}</p>
        </div>
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Coupon code" className="flex-1 border rounded-md px-3 py-2" />
            <button onClick={applyCoupon} className="px-3 py-2 rounded-md border">Apply</button>
          </div>
          {totals && (
            <div className="mt-2 text-sm text-gray-700">
              <div className="flex justify-between"><span>Subtotal</span><span>₹ {totals.subtotal?.toFixed(2)}</span></div>
              <div className="flex justify-between text-green-600"><span>Discount</span><span>- ₹ {totals.discount?.toFixed(2)}</span></div>
              <div className="flex justify-between font-semibold mt-1"><span>Total</span><span>₹ {totals.total?.toFixed(2)}</span></div>
            </div>
          )}
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