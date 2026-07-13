import { useEffect, useState } from 'react';
import { createUser, deleteUser, fetchUsers, updateUser } from '../services/api';

const INITIAL_FORM = { name: '', email: '', password: '', role: 'sales' };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await fetchUsers();
      setUsers(response.data.users || []);
    } catch (err) {
      setError('Unable to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitLoading(true);

    const trimmedPassword = form.password.trim();
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
    };

    if (!payload.name || !payload.email) {
      setError('Name and email are required.');
      setSubmitLoading(false);
      return;
    }

    if (editingId) {
      if (trimmedPassword) {
        payload.password = trimmedPassword;
      }
    } else {
      if (!trimmedPassword) {
        setError('Password is required for new users.');
        setSubmitLoading(false);
        return;
      }
      payload.password = trimmedPassword;
    }

    try {
      if (editingId) {
        await updateUser(editingId, payload);
        setMessage('User updated successfully.');
      } else {
        await createUser(payload);
        setMessage('User created successfully.');
      }
      resetForm();
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save user. Check the inputs.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const startEdit = (user) => {
    setForm({ name: user.name, email: user.email, password: '', role: user.role || 'sales' });
    setEditingId(user.id);
    setError('');
    setMessage('');
  };

  const cancelEdit = () => {
    resetForm();
  };

  const handleDelete = async (userId) => {
    const confirmed = window.confirm('Delete this user? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setError('');
    setMessage('');
    try {
      await deleteUser(userId);
      setMessage('User deleted.');
      loadUsers();
    } catch (err) {
      setError('Unable to delete the user.');
    }
  };

  return (
    <section className="panel">
      <header className="panel-header">
        <div>
          <h2>Sales users</h2>
          <p>Create, update, and remove sales team accounts.</p>
        </div>
        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}
      </header>

      <form className="user-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="user-name">Name</label>
          <input
            id="user-name"
            name="name"
            type="text"
            placeholder="Full name"
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
        </div>
        <div className="form-field">
          <label htmlFor="user-email">Email</label>
          <input
            id="user-email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
        </div>
        <div className="form-field">
          <label htmlFor="user-password">
            Password {editingId && <span>(leave blank to keep)</span>}
          </label>
          <input
            id="user-password"
            name="password"
            type="password"
            placeholder={editingId ? 'Leave blank to keep existing password' : 'Set a password'}
            minLength={editingId ? undefined : 7}
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required={!editingId}
          />
        </div>
        <div className="form-field">
          <label htmlFor="user-role">Role</label>
          <select
            id="user-role"
            name="role"
            value={form.role}
            onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
          >
            <option value="sales">Sales</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="primary" disabled={submitLoading}>
            {editingId
              ? submitLoading
                ? 'Updating...'
                : 'Update user'
              : submitLoading
              ? 'Creating...'
              : 'Create user'}
          </button>
          {editingId && (
            <button type="button" className="secondary" onClick={cancelEdit} disabled={submitLoading}>
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="users-table">
        <div className="table-header">
          <h3>Existing users</h3>
        </div>
        {loading ? (
          <p>Loading users…</p>
        ) : users.length === 0 ? (
          <p>No users yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                  <td className="table-actions">
                    <button type="button" onClick={() => startEdit(user)}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
