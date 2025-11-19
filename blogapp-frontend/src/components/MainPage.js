import React, { useEffect } from 'react';
import axios from 'axios';
import { Layout, Typography, Card, Row, Col, Space, Divider } from 'antd';
import { UserOutlined, BookOutlined, RocketOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const MainPage = () => {
  useEffect(() => {
    const wakeUpServer = async () => {
      try {
        await axios.get('https://blogapp-backend-e23a.onrender.com/api/blogs');
      } catch (err) {
        console.error('Failed to wake up server', err);
      }
    };

    wakeUpServer();
  }, []);

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Content style={{ padding: '50px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <Title style={{ color: 'white', fontSize: '3em', marginBottom: '20px' }}>
            Welcome to Our Blog Platform
          </Title>
          <Paragraph style={{ color: 'white', fontSize: '1.2em', maxWidth: '600px', margin: '0 auto' }}>
            Created by Jarno (@gittjar) - A modern blogging experience for your company or personal brand
          </Paragraph>
        </div>

        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              style={{ height: '100%', textAlign: 'center' }}
              cover={
                <div style={{ padding: '40px', background: '#f0f2f5' }}>
                  <BookOutlined style={{ fontSize: '64px', color: '#667eea' }} />
                </div>
              }
            >
              <Card.Meta
                title={<Title level={3}>Share Your Stories</Title>}
                description={
                  <Paragraph>
                    Create and publish engaging blog posts. Share your thoughts, experiences, and knowledge with the world.
                  </Paragraph>
                }
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              style={{ height: '100%', textAlign: 'center' }}
              cover={
                <div style={{ padding: '40px', background: '#f0f2f5' }}>
                  <UserOutlined style={{ fontSize: '64px', color: '#764ba2' }} />
                </div>
              }
            >
              <Card.Meta
                title={<Title level={3}>Connect with Others</Title>}
                description={
                  <Paragraph>
                    Build your profile, follow other writers, and engage with a community of passionate bloggers.
                  </Paragraph>
                }
              />
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              style={{ height: '100%', textAlign: 'center' }}
              cover={
                <div style={{ padding: '40px', background: '#f0f2f5' }}>
                  <RocketOutlined style={{ fontSize: '64px', color: '#667eea' }} />
                </div>
              }
            >
              <Card.Meta
                title={<Title level={3}>Grow Your Audience</Title>}
                description={
                  <Paragraph>
                    Reach more readers and build your personal or company brand with our powerful blogging tools.
                  </Paragraph>
                }
              />
            </Card>
          </Col>
        </Row>

        <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.3)', margin: '50px 0' }} />

        <div style={{ textAlign: 'center' }}>
          <Space direction="vertical" size="large">
            <Title level={2} style={{ color: 'white' }}>
              Ready to Start Blogging?
            </Title>
            <Text style={{ color: 'white', fontSize: '1.1em' }}>
              Join our community today and start sharing your ideas with the world!
            </Text>
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default MainPage;