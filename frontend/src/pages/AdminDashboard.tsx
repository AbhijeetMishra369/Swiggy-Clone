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
    <div className="min-h-[70vh] grid grid-cols-12">
      <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r bg-white">
        <div className="p-4 font-semibold text-brand-600">Foodly Admin</div>
        <nav className="p-2 space-y-1 text-sm">
          <a className="block px-4 py-2 rounded-md hover:bg-gray-50" href="/admin">Dashboard</a>
          <a className="block px-4 py-2 rounded-md hover:bg-gray-50" href="/admin/restaurants">Restaurants</a>
          <a className="block px-4 py-2 rounded-md hover:bg-gray-50" href="/admin/orders">Orders</a>
          <a className="block px-4 py-2 rounded-md hover:bg-gray-50" href="#">Coupons</a>
          <a className="block px-4 py-2 rounded-md hover:bg-gray-50" href="#">Users</a>
        </nav>
      </aside>
      <main className="col-span-12 md:col-span-9 lg:col-span-10 p-4">
        <div className="flex items-center justify-end mb-4">
          <div className="text-sm text-gray-600">Admin</div>
        </div>
        <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-600">Total Sales</div>
            <div className="text-2xl font-semibold">₹ 1,25,000</div>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-600">Orders</div>
            <div className="text-2xl font-semibold">1,235</div>
          </div>
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="text-sm text-gray-600">Active Users</div>
            <div className="text-2xl font-semibold">458</div>
          </div>
        </div>
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
      </main>
    </div>
  );
}