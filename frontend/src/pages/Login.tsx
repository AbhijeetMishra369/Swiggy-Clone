import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setAuthToken } from '../lib/api';
import { useAppDispatch } from '../store';
import { authError, loginSuccess } from '../store/authSlice';
import { addToast } from '../store/toastSlice';

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, id, name, role } = res.data;
      setAuthToken(token);
      dispatch(loginSuccess({ token, user: { id, email, name, role } }));
      dispatch(addToast({ message: 'Logged in successfully', type: 'success' }));
      if (role === 'ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed';
      setError(msg);
      dispatch(authError(msg));
      dispatch(addToast({ message: msg, type: 'error' }));
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center container">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="px-6 pt-6 text-center">
            <img src="/logo.svg" alt="Foodly" width={128} height={32} className="mx-auto h-8 w-32" loading="eager" decoding="sync" />
            <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Welcome back</h2>
            <p className="text-sm text-gray-500">Sign in to enjoy fast delivery and great offers</p>
          </div>
          <div className="p-6">
            {error && <div className="mb-3 rounded-md bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-100">{error}</div>}
            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Password</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full px-4 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700">Log in</button>
            </form>
            <p className="mt-3 text-sm text-gray-600 text-center">Don&apos;t have an account? <Link to="/register" className="text-brand-600 hover:text-brand-700">Register</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}