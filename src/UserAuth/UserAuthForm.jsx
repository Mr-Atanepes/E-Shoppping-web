import React, { useState } from "react";
import './UserAuthForm.css';
const UserAuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setIsResetPassword(false); // Reset password mode should be off when toggling
    setUsername('');
    setPassword('');
    setEmail('');
  };

  const toggleResetPassword = () => {
    setIsResetPassword(true);
    setIsLogin(false); // Reset password is not part of login/signup
    setUsername('');
    setPassword('');
    setEmail('');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const result = await fetch('http://localhost:3003/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await result.json();

      if (data.success) {
        alert('Reset link sent to your email!');
        setIsResetPassword(false); // Redirect to login mode after success
      } else {
        setErrorMessage(data.message || 'Error sending reset link.');
      }
    } catch (error) {
      setErrorMessage('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin && (!username || !password)) {
      setErrorMessage('Please fill in both username and password.');
      return;
    }

    if (!email || !password) {
      setErrorMessage('Please fill in both Username and password.');
      return;
    }

    setLoading(true);
    const url = isLogin ? 'http://localhost:3003/login' : 'http://localhost:3003/signup';
    const body = {
      username,
      password,
      email,
    };

    try {
      const result = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await result.json();

      if (data.success) {
        // Store the JWT token and user data in localStorage or sessionStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        alert(isLogin ? 'Login successful!' : 'Signup successful!');
        setIsLogin(true); // Redirect to login mode after success
      } else {
        setErrorMessage(data.message || 'Error during login/signup.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={isResetPassword ? handleResetPassword : handleSubmit}>
        <h2>{isResetPassword ? 'Reset Password' : isLogin ? 'Login' : 'Sign Up'}</h2>

        {!isResetPassword && (
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required={!isResetPassword}
            />
          </div>
        )}

        {!isLogin && !isResetPassword && (
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={!isLogin}
            />
          </div>
        )}

        {isResetPassword && (
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required={isResetPassword}
            />
          </div>
        )}

        {!isResetPassword && (
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
        )}

        <button type="submit" className="submit-btn" disabled={loading}>
          {isResetPassword ? 'Send Reset Link' : isLogin ? 'Login' : 'Sign Up'}
        </button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>

      {!isResetPassword && (
        <p className="toggle-mode" onClick={toggleMode}>
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </p>
      )}

      {!isResetPassword && (
        <p className="reset-password" onClick={toggleResetPassword}>
          Forgot Password?
        </p>
      )}

      {isResetPassword && (
        <p className="toggle-mode" onClick={() => setIsResetPassword(false)}>
          Back to Login
        </p>
      )}
    </div>
  );
};

export default UserAuthForm;
