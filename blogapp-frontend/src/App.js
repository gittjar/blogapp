import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import BlogPage from './components/BlogPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/blogs" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/blogs" element={<BlogPage />} />
      </Routes>
    </Router>
  );
}

export default App;