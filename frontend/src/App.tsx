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
import CartPage from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AdminRestaurants from './pages/admin/Restaurants';
import AdminOrders from './pages/admin/Orders';
import AdminCoupons from './pages/admin/Coupons';
import AdminUsers from './pages/admin/Users';

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
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders/:id/track" element={<OrderTracking />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin protected examples */}
          <Route element={<ProtectedRoute role="ADMIN" />}> 
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/restaurants" element={<AdminRestaurants />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/coupons" element={<AdminCoupons />} />
            <Route path="/admin/users" element={<AdminUsers />} />
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App
