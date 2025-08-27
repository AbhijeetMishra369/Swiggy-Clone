import { useAppDispatch, useAppSelector } from '../store';
import { updateQuantity, removeFromCart } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';
import SmartImage from '../components/SmartImage';

export default function CartPage() {
  const items = useAppSelector(s => s.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="container">
      <h1 className="text-2xl font-semibold py-6">Your Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          {items.map(i => (
            <div key={i.id} className="flex items-center justify-between border rounded-xl p-4 bg-white shadow-sm gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 flex-shrink-0">
                <SmartImage src={`https://source.unsplash.com/200x200/?food&sig=${i.id}`} alt={i.name} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{i.name}</h3>
                <p className="text-sm text-gray-600">₹ {i.price}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-2 py-1 rounded-md border" onClick={() => dispatch(updateQuantity({ id: i.id, quantity: Math.max(1, i.quantity - 1) }))}>-</button>
                <span className="w-8 text-center">{i.quantity}</span>
                <button className="px-2 py-1 rounded-md border" onClick={() => dispatch(updateQuantity({ id: i.id, quantity: i.quantity + 1 }))}>+</button>
                <button className="text-red-600" onClick={() => dispatch(removeFromCart(i.id))}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="md:col-span-1">
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h3 className="font-semibold mb-2">Price Summary</h3>
            <div className="flex items-center justify-between text-sm text-gray-700">
              <span>Subtotal</span>
              <span>₹ {subtotal.toFixed(2)}</span>
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <input placeholder="Coupon code" className="flex-1 border rounded-md px-3 py-2" />
                <button className="px-3 py-2 rounded-md border">Apply</button>
              </div>
              <p className="text-xs text-green-600 mt-1">Use NEW50 for 50% off first order</p>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-700">
              <span>Delivery</span>
              <span>₹ 0.00</span>
            </div>
            <div className="my-3 border-t" />
            <div className="flex items-center justify-between font-medium">
              <span>Total</span>
              <span>₹ {subtotal.toFixed(2)}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="mt-4 w-full px-4 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700">Checkout</button>
          </div>
          <div className="mt-4 border rounded-xl p-4 bg-white shadow-sm">
            <h4 className="font-semibold mb-2">Delivery Address</h4>
            <div className="h-32 bg-gray-100 rounded-md grid place-items-center text-gray-500 text-sm">Map placeholder</div>
          </div>
        </div>
      </div>
    </div>
  );
}