import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserData = () => {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const [notification, setNotification] = useState(null);
  const userId = Number(localStorage.getItem('userId'));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://blogapp-backend-e23a.onrender.com/api/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();
  }, []);

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

  if (!userData) {
    return <div>Loading...</div>;
  }

  const getUserName = (id) => {
    const user = users.find(user => user.id === id);
    return user ? user.name : 'Unknown';
  };

  const removeBlogFromReadingList = async (readingListId) => {
    try {
      await axios.delete(`https://blogapp-backend-e23a.onrender.com/api/reading-list/${readingListId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      setNotification('Blog removed from reading list');
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      console.error('Failed to remove blog from reading list', error);
      setNotification('Failed to remove blog from reading list');
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className='content'>
      <h3>My data</h3>
      {notification && <div className="notification">{notification}</div>}
      <table className="user-data-table">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{userData.name}</td>
          </tr>
          <tr>
            <th>Username</th>
            <td>{userData.username}</td>
          </tr>
        </tbody>
      </table>
      <h3>Readings</h3>
      <table className="user-data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Writer</th>
            <th>URL</th>
            <th>Likes</th>
            <th>Read</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userData.readings.map((reading, index) => (
            <tr key={index}>
              <td>{reading.title}</td>
              <td>{reading.author}</td>
              <td>{getUserName(reading.userid)}</td>
              <td>{reading.url}</td>
              <td>{reading.likes}</td>
              <td>{reading.read ? 'Yes' : 'No'}</td>
              <td>
                <button className='l-button' onClick={() => removeBlogFromReadingList(reading.readingListId)}>Remove from list</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserData;