import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Layout, 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Alert, 
  Space,
  Divider 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  LoginOutlined,
  UserAddOutlined 
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleLogin = async (values) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.post('/login', {
        username: values.username,
        password: values.password,
      });
  
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userId', response.data.id);
      localStorage.setItem('username', response.data.username);
  
      navigate('/blogs');
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 401) {
        setError('Invalid username or password. Please try again.');
      } else if (error.response && error.response.status === 429) {
        setError('Too many login attempts. Please try again in 15 minutes.');
      } else {
        setError('Login failed. Please try again later.');
      }
      setLoading(false);
    }
  };

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    }}>
      <Content style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '20px'
      }}>
        <Card
          style={{
            maxWidth: '450px',
            width: '100%',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
          variant="borderless"
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
              <LoginOutlined style={{ fontSize: '48px', color: '#667eea', marginBottom: '16px' }} />
              <Title level={2} style={{ margin: '0 0 8px 0', color: '#1a1a1a' }}>
                Welcome Back
              </Title>
              <Text type="secondary" style={{ fontSize: '15px' }}>
                Sign in to your account to continue
              </Text>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                closable
                onClose={() => setError(null)}
              />
            )}

            {/* Login Form */}
            <Form
              form={form}
              name="login"
              onFinish={handleLogin}
              layout="vertical"
              size="large"
              autoComplete="off"
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: 'Please enter your username!' },
                  { min: 3, message: 'Username must be at least 3 characters' }
                ]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Enter your username"
                  autoComplete="username"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please enter your password!' },
                  { min: 4, message: 'Password must be at least 4 characters' }
                ]}
                style={{ marginBottom: '24px' }}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: '16px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  icon={<LoginOutlined />}
                  style={{
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Form.Item>
            </Form>

            <Divider style={{ margin: '8px 0' }}>OR</Divider>

            {/* Sign Up Link */}
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">
                Don't have an account?{' '}
              </Text>
              <Link to="/create-user">
                <Button 
                  type="link" 
                  icon={<UserAddOutlined />}
                  style={{ 
                    padding: '0 4px',
                    fontWeight: '600',
                    color: '#667eea'
                  }}
                >
                  Create Account
                </Button>
              </Link>
            </div>

            {/* Info Section */}
            <Card 
              size="small" 
              variant="borderless"
              style={{ 
                background: '#f6f8fb', 
                borderRadius: '8px',
                marginTop: '8px'
              }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Text strong style={{ color: '#667eea', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>
                  🔐 Secure Login
                </Text>
                <Paragraph style={{ margin: 0, fontSize: 'clamp(12px, 2.5vw, 13px)' }}>
                  Your credentials are encrypted and secure. We never share your personal information.
                </Paragraph>
              </Space>
            </Card>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default LoginPage;