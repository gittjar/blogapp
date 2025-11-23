import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Header from './components/Header';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import UserData from './components/UserData';
import CreateBlog from './components/CreateBlog';
import EditBlog from './components/EditBlog';
import BlogPage from './components/BlogPage';
import BlogDetail from './components/BlogDetail';
import CreateUser from './components/CreateUser';

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/blogs" element={<BlogPage />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/blogs/:id/edit" element={<EditBlog />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user-data" element={<UserData />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/create-user" element={<CreateUser />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;