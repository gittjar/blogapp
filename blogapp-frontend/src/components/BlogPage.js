import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate



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

    fetchBlogs();
  }, []);

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

  const addBlogToReadingList = async (blogId) => {
    try {
      await axios.post('https://blogapp-backend-e23a.onrender.com/api/reading-list', {
        blogId: blogId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      alert('Blog added to reading list');
    } catch (error) {
      console.error('Failed to add blog to reading list', error);
    }
  };

  return (
    <div className='background-image'>
      <div className='content'>
        <h2>Blogs</h2>
        <div className='blogcard-content'>
          {blogs.map((blog) => (
            <div key={blog.id} className='blogcard'>
              <h3>{blog.title}</h3>
              <p>{blog.url}</p>
              <p>Writer: {blog.username}</p>
              <p>Likes: {blog.likes}</p>
              <button className='like-button-green' onClick={() => handleLikeChange(blog.id, blog.likes, true)}></button>
              <button className='like-button-red' onClick={() => handleLikeChange(blog.id, blog.likes, false)}></button>
              <button onClick={() => addBlogToReadingList(blog.id)} className='l-button'>Add to list</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;

