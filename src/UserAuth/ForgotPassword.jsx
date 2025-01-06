import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const result = await fetch('http://localhost:3003/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await result.json();

      if (data.success) {
        alert('Reset link sent to your email!');
      } else {
        setErrorMessage(data.message || 'Error sending reset link.');
      }
    } catch (error) {
      setErrorMessage('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleResetPassword}>
        <h2>Forgot Password</h2>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Sending reset link...' : 'Send Reset Link'}
        </button>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
      <p>
  Remember your password? <Link to="/login">Log in</Link>
</p>

    </div>
  );
};

export default ForgotPassword;
