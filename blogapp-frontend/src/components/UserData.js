// UserData.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserData = () => {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null); // Define userData and setUserData
  const [notification, setNotification] = useState(null);
  const userId = Number(localStorage.getItem('userId')); // Parse userId to a number


  useEffect(() => {
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

    fetchUserData();
  }, [userId]);

  if (!userData) {
    return <div>Loading...</div>; // Render loading state
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
      setTimeout(() => setNotification(null), 5000); // Remove notification after 5 seconds
    } catch (error) {
      console.error('Failed to remove blog from reading list', error);
      setNotification('Failed to remove blog from reading list');
      setTimeout(() => setNotification(null), 5000); // Remove notification after 5 seconds
    }
  };

  

  return (
    <div className='content'>
      <h3>My data</h3>
      {notification && <div className="notification">{notification}</div>}
      <table className="user-data-table">
        <tr>
          <th>Name</th>
          <td>{userData.name}</td>
        </tr>
        <tr>
          <th>Username</th>
          <td>{userData.username}</td>
        </tr>
        <tr>
          <th>Readings</th>
          <td>
            {userData.readings.map((reading, index) => (
              <div key={index} className={`reading ${index % 2 === 0 ? 'light-row' : 'dark-row'}`}>
                <p>Title: {reading.title}</p>
                <p>Author: {reading.author}</p>
                <p>Writer: {getUserName(reading.userid)}</p>
                <p>URL: {reading.url}</p>
                <p>Likes: {reading.likes}</p>
                <p>Read: {reading.read ? 'Yes' : 'No'}</p>
                <button className='l-button' onClick={() => removeBlogFromReadingList(reading.readingListId)}>Remove from list</button>

              </div>
            ))}
          </td>
        </tr>
      </table>
    </div>
  );
};

export default UserData;