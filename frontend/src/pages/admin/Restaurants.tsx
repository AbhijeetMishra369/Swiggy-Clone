import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useState } from 'react';

export default function AdminRestaurants() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-restaurants'], queryFn: async () => (await api.get('/api/admin/restaurants')).data });
  const [form, setForm] = useState({ name: '', cuisine: '', imageUrl: '', location: '' });
  const createMut = useMutation({ mutationFn: async () => (await api.post('/api/admin/restaurants', form)).data, onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-restaurants'] }); setForm({ name: '', cuisine: '', imageUrl: '', location: '' }); } });
  const delMut = useMutation({ mutationFn: async (id: number) => (await api.delete(`/api/admin/restaurants/${id}`)).data, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-restaurants'] }) });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-4">
        <h2 className="text-lg font-semibold mb-3">Add Restaurant</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Cuisine" value={form.cuisine} onChange={e => setForm({ ...form, cuisine: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Image URL" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
        </div>
        <button onClick={() => createMut.mutate()} className="mt-3 px-4 py-2 rounded-md bg-brand-600 text-white">Create</button>
      </div>
      <div className="rounded-xl border bg-white p-4">
        <h2 className="text-lg font-semibold mb-3">Restaurants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((r: any) => (
            <div key={r.id} className="border rounded-xl overflow-hidden">
              <div className="h-32 bg-gray-50">{r.imageUrl && <img src={r.imageUrl} className="w-full h-full object-cover" />}</div>
              <div className="p-3">
                <div className="font-medium">{r.name}</div>
                <div className="text-sm text-gray-600">{r.cuisine} • {r.location}</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => delMut.mutate(r.id)} className="px-3 py-1.5 rounded-md border text-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}