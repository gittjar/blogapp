import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Layout, Typography, Card, Row, Col, Button, Space } from 'antd';
import { 
  UserOutlined, 
  ReadOutlined, 
  LoginOutlined, 
  UserAddOutlined,
  ArrowRightOutlined 
} from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const MainPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        await axios.get('/blogs');
      } catch (err) {
        console.error('Failed to wake up server', err);
      }
    };

    wakeUpServer();
  }, []);

  const cards = [
    {
      title: 'Read Blogs',
      description: 'Explore our collection of blog posts. Discover stories, insights, and experiences shared by our community of writers.',
      icon: <ReadOutlined style={{ fontSize: '64px', color: '#667eea' }} />,
      path: '/blogs',
      buttonText: 'Browse Blogs',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Login',
      description: 'Access your account to create, edit, and manage your blog posts. Connect with the community and share your voice.',
      icon: <LoginOutlined style={{ fontSize: '64px', color: '#f093fb' }} />,
      path: '/login',
      buttonText: 'Sign In',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      title: 'Create Account',
      description: 'Join our blogging platform today! Sign up to start writing and sharing your own stories with the world.',
      icon: <UserAddOutlined style={{ fontSize: '64px', color: '#4facfe' }} />,
      path: '/create-user',
      buttonText: 'Get Started',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '20px 15px' }}>
        {/* Hero Section */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          padding: '40px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
        }}>
          <Title style={{ 
            color: 'white', 
            fontSize: 'clamp(2em, 5vw, 3.5em)', 
            marginBottom: '15px', 
            fontWeight: '700' 
          }}>
            Welcome to BlogApp
          </Title>
          <Paragraph style={{ 
            color: 'white', 
            fontSize: 'clamp(1em, 3vw, 1.3em)', 
            maxWidth: '700px', 
            margin: '0 auto', 
            lineHeight: '1.6',
            padding: '0 10px'
          }}>
            Your platform for sharing ideas, stories, and experiences.
            <br />
            Created by <strong>Jarno (@gittjar)</strong>
          </Paragraph>
        </div>

        {/* Main Action Cards */}
        <Row gutter={[16, 16]} justify="center" style={{ marginBottom: '40px' }}>
          {cards.map((card, index) => (
            <Col xs={24} sm={24} md={8} key={index}>
              <Card
                hoverable
                style={{ 
                  height: '100%',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: 'none',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                  transition: 'all 0.3s ease',
                }}
                styles={{ body: { padding: 0 } }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
                }}
              >
                {/* Card Header with Gradient */}
                <div style={{ 
                  background: card.gradient,
                  padding: '30px',
                  textAlign: 'center'
                }}>
                  {card.icon}
                </div>

                {/* Card Content */}
                <div style={{ padding: '20px' }}>
                  <Title level={3} style={{ marginBottom: '15px', color: '#1a1a1a', fontSize: 'clamp(1.2em, 4vw, 1.5em)' }}>
                    {card.title}
                  </Title>
                  <Paragraph style={{ 
                    fontSize: 'clamp(14px, 2.5vw, 15px)', 
                    color: '#666',
                    marginBottom: '20px',
                    minHeight: 'auto',
                    lineHeight: '1.6'
                  }}>
                    {card.description}
                  </Paragraph>
                  <Button
                    type="primary"
                    size="large"
                    block
                    icon={<ArrowRightOutlined />}
                    onClick={() => navigate(card.path)}
                    style={{
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: '600',
                      borderRadius: '8px',
                      background: card.gradient,
                      border: 'none',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    {card.buttonText}
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Features Section */}
        <Row gutter={[16, 16]} style={{ marginTop: '40px' }}>
          <Col xs={12} sm={12} md={6}>
            <Card 
              variant="borderless"
              style={{ textAlign: 'center', borderRadius: '12px', background: '#fff' }}
            >
              <Space direction="vertical" size="small">
                <UserOutlined style={{ fontSize: 'clamp(28px, 5vw, 36px)', color: '#667eea' }} />
                <Title level={4} style={{ margin: '10px 0 5px 0', fontSize: 'clamp(14px, 3vw, 16px)' }}>User Friendly</Title>
                <Paragraph style={{ margin: 0, color: '#666', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
                  Easy to use interface
                </Paragraph>
              </Space>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card 
              variant="borderless"
              style={{ textAlign: 'center', borderRadius: '12px', background: '#fff' }}
            >
              <Space direction="vertical" size="small">
                <ReadOutlined style={{ fontSize: 'clamp(28px, 5vw, 36px)', color: '#f093fb' }} />
                <Title level={4} style={{ margin: '10px 0 5px 0', fontSize: 'clamp(14px, 3vw, 16px)' }}>Rich Content</Title>
                <Paragraph style={{ margin: 0, color: '#666', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
                  Create engaging posts
                </Paragraph>
              </Space>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card 
              variant="borderless"
              style={{ textAlign: 'center', borderRadius: '12px', background: '#fff' }}
            >
              <Space direction="vertical" size="small">
                <UserAddOutlined style={{ fontSize: 'clamp(28px, 5vw, 36px)', color: '#4facfe' }} />
                <Title level={4} style={{ margin: '10px 0 5px 0', fontSize: 'clamp(14px, 3vw, 16px)' }}>Community</Title>
                <Paragraph style={{ margin: 0, color: '#666', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
                  Connect with writers
                </Paragraph>
              </Space>
            </Card>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <Card 
              variant="borderless"
              style={{ textAlign: 'center', borderRadius: '12px', background: '#fff' }}
            >
              <Space direction="vertical" size="small">
                <ArrowRightOutlined style={{ fontSize: 'clamp(28px, 5vw, 36px)', color: '#764ba2' }} />
                <Title level={4} style={{ margin: '10px 0 5px 0', fontSize: 'clamp(14px, 3vw, 16px)' }}>Get Started</Title>
                <Paragraph style={{ margin: 0, color: '#666', fontSize: 'clamp(12px, 2.5vw, 14px)' }}>
                  Start blogging today
                </Paragraph>
              </Space>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default MainPage;