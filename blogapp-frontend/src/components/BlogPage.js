import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner'; 

const DeleteConfirmation = ({ blogName, onConfirm, onCancel }) => (
  <article className="delete-confirmation">
    <p>Are you sure you want to delete this blog "{blogName}"?</p>
    <button className='yes-button' onClick={onConfirm}>Yes</button>
    <button className='cancel-button' onClick={onCancel}>Cancel</button>
  </article>
);

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [loading, setLoading] = useState(true); 
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
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchBlogs();
  }, []);

  const handleLikeChange = async (id, likes, increment, blogName) => {
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
      setNotification(`Blog "${blogName}" ${increment ? '+1 like' : '-1 dislike'}`);
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error('Failed to update likes', error);
    }
  };

  const addBlogToReadingList = async (blogId, blogName) => {
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
      setNotification(`Blog "${blogName}" added to reading list`);
      setTimeout(() => setNotification(null), 5000); 

    } catch (error) {
      console.error('Failed to add blog to reading list', error);
      setNotification('Failed to add blog to reading list');
      setTimeout(() => setNotification(null), 5000); 

    }
  };

  const confirmDeleteBlog = async () => {
    try {
      await axios.delete(`https://blogapp-backend-e23a.onrender.com/api/blogs/${blogToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id));
      setNotification(`Blog "${blogToDelete.title}" is now deleted!`);
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      setNotification('Failed to delete blog');
      console.error('Failed to delete blog', error);
      setTimeout(() => setNotification(null), 5000);
    } finally {
      setShowDeleteConfirmation(false);
      setBlogToDelete(null);
    }
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setShowDeleteConfirmation(true);
  };

  return (
    <div className='background-image'>
      <div className='content'>
        <h2>Blogs</h2>
        {notification && <article className="notification-info">{notification}</article>}
        {showDeleteConfirmation && (
          <DeleteConfirmation
            blogName={blogToDelete.title}
            onConfirm={confirmDeleteBlog}
            onCancel={() => setShowDeleteConfirmation(false)}
          />
        )}
        {loading ? (
          <Spinner /> // Use the Spinner component
        ) : (
          <div className='blogcard-content'>
            {blogs.map((blog) => (
              <div key={blog.id} className='blogcard'>
                <section className='blogcardheader'>
                  <article className='header-left'>
                    <p className='blog-card-text'>Likes {blog.likes}</p>
                  </article>
                  <h3>{blog.title}</h3>
                </section>
                <section className='blogcardcontent'>
                  <p className='blog-card-text'>{blog.url}</p>
                  <p className='blog-card-text'>{blog.username}</p>
                </section>
                <section className='blogcardactions'>
                  <button className='like-button-green' onClick={() => handleLikeChange(blog.id, blog.likes, true, blog.title)}>Like</button>
                  <button className='like-button-red' onClick={() => handleLikeChange(blog.id, blog.likes, false, blog.title)}>Dislike</button>
                  <button onClick={() => addBlogToReadingList(blog.id, blog.title)} className='l-button'>Add to list</button>
                </section>
                <section className='blog-card-footer'>
                {userId === blog.userid && (
                  <button onClick={() => handleDeleteClick(blog)} className='delete-link-button'>Delete</button>
                )}
                </section>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;