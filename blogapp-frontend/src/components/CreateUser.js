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
  Divider,
  Row,
  Col,
  message
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  UserAddOutlined,
  LoginOutlined,
  SafetyOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import matrixImage from '../kuvat/matrix-3.jpeg';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const CreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/users', {
        name: values.name,
        username: values.username,
        password: values.password,
      });

      if (response.status === 201) {
        setSuccess(true);
        message.success('Account created successfully! Redirecting to login...');
        form.resetFields();
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to add user', error);
      if (error.response && error.response.status === 429) {
        setError('Too many registration attempts. Please try again in an hour.');
      } else if (error.response && error.response.status === 409) {
        setError('Username already exists. Please choose a different username.');
      } else {
        setError(error.response?.data?.error || 'Failed to create account. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%), url(${matrixImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <Content style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '40px 20px',
        minHeight: '100vh'
      }}>
        <Row gutter={[32, 32]} style={{ maxWidth: '1200px', width: '100%' }} align="middle">
          {/* Left side - Info Card (hidden on mobile) */}
          <Col xs={0} md={12}>
            <Card
              variant="borderless"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                height: '100%'
              }}
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <UserAddOutlined style={{ fontSize: '64px', color: '#667eea', marginBottom: '16px' }} />
                  <Title level={2} style={{ margin: '0 0 16px 0' }}>
                    Join Our Community
                  </Title>
                  <Paragraph style={{ fontSize: '16px', color: '#666' }}>
                    Create your account and start sharing your stories with the world. 
                    Connect with other writers and build your audience.
                  </Paragraph>
                </div>

                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginTop: '4px' }} />
                    <div>
                      <Text strong style={{ fontSize: '16px', display: 'block' }}>Free Forever</Text>
                      <Text type="secondary">No credit card required</Text>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginTop: '4px' }} />
                    <div>
                      <Text strong style={{ fontSize: '16px', display: 'block' }}>Create & Share</Text>
                      <Text type="secondary">Write unlimited blog posts</Text>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginTop: '4px' }} />
                    <div>
                      <Text strong style={{ fontSize: '16px', display: 'block' }}>Community</Text>
                      <Text type="secondary">Connect with other writers</Text>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a', marginTop: '4px' }} />
                    <div>
                      <Text strong style={{ fontSize: '16px', display: 'block' }}>Secure</Text>
                      <Text type="secondary">Your data is safe with us</Text>
                    </div>
                  </div>
                </Space>
              </Space>
            </Card>
          </Col>

          {/* Right side - Sign Up Form */}
          <Col xs={24} md={12}>
            <Card
              style={{
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                background: 'rgba(255, 255, 255, 0.98)'
              }}
              variant="borderless"
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                {/* Header */}
                <div style={{ textAlign: 'center' }}>
                  <UserAddOutlined style={{ fontSize: '48px', color: '#667eea', marginBottom: '16px' }} />
                  <Title level={2} style={{ margin: '0 0 8px 0', color: '#1a1a1a' }}>
                    Create Account
                  </Title>
                  <Text type="secondary" style={{ fontSize: '15px' }}>
                    Fill in your details to get started
                  </Text>
                </div>

                {/* Success Alert */}
                {success && (
                  <Alert
                    message="Success!"
                    description="Your account has been created successfully. Redirecting to login..."
                    type="success"
                    showIcon
                    icon={<CheckCircleOutlined />}
                  />
                )}

                {/* Error Alert */}
                {error && (
                  <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setError(null)}
                  />
                )}

                {/* Sign Up Form */}
                <Form
                  form={form}
                  name="createUser"
                  onFinish={handleSubmit}
                  layout="vertical"
                  size="large"
                  autoComplete="off"
                  disabled={success}
                >
                  <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[
                      { required: true, message: 'Please enter your name!' },
                      { min: 2, message: 'Name must be at least 2 characters' },
                      { max: 50, message: 'Name is too long' }
                    ]}
                  >
                    <Input 
                      prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      { required: true, message: 'Please enter a username!' },
                      { min: 3, message: 'Username must be at least 3 characters' },
                      { max: 20, message: 'Username is too long' },
                      { pattern: /^[a-zA-Z0-9_]+$/, message: 'Only letters, numbers, and underscores allowed' }
                    ]}
                  >
                    <Input 
                      prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="Choose a unique username"
                      autoComplete="username"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      { required: true, message: 'Please enter a password!' },
                      { min: 4, message: 'Password must be at least 4 characters' },
                      { max: 50, message: 'Password is too long' }
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                      { required: true, message: 'Please confirm your password!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Passwords do not match!'));
                        },
                      }),
                    ]}
                    style={{ marginBottom: '24px' }}
                  >
                    <Input.Password
                      prefix={<SafetyOutlined style={{ color: '#bfbfbf' }} />}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                    />
                  </Form.Item>

                  <Form.Item style={{ marginBottom: '16px' }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      icon={<UserAddOutlined />}
                      style={{
                        height: '48px',
                        fontSize: '16px',
                        fontWeight: '600',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </Form.Item>
                </Form>

                <Divider style={{ margin: '8px 0' }}>OR</Divider>

                {/* Login Link */}
                <div style={{ textAlign: 'center' }}>
                  <Text type="secondary">
                    Already have an account?{' '}
                  </Text>
                  <Link to="/login">
                    <Button 
                      type="link" 
                      icon={<LoginOutlined />}
                      style={{ 
                        padding: '0 4px',
                        fontWeight: '600',
                        color: '#667eea'
                      }}
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>

                {/* Security Notice */}
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
                      🔒 Privacy & Security
                    </Text>
                    <Paragraph style={{ margin: 0, fontSize: 'clamp(12px, 2.5vw, 13px)' }}>
                      We take your privacy seriously. Your password is encrypted and your data is secure.
                    </Paragraph>
                  </Space>
                </Card>
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default CreateUser;