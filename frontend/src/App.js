import { NavLink, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UsersPage from './pages/UsersPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './AuthContext';
import './App.css';

function App() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>Sales Auth Portal</h1>
          <p>Login, register, and manage sales users securely.</p>
        </div>
        <nav className="app-nav">
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Signup</NavLink>
          <NavLink to="/users">Users</NavLink>
        </nav>
        {isAuthenticated && (
          <button type="button" className="secondary" onClick={logout}>
            Logout
          </button>
        )}
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
