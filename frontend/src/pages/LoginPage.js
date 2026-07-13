import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../services/api';
import { useAuth } from '../AuthContext';

const initial = { email: '', password: '' };

export default function LoginPage() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('Signing in...');
    try {
      const response = await loginRequest({
        email: form.email.trim(),
        password: form.password,
      });
      login(response.data.token);
      setStatus('Welcome back! Redirecting...');
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login. Check your credentials.');
      setStatus('');
    }
  };

  return (
    <section className="form-panel">
      <h2>Sales Login</h2>
      <p>Sign in to manage sales users and track activity.</p>
      {status && <div className="message">{status}</div>}
      {error && <div className="message error">{error}</div>}
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
          />
        </div>
        <div className="form-field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            required
            minLength={7}
            value={form.password}
            onChange={handleChange}
            placeholder="At least 7 characters"
          />
        </div>
        <button type="submit" className="primary">
          Login
        </button>
      </form>
    </section>
  );
}
