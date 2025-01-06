import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authContext';
import './auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Use AuthContext login function
  const navigate = useNavigate();
// const location = useLocation();
  // Redirect logged-in users
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log("Redirecting to /profile");
      navigate('/profile');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
  
    if (!username || !password) {
      setErrorMessage('Please fill in both username and password.');
      return;
    }
  
    setLoading(true);
    const body = { username, password };
  
    try {
      const result = await fetch("http://localhost:3003/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
  
      const data = await result.json();
  
      if (result.ok && data.success) {
        login(data.user, data.token); // Log the user in
        navigate('/profile'); // Redirect to profile
      } else {
        setErrorMessage(data.message || "Unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Login</h2>

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
      <p>
        Forgot password? <Link to="/forgot-password">Reset Password</Link>
      </p>
    </div>
  );
};

export default Login;