// UserData.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserData = ({ userData }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('https://blogapp-backend-e23a.onrender.com/api/users');
      setUsers(response.data);
    };

    fetchUsers();
  }, []);

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
      alert('Blog removed from reading list');
    } catch (error) {
      console.error('Failed to remove blog from reading list', error);
    }
  };

  

  return (
    <div>
      <h3>My data</h3>
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
                <button onClick={() => removeBlogFromReadingList(reading.readingListId)}>Remove from list</button>

              </div>
            ))}
          </td>
        </tr>
      </table>
    </div>
  );
};

export default UserData;