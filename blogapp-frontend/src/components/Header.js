import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Space, Typography } from 'antd';
import { 
  HomeOutlined, 
  ReadOutlined, 
  UserAddOutlined, 
  UserOutlined, 
  EditOutlined, 
  LoginOutlined,
  LogoutOutlined 
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const [userData, setUserData] = useState(null);
  const userId = Number(localStorage.getItem('userId'));
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    setUserData(null);
    navigate('/');
  };

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: 'blogs',
      icon: <ReadOutlined />,
      label: <Link to="/blogs">Blogs</Link>,
    },
    {
      key: 'create-user',
      icon: <UserAddOutlined />,
      label: <Link to="/create-user">Create User</Link>,
    },
    ...(userData
      ? [
          {
            key: 'user-data',
            icon: <UserOutlined />,
            label: <Link to="/user-data">User Data</Link>,
          },
          {
            key: 'create-blog',
            icon: <EditOutlined />,
            label: <Link to="/create-blog">Create Blog</Link>,
          },
        ]
      : [
          {
            key: 'login',
            icon: <LoginOutlined />,
            label: <Link to="/login">Login</Link>,
          },
        ]),
  ];

  return (
    <AntHeader style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      background: '#001529',
      padding: '0 50px'
    }}>
      <Menu
        theme="dark"
        mode="horizontal"
        items={menuItems}
        style={{ flex: 1, minWidth: 0 }}
      />
      {userData && (
        <Space>
          <Text style={{ color: 'white' }}>
            Hello, {userData.username}!
          </Text>
          <Button 
            type="primary" 
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Space>
      )}
    </AntHeader>
  );
};

export default Header;