import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { logout } from '../store/authSlice';

export default function Navbar() {
  const { user } = useAppSelector(s => s.auth);
  const items = useAppSelector(s => s.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-brand-600">
          Foodly
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/restaurants" className="text-gray-700 hover:text-brand-600">Restaurants</Link>
          <Link to="/cart" className="relative">
            <span className="material-icons align-middle">shopping_bag</span>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {count}
              </span>
            )}
          </Link>
          {!user && (
            <>
              <Link to="/login" className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50">Login</Link>
              <Link to="/register" className="px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-700">Sign up</Link>
            </>
          )}
          {user && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">{user.name}</span>
              <button onClick={() => { dispatch(logout()); navigate('/'); }} className="text-gray-500 hover:text-gray-800">Logout</button>
              {user.role === 'ADMIN' && <Link to="/admin" className="text-gray-700 hover:text-brand-600">Admin</Link>}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}