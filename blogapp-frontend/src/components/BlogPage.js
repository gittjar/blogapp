import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [userData, setUserData] = useState(null);
  const userId = Number(localStorage.getItem('userId')); // Parse userId to a number

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

  return (
    <div>
      <h2>Blogs</h2>
      {userData ? (
        <h3>Hello, {userData.username}! You're logged in!</h3>
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
        </div>
      ))}
    </div>
  );
};

export default BlogPage;