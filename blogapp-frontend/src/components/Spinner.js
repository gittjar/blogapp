import React, { useEffect, useState } from 'react';
import '../css/spinner.css';

const Spinner = () => {
  const [message, setMessage] = useState('Loading data from database...');

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('It takes about 30 seconds to load data from the database, please be patient!');
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="spinner-container">
      <article className="spinner"></article>
      <p>{message}</p>
    </div>
  );
};

export default Spinner;