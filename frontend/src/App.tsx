import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { api } from './lib/api';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

const queryClient = new QueryClient();

type Address = { city: string };
type Restaurant = { id: number; name: string; cuisine: string; averageRating: number; address: Address };

function RestaurantsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurants'],
    queryFn: async () => (await api.get<Restaurant[]>('/api/restaurants')).data,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading restaurants</p>;
  return (
    <div className="container">
      <h2>Restaurants</h2>
      <ul>
        {data?.map(r => (
          <li key={r.id}>{r.name} — {r.cuisine} — {r.address?.city} — ⭐ {r.averageRating}</li>
        ))}
      </ul>
    </div>
  );
}

function Home() {
  return (
    <div className="container">
      <h1>Food Delivery</h1>
      <p><Link to="/restaurants">Browse Restaurants</Link></p>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />

          {/* Customer protected examples */}
          <Route element={<ProtectedRoute role="CUSTOMER" />}> 
            <Route path="/cart" element={<div>Cart</div>} />
            <Route path="/orders" element={<div>Orders</div>} />
            <Route path="/profile" element={<div>Profile</div>} />
          </Route>

          {/* Admin protected examples */}
          <Route element={<ProtectedRoute role="ADMIN" />}> 
            <Route path="/admin" element={<div>Admin Dashboard</div>} />
            <Route path="/admin/restaurants" element={<div>Manage Restaurants</div>} />
            <Route path="/admin/orders" element={<div>Manage Orders</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App
