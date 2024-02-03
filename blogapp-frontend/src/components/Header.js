// Header.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const [userData, setUserData] = useState(null);
  const userId = Number(localStorage.getItem('userId'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          const response = await axios.get(`https://blogapp-backend-e23a.onrender.com/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            },
          });
          setUserData(response.data);
        } catch (error) {
          console.error('Failed to fetch user data', error);
        }
      }
    };

    fetchUserData();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    setUserData(null);
    navigate('/');
  };

  return (

    <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link className='header-link' to="/">Home</Link>
        <Link className='header-link' to="/blogs">Blogs</Link>
        <Link className='header-link' to="/create-user">Create user</Link>
        {userData ? (
          <>
            <Link className='header-link' to="/user-data">User data</Link>
            <Link className='header-link' to="/create-blog">Create blog</Link>
          </>
        ) : (
          <Link className='header-link' to="/login">Login</Link>
        )}
      </div>
      {userData && (
        <div>
          <span>Hello, {userData.username}! You're logged in!</span>
          <button onClick={handleLogout} className='logout-button'>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Header;