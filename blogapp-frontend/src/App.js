import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import UserData from './components/UserData';
import CreateBlog from './components/CreateBlog';
import BlogPage from './components/BlogPage';
import CreateUser from './components/CreateUser';


function App() {
  return (
    <Router>
    <Header />
    
    
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/blogs" element={<BlogPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/user-data" element={<UserData />} />
      <Route path="/create-blog" element={<CreateBlog />} />
      <Route path="/create-user" element={<CreateUser />} />
    </Routes>
  </Router>
  );
}

export default App;