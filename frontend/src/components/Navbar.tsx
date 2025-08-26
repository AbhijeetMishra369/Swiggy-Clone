import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { logout } from '../store/authSlice';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user } = useAppSelector(s => s.auth);
  const items = useAppSelector(s => s.cart.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState('');
  useEffect(() => { setQ(params.get('q') || ''); }, [params]);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <nav className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-12 gap-4 items-center">
        <div className="col-span-4 sm:col-span-3">
          <Link to="/" className="text-xl font-semibold text-brand-600">Foodly</Link>
        </div>
        <div className="col-span-8 sm:col-span-6">
          <form onSubmit={(e) => { e.preventDefault(); navigate(`/?q=${encodeURIComponent(q)}`); }}>
            <input
              className="w-full border border-gray-200 rounded-full px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-600"
              placeholder="Search for restaurants or cuisines"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </form>
        </div>
        <div className="col-span-12 sm:col-span-3 flex justify-end items-center gap-5">
          <Link to="/restaurants" className="text-gray-700 dark:text-gray-200 hover:text-brand-600 hidden md:inline">Restaurants</Link>
          <Link to="/cart" className="relative inline-flex">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-700 dark:text-gray-200 hover:text-brand-600">
              <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.1 0 .19.065.223.16l.716 2.149 1.33 7.721A2.25 2.25 0 008.117 15h8.514a2.25 2.25 0 002.212-1.82l.86-4.72a.75.75 0 00-.737-.88H6.53l-.39-2.335A1.875 1.875 0 004.886 3.75H2.25z" />
              <path d="M9 20.25a1.5 1.5 0 11-3.001.001A1.5 1.5 0 019 20.25zM18.75 20.25a1.5 1.5 0 11-3.001.001 1.5 1.5 0 013.001-.001z" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-brand-600 text-white text-xs rounded-full px-1.5 py-0.5">{count}</span>
            )}
          </Link>
          {!user && (
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link to="/login" className="px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">Login</Link>
              <Link to="/register" className="px-3 py-1.5 rounded-md bg-brand-600 text-white hover:bg-brand-700">Sign up</Link>
            </div>
          )}
          {user && (
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {user.role === 'ADMIN' && <Link to="/admin" className="text-gray-700 hover:text-brand-600">Admin</Link>}
              <Link to="/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-200 to-orange-300 grid place-items-center text-gray-700 dark:text-gray-900">{user.name.charAt(0)}</Link>
              <button onClick={() => { dispatch(logout()); navigate('/'); }} className="text-gray-500 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}