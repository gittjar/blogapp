import React, { useEffect } from 'react';
import axios from 'axios';
import '../css/tyylit.css'

const MainPage = () => {
  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        await axios.get('https://blogapp-backend-e23a.onrender.com/api/blogs');
      } catch (err) {
        console.error('Failed to wake up server', err);
      }
    };

    wakeUpServer();
  }, []);

  return (
    <div className="background-image-main">
      <div>Hello visitor ! <br></br>Jarno (@gittjar) created this webapp. <br></br> 
      <hr></hr>Your Blog name or Company etc.
      </div>
    </div>
  );
};

export default MainPage;