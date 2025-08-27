import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { addToast } from '../store/toastSlice';
import { useAppDispatch } from '../store';

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/auth/register', { name, email, password, phone, address });
      dispatch(addToast({ message: 'Account created! Please login', type: 'success' }));
      navigate('/login');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Registration failed';
      setError(msg);
      dispatch(addToast({ message: msg, type: 'error' }));
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center container">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-gray-100 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="px-6 pt-6 text-center">
            <img src="/logo.svg" alt="Foodly" width={36} height={36} className="mx-auto h-9 w-9" loading="eager" decoding="sync" />
            <h2 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">Create your account</h2>
            <p className="text-sm text-gray-500">Join Foodly in seconds</p>
          </div>
          <div className="p-6">
            {error && <div className="mb-3 rounded-md bg-red-50 text-red-700 text-sm px-3 py-2 border border-red-100">{error}</div>}
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-1">
                <label className="block text-sm text-gray-700 mb-1">Name</label>
                <input value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700" placeholder="Jane Doe" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm text-gray-700 mb-1">Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700" placeholder="9876543210" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" required className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700" placeholder="you@example.com" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">Password</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" required className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700" placeholder="••••••••" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">Address</label>
                <input value={address} onChange={e => setAddress(e.target.value)} className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700" placeholder="House no, Street, City" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="w-full px-4 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700">Create account</button>
              </div>
            </form>
            <p className="mt-3 text-sm text-gray-600 text-center">Already have an account? <Link to="/login" className="text-brand-600 hover:text-brand-700">Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}