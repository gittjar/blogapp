import React, { useState } from 'react';
import axios from 'axios';

const CreateUser = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setNotification('Passwords do not match');
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    try {
      const response = await axios.post('https://blogapp-backend-e23a.onrender.com/api/users', {
        name,
        username,
        password,
      });

      if (response.status === 201) {
        setNotification('User added successfully');
        setName('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      console.error('Failed to add user', error);
      setNotification('Failed to add user');
      setTimeout(() => setNotification(null), 5000);
    }
  };

  return (
    <div className='creation-form'>
      <div>
        <h2>Create User</h2>
        {notification && <div className="notification">{notification}</div>}
        <form onSubmit={handleSubmit}>
          <label>
            Your Name<br></br>
            <input className='cpasw' type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label><br></br>
            Username<br></br>
            <input className='cpasw'  type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <label><br></br>
            Password<br></br>
            <input className='cpasw'  type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <label><br></br>
            Password again<br></br>
            <input className='cpasw'  type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </label><br></br>
          <button type="submit" className='loginbutton'>Create User</button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;