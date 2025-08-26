import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api, setAuthToken } from '../lib/api';
import { useAppDispatch } from '../store';
import { authError, loginSuccess } from '../store/authSlice';

export default function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, id, name, role } = res.data;
      setAuthToken(token);
      dispatch(loginSuccess({ token, user: { id, email, name, role } }));
      if (role === 'ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed';
      setError(msg);
      dispatch(authError(msg));
    }
  };

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don&apos;t have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}