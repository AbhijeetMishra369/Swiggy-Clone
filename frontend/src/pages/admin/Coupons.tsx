import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../../lib/api';

export default function AdminCoupons() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-coupons'], queryFn: async () => (await api.get('/api/admin/coupons')).data });
  const [form, setForm] = useState({ code: '', percentageOff: '', amountOff: '', validFrom: '', validUntil: '' });
  const createMut = useMutation({ mutationFn: async () => (await api.post('/api/admin/coupons', {
    code: form.code,
    percentageOff: form.percentageOff ? Number(form.percentageOff) : null,
    amountOff: form.amountOff ? Number(form.amountOff) : null,
    validFrom: form.validFrom || null,
    validUntil: form.validUntil || null,
    active: true,
  })).data, onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-coupons'] }); setForm({ code: '', percentageOff: '', amountOff: '', validFrom: '', validUntil: '' }); } });
  const updateMut = useMutation({ mutationFn: async (c: any) => (await api.put(`/api/admin/coupons/${c.id}`, c)).data, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-coupons'] }) });
  const delMut = useMutation({ mutationFn: async (id: number) => (await api.delete(`/api/admin/coupons/${id}`)).data, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-coupons'] }) });

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-white p-4">
        <h2 className="text-lg font-semibold mb-3">Create Coupon</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input className="border rounded px-3 py-2" placeholder="CODE" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} />
          <input className="border rounded px-3 py-2" placeholder="% Off" value={form.percentageOff} onChange={e => setForm({ ...form, percentageOff: e.target.value })} />
          <input className="border rounded px-3 py-2" placeholder="Amount Off" value={form.amountOff} onChange={e => setForm({ ...form, amountOff: e.target.value })} />
          <input className="border rounded px-3 py-2" type="date" value={form.validFrom} onChange={e => setForm({ ...form, validFrom: e.target.value })} />
          <input className="border rounded px-3 py-2" type="date" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} />
        </div>
        <button onClick={() => createMut.mutate()} className="mt-3 px-4 py-2 rounded-md bg-brand-600 text-white">Create</button>
      </div>
      <div className="rounded-xl border bg-white p-4">
        <h2 className="text-lg font-semibold mb-3">Coupons</h2>
        <div className="space-y-2">
          {data?.map((c: any) => (
            <div key={c.id} className="flex items-center justify-between border rounded-xl p-3">
              <div>
                <div className="font-medium">{c.code}</div>
                <div className="text-sm text-gray-600">{c.percentageOff ? `${c.percentageOff}%` : c.amountOff ? `₹ ${c.amountOff}` : ''} • {c.active ? 'Active' : 'Inactive'}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateMut.mutate({ ...c, active: !c.active })} className="px-3 py-1.5 rounded-md border">{c.active ? 'Deactivate' : 'Activate'}</button>
                <button onClick={() => delMut.mutate(c.id)} className="px-3 py-1.5 rounded-md border text-red-600">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}