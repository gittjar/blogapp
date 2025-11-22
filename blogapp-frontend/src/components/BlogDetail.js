import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Layout,
  Card,
  Typography,
  Space,
  Button,
  Tag,
  Divider,
  Spin,
  message,
  Avatar
} from 'antd';
import {
  ArrowLeftOutlined,
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
  CalendarOutlined,
  UserOutlined,
  LinkOutlined,
  TagOutlined
} from '@ant-design/icons';
import matrixImage from '../kuvat/matrix-1.jpeg';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`https://blogapp-backend-e23a.onrender.com/api/blogs/${id}`);
      setBlog(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch blog', error);
      message.error('Failed to load blog');
      setLoading(false);
    }
  };

  const handleLike = async () => {
    const userToken = localStorage.getItem('userToken');
    if (!userToken) {
      message.warning('Please login to like blogs');
      navigate('/login');
      return;
    }

    try {
      await axios.put(
        `https://blogapp-backend-e23a.onrender.com/api/blogs/${id}`,
        { likes: blog.likes + 1 },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setBlog({ ...blog, likes: blog.likes + 1 });
      setLiked(true);
      message.success('Blog liked!');
    } catch (error) {
      console.error('Failed to like blog', error);
      message.error('Failed to like blog');
    }
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" tip="Loading blog..." />
      </Layout>
    );
  }

  if (!blog) {
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card>
          <Text>Blog not found</Text>
          <br />
          <Button type="primary" onClick={() => navigate('/blogs')}>Back to Blogs</Button>
        </Card>
      </Layout>
    );
  }

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, rgba(102, 126, 234, 0.93) 0%, rgba(118, 75, 162, 0.93) 100%), url(${matrixImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <Content style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Back Button */}
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/blogs')}
            style={{
              marginBottom: '20px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              fontWeight: '600'
            }}
          >
            Back to Blogs
          </Button>

          {/* Main Blog Card */}
          <Card
            style={{
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              background: 'rgba(255, 255, 255, 0.98)',
            }}
            variant="borderless"
          >
            {/* Header Image */}
            {blog.image_url && (
              <div
                style={{
                  width: '100%',
                  height: '400px',
                  backgroundImage: `url(${blog.image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '12px',
                  marginBottom: '24px',
                }}
              />
            )}

            {/* Title and Meta Info */}
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={1} style={{ marginBottom: '16px', fontSize: 'clamp(1.5em, 5vw, 2.5em)' }}>
                  {blog.title}
                </Title>

                {/* Meta Information */}
                <Space size="middle" wrap>
                  <Space>
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#667eea' }} />
                    <Text strong>{blog.author}</Text>
                  </Space>

                  {blog.created_at && (
                    <Space>
                      <CalendarOutlined style={{ color: '#667eea' }} />
                      <Text type="secondary">
                        {new Date(blog.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </Text>
                    </Space>
                  )}

                  {blog.category && (
                    <Tag icon={<TagOutlined />} color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                      {blog.category}
                    </Tag>
                  )}
                </Space>

                {/* Stats */}
                <Space size="large" style={{ marginTop: '16px' }}>
                  <Space>
                    <HeartFilled style={{ color: '#ff4d4f', fontSize: '18px' }} />
                    <Text strong>{blog.likes || 0} likes</Text>
                  </Space>
                  {blog.views !== undefined && (
                    <Space>
                      <EyeOutlined style={{ color: '#667eea', fontSize: '18px' }} />
                      <Text strong>{blog.views || 0} views</Text>
                    </Space>
                  )}
                </Space>
              </div>

              <Divider />

              {/* Description */}
              {blog.description && (
                <div>
                  <Paragraph
                    style={{
                      fontSize: '18px',
                      fontStyle: 'italic',
                      color: '#595959',
                      background: '#f5f5f5',
                      padding: '16px',
                      borderRadius: '8px',
                      borderLeft: '4px solid #667eea',
                    }}
                  >
                    {blog.description}
                  </Paragraph>
                </div>
              )}

              {/* Content */}
              {blog.content && (
                <div>
                  <Paragraph
                    style={{
                      fontSize: '16px',
                      lineHeight: '1.8',
                      whiteSpace: 'pre-wrap',
                      color: '#262626',
                    }}
                  >
                    {blog.content}
                  </Paragraph>
                </div>
              )}

              {/* External URL */}
              {blog.url && (
                <div>
                  <Divider />
                  <Button
                    type="primary"
                    icon={<LinkOutlined />}
                    href={blog.url}
                    target="_blank"
                    size="large"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      height: '48px',
                      fontWeight: '600',
                    }}
                  >
                    Read Full Article
                  </Button>
                </div>
              )}

              <Divider />

              {/* Action Buttons */}
              <Space size="middle" wrap>
                <Button
                  type={liked ? 'default' : 'primary'}
                  icon={liked ? <HeartFilled /> : <HeartOutlined />}
                  onClick={handleLike}
                  disabled={liked}
                  size="large"
                  danger={liked}
                  style={{
                    fontWeight: '600',
                  }}
                >
                  {liked ? 'Liked' : 'Like this Blog'}
                </Button>

                <Button
                  size="large"
                  onClick={() => navigate('/blogs')}
                  style={{
                    fontWeight: '600',
                  }}
                >
                  Browse More Blogs
                </Button>
              </Space>
            </Space>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default BlogDetail;
