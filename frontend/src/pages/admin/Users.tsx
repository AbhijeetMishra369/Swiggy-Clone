import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

export default function AdminUsers() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ['admin-users'], queryFn: async () => (await api.get('/api/admin/users')).data });
  const mut = useMutation({ mutationFn: async ({ id, blocked }: any) => (await api.put(`/api/admin/users/${id}/block`, { blocked })).data, onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }) });

  return (
    <div className="container py-6">
      <div className="rounded-xl border bg-white p-4">
        <h2 className="text-lg font-semibold mb-3">Users</h2>
        <div className="space-y-2">
        {data?.map((u: any) => (
          <div key={u.id} className="flex items-center justify-between border rounded-xl p-3">
            <div>
              <div className="font-medium">{u.name}</div>
              <div className="text-sm text-gray-600">{u.email}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${u.blocked ? 'text-red-600' : 'text-green-600'}`}>{u.blocked ? 'Blocked' : 'Active'}</span>
              <button onClick={() => mut.mutate({ id: u.id, blocked: !u.blocked })} className="px-3 py-1.5 rounded-md border">{u.blocked ? 'Unblock' : 'Block'}</button>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}