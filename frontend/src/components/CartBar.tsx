import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store';

export default function CartBar() {
  const items = useAppSelector(s => s.cart.items);
  const navigate = useNavigate();
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden">
      <div className="mx-3 mb-3 rounded-xl shadow-lg border bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">{items.length} items • ₹ {subtotal.toFixed(2)}</div>
          <div className="text-xs text-gray-500">Extra charges may apply</div>
        </div>
        <button onClick={() => navigate('/cart')} className="px-4 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700">View Cart</button>
      </div>
    </div>
  );
}

