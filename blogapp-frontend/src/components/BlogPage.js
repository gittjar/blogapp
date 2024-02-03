import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);
  const userId = Number(localStorage.getItem('userId'));
  const navigate = useNavigate();

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
        likes: increment ? likes + 1 : Math.max(0, likes - 1),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
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
    if (!userId) {
      setNotification('Please log in first to add blog to list');
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    try {
      await axios.post('https://blogapp-backend-e23a.onrender.com/api/reading-list', {
        blogId: blogId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      setNotification('BlogId: ' + blogId + ' added to reading list');
      setTimeout(() => setNotification(null), 5000); 

    } catch (error) {
      console.error('Failed to add blog to reading list', error);
      setNotification('Failed to add blog to reading list');
      setTimeout(() => setNotification(null), 5000); 

    }
  };

  const deleteBlog = async (id) => {
    try {
      await axios.delete(`https://blogapp-backend-e23a.onrender.com/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      setBlogs(blogs.filter(blog => blog.id !== id));
      setNotification('Blog is now deleted!');
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      setNotification('Failed to delete blog');
      console.error('Failed to delete blog', error);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className='background-image'>
      <div className='content'>
        <h2>Blogs</h2>
        {notification && <div className="notification">{notification}</div>}
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
              {userId === blog.userid && (
      <button onClick={() => deleteBlog(blog.id)} className='l-button'>Delete</button>
    )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;