import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';  // Import AuthContext

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Get the login function from context
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Login
      const response = await axios.post('http://localhost:8000/api/login/', formData);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      // Get user info
      const userResponse = await axios.get('http://localhost:8000/api/me/', {
        headers: { Authorization: `Bearer ${response.data.access}` }
      });

      localStorage.setItem('user', JSON.stringify(userResponse.data));

      // Call the login function from AuthContext
      login(userResponse.data.username, userResponse.data.role, response.data.access);

      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username</label>
          <input type="text" name="username" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" name="password" className="form-control" onChange={handleChange} required />
        </div>
        <button type="submit" className="logButton">Login</button>
      </form>
    </div>
  );
}

export default Login;
