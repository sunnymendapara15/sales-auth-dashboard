import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup as signupRequest } from '../services/api';
import { useAuth } from '../AuthContext';

const initial = { name: '', email: '', password: '' };

export default function SignupPage() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = ({ target: { name, value } }) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setStatus('Creating account...');
    try {
      const response = await signupRequest({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      login(response.data.token);
      setStatus('Account created successfully. Redirecting...');
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to signup. Please verify the inputs.');
      setStatus('');
    }
  };

  return (
    <section className="form-panel">
      <h2>Sales Signup</h2>
      <p>Create a new sales user account with secure credentials.</p>
      {status && <div className="message">{status}</div>}
      {error && <div className="message error">{error}</div>}
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-field">
          <label htmlFor="signup-name">Name</label>
          <input
            id="signup-name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
          />
        </div>
        <div className="form-field">
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
          />
        </div>
        <div className="form-field">
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
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
          Create account
        </button>
      </form>
    </section>
  );
}
