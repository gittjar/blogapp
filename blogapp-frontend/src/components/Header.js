import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Space, Typography, Drawer } from 'antd';
import { 
  HomeOutlined, 
  ReadOutlined, 
  UserAddOutlined, 
  UserOutlined, 
  EditOutlined, 
  LoginOutlined,
  LogoutOutlined,
  MenuOutlined
} from '@ant-design/icons';
import '../styles/Header.css';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

const Header = () => {
  const [userData, setUserData] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
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
    setDrawerVisible(false);
    navigate('/');
  };

  const handleMenuClick = () => {
    setDrawerVisible(false);
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
    <>
      <AntHeader style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: '#001529',
        padding: '0 20px'
      }}>
        {/* Logo/Title */}
        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
          BlogApp
        </div>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ flex: 1, marginLeft: '20px' }}>
          <Menu
            theme="dark"
            mode="horizontal"
            items={menuItems}
            style={{ 
              flex: 1, 
              minWidth: 0,
              border: 'none'
            }}
          />
        </div>

        {/* Desktop User Info */}
        <div className="desktop-user">
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
        </div>

        {/* Mobile Hamburger Menu */}
        <Button
          className="mobile-menu-button"
          type="text"
          icon={<MenuOutlined style={{ fontSize: '20px', color: 'white' }} />}
          onClick={() => setDrawerVisible(true)}
          style={{ 
            marginLeft: 'auto',
            padding: '4px 11px',
            height: 'auto'
          }}
        />
      </AntHeader>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        styles={{ body: { padding: 0 } }}
      >
        {userData && (
          <div style={{ padding: '16px', background: '#f0f2f5', borderBottom: '1px solid #d9d9d9' }}>
            <Text strong>Hello, {userData.username}!</Text>
          </div>
        )}
        <Menu
          mode="vertical"
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: 'none' }}
        />
        {userData && (
          <div style={{ padding: '16px' }}>
            <Button 
              type="primary" 
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              block
            >
              Logout
            </Button>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default Header;