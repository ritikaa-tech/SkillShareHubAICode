import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Login successful!');
        setError('');
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid email or password');
        setSuccess('');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (!navigator.onLine) {
        setError('No internet connection. Please check your network and try again.');
      } else {
        setError('Unable to connect to the server. Please try again later.');
      }
      setSuccess('');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {error && <p className="login-error">{error}</p>}
      {success && <p className="login-success">{success}</p>}
      <form className="login-form" onSubmit={handleSubmit}>
        <input 
          className="login-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input 
          className="login-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="login-button" type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
