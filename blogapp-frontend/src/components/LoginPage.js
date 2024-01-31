import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/tyylit.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleLogin = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post('https://blogapp-backend-e23a.onrender.com/api/login', {
        username,
        password,
      });
  
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userId', response.data.id); // Store user ID
  
      navigate('/blogs'); // Use navigate instead of history.push
    } catch (error) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login">
      <h2>Login</h2>
      <div className="main">
      <form onSubmit={handleLogin}>
        <div>
          <label>Username</label><br></br>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password</label><br></br>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p>{error}</p>}
        <button type="submit" className='login-button'>Login</button>
      </form>
    </div>
    </div>
  );
};

export default LoginPage;