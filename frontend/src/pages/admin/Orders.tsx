import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

const statuses = ['Pending', 'Preparing', 'OutForDelivery', 'Delivered'];

export default function AdminOrders() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-orders'], queryFn: async () => (await api.get('/api/admin/orders')).data });
  const mut = useMutation({ mutationFn: async ({ id, status }: any) => (await api.put(`/api/admin/orders/${id}/status`, { status })).data, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-orders'] }) });

  return (
    <div className="rounded-xl border bg-white p-4">
      <h2 className="text-lg font-semibold mb-3">Orders</h2>
      <div className="space-y-3">
        {data?.map((o: any) => (
          <div key={o.id} className="flex items-center justify-between border rounded-xl p-3">
            <div>
              <div className="font-medium">Order #{o.id}</div>
              <div className="text-sm text-gray-600">User #{o.user?.id} • ₹ {o.total}</div>
            </div>
            <div className="flex items-center gap-2">
              <select className="border rounded px-2 py-1" defaultValue={o.status} onChange={e => mut.mutate({ id: o.id, status: e.target.value })}>
                {statuses.map(s => <option key={s}>{s}</option>)}
              </select>
              <span className="text-sm text-gray-500">Updated</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}