import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', sales: 1200 },
  { name: 'Tue', sales: 900 },
  { name: 'Wed', sales: 1600 },
  { name: 'Thu', sales: 1100 },
  { name: 'Fri', sales: 1800 },
  { name: 'Sat', sales: 2200 },
  { name: 'Sun', sales: 2000 },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      <div className="rounded-xl border bg-white p-4">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#ff5a5f" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}