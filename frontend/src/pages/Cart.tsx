import { useAppDispatch, useAppSelector } from '../store';
import { updateQuantity, removeFromCart } from '../store/cartSlice';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const items = useAppSelector(s => s.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="max-w-5xl mx-auto px-4">
      <h1 className="text-2xl font-semibold py-6">Your Cart</h1>
      <div className="space-y-3">
        {items.map(i => (
          <div key={i.id} className="flex items-center justify-between border rounded-xl p-4 bg-white">
            <div>
              <h3 className="font-medium">{i.name}</h3>
              <p className="text-sm text-gray-600">₹ {i.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <input type="number" min={1} className="w-16 border rounded px-2 py-1" value={i.quantity}
                     onChange={e => dispatch(updateQuantity({ id: i.id, quantity: Number(e.target.value) }))} />
              <button className="text-red-600" onClick={() => dispatch(removeFromCart(i.id))}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between py-6">
        <p className="text-lg font-semibold">Subtotal: ₹ {subtotal.toFixed(2)}</p>
        <button onClick={() => navigate('/checkout')} className="px-4 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700">Checkout</button>
      </div>
    </div>
  );
}