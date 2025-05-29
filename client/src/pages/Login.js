import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Make sure the path is correct

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth(); // ⬅️ get the login function from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting login with password:", `"${password}"`, "Length:", password.length);
    try {
      const response = await fetch('https://skillsharehubbackend.onrender.com/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Login successful!');
        setError('');

        // Update AuthContext
        console.log('Login data:', data);
        login(data.user, data.token); // ⬅️ use context to set token and user

        console.log('Login success:', data);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
        setSuccess('');
      }
    } catch (err) {
      setError('Server error, please try again later.');
      setSuccess('');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <br />
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
