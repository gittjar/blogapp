import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import CreateBlog from './CreateBlog';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [userData, setUserData] = useState(null);
  const userId = Number(localStorage.getItem('userId')); // Parse userId to a number
  const navigate = useNavigate(); // Get the navigate function

  console.log('userId:', userId); 


  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://blogapp-backend-e23a.onrender.com/api/blogs', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        });
        setBlogs(response.data);
      } catch (error) {
        console.error('Failed to fetch blogs', error);
      }
    };

    const fetchUserData = async () => {
      if (userId) { // Only fetch user data if userId is not null
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

    fetchBlogs();
    fetchUserData();
  }, [userId]);

  console.log('userData:', userData); // Log the value of userData

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    setUserData(null); // Clear user data
    navigate('/'); // Redirect to home page
  };

  const handleLikeChange = async (id, likes, increment) => {
    try {
      await axios.put(`https://blogapp-backend-e23a.onrender.com/api/blogs/${id}`, {
        likes: increment ? likes + 1 : Math.max(0, likes - 1), // Increase or decrease likes, but don't go below 0
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      // Refresh blogs
      const response = await axios.get('https://blogapp-backend-e23a.onrender.com/api/blogs', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      setBlogs(response.data);
    } catch (error) {
      console.error('Failed to update likes', error);
    }
  };

  return (
    <div>
      <h1>Blog App</h1>
      <h2>Blogs</h2>
      {userData ? (
        <>
          <h3>Hello, {userData.username}! You're logged in!</h3>
          <button onClick={handleLogout}>Logout</button>
          <CreateBlog /> 
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
      {userData && <div>Your data: {JSON.stringify(userData)}</div>}
      {blogs.map((blog) => (
        <div key={blog.id}>
          <h3>{blog.title}</h3>
          <p>{blog.url}</p>
          <p>Author: {blog.username}</p>
          <p>Likes: {blog.likes}</p>
          <button onClick={() => handleLikeChange(blog.id, blog.likes, true)}>+</button>
          <button onClick={() => handleLikeChange(blog.id, blog.likes, false)}>-</button>
        </div>
      ))}
    </div>
  );
};

export default BlogPage;