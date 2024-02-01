// Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav>
    <Link to="/">Home</Link>
    <Link to="/login">Login</Link>
    <Link to="/blogs">Blogs</Link>
    <Link to="/user-data">User data</Link>
    <Link to="/create-blog">Create blog</Link>
    Create new user
    </nav>
  );
};

export default Header;