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
      <div className="background-image-login">
      <div className="content" >
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          {error && <div className="error">{error}</div>}
         
            <label>Username</label><br></br>
            <article>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </article>
          
            <label>Password</label>
            <br></br>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <br></br>
        <span >
         <button type="submit" class='loginbutton'>Login</button>
         </span>

        

         
        </form>
      </div>
    </div>
  );
};

export default LoginPage;