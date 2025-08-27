import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { api } from '../lib/api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addToast } from '../store/toastSlice';
import { loginSuccess } from '../store/authSlice';

export default function Profile() {
  const { user, token } = useAppSelector(s => s.auth);
  const dispatch = useAppDispatch();
  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: async () => (await api.get('/auth/me')).data,
    enabled: !!token,
  });

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (data) {
      setName(data.name || '');
      setPhone(data.phone || '');
      setAddress(data.address || '');
    } else if (user) {
      setName(user.name || '');
    }
  }, [data, user]);

  const saveMut = useMutation({
    mutationFn: async () => (await api.put('/auth/me', { name, phone, address })).data,
    onSuccess: (updated) => {
      dispatch(addToast({ message: 'Profile updated', type: 'success' }));
      if (token) dispatch(loginSuccess({ token, user: { id: updated.id, email: updated.email, name: updated.name, role: updated.role } }));
    },
    onError: () => dispatch(addToast({ message: 'Failed to update profile', type: 'error' })),
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
      <div className="border rounded-xl p-4 bg-white dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input className="w-full border rounded-md px-3 py-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-700" value={data?.email ?? user?.email ?? ''} disabled />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Phone</label>
            <input className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Address</label>
            <input className="w-full border rounded-md px-3 py-2 dark:bg-gray-800 dark:border-gray-700" value={address} onChange={e => setAddress(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={() => saveMut.mutate()} disabled={saveMut.isPending} className="px-4 py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700">Save changes</button>
          <span className="text-sm text-gray-500">Role: {user?.role}</span>
        </div>
      </div>
    </div>
  );
}