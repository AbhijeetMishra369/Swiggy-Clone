import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { api } from './lib/api';
import './App.css';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import RestaurantDetails from './pages/RestaurantDetails';

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/restaurants" element={<RestaurantsPage />} />
          <Route path="/restaurants/:id" element={<RestaurantDetails />} />

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
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App
