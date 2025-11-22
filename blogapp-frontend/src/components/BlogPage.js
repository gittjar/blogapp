import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Card, 
  Button, 
  Typography, 
  Space,
  Row,
  Col,
  Tag,
  Modal,
  message,
  Divider,
  Avatar,
  Tooltip,
  Empty
} from 'antd';
import { 
  LikeOutlined,
  DislikeOutlined,
  BookOutlined,
  DeleteOutlined,
  LinkOutlined,
  UserOutlined,
  HeartFilled,
  ExclamationCircleOutlined,
  ReadOutlined
} from '@ant-design/icons';
import Spinner from './Spinner';
import matrixImage from '../kuvat/matrix-4.jpeg';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true); 
  const userId = Number(localStorage.getItem('userId'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('https://blogapp-backend-e23a.onrender.com/api/blogs', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        });
        setBlogs(response.data);
      } catch (error) {
        console.error('Failed to fetch blogs', error);
        message.error('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleLikeChange = async (id, likes, increment, blogName) => {
    try {
      await axios.put(`https://blogapp-backend-e23a.onrender.com/api/blogs/${id}`, {
        likes: increment ? likes + 1 : Math.max(0, likes - 1),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      const response = await axios.get('https://blogapp-backend-e23a.onrender.com/api/blogs', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      setBlogs(response.data);
      message.success(`${increment ? '👍 Liked' : '👎 Disliked'} "${blogName}"`);
    } catch (error) {
      console.error('Failed to update likes', error);
      message.error('Failed to update likes');
    }
  };

  const addBlogToReadingList = async (blogId, blogName) => {
    if (!userId) {
      message.warning('Please log in first to add blog to list');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    try {
      await axios.post('https://blogapp-backend-e23a.onrender.com/api/reading-list', {
        blogId: blogId
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      message.success(`📚 "${blogName}" added to reading list`);
    } catch (error) {
      console.error('Failed to add blog to reading list', error);
      message.error('Failed to add blog to reading list');
    }
  };

  const handleDeleteClick = (blog) => {
    confirm({
      title: 'Delete Blog',
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete "${blog.title}"? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.delete(`https://blogapp-backend-e23a.onrender.com/api/blogs/${blog.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('userToken')}`,
            },
          });
          setBlogs(blogs.filter(b => b.id !== blog.id));
          message.success(`🗑️ "${blog.title}" deleted successfully`);
        } catch (error) {
          message.error('Failed to delete blog');
          console.error('Failed to delete blog', error);
        }
      },
    });
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%), url(${matrixImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <Content style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '40px',
            padding: '40px 20px',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}>
            <BookOutlined style={{ fontSize: '48px', color: '#667eea', marginBottom: '16px' }} />
            <Title level={1} style={{ margin: '0 0 8px 0', fontSize: 'clamp(2em, 5vw, 2.5em)' }}>
              Blog Posts
            </Title>
            <Text type="secondary" style={{ fontSize: 'clamp(14px, 3vw, 16px)' }}>
              Discover and explore articles from our community
            </Text>
          </div>

          {/* Blog Cards Grid */}
          {blogs.length === 0 ? (
            <Card style={{ textAlign: 'center', borderRadius: '16px' }}>
              <Empty
                description={
                  <span>
                    No blogs yet. <a href="/create-blog">Create the first one!</a>
                  </span>
                }
              />
            </Card>
          ) : (
            <Row gutter={[24, 24]}>
              {blogs.map((blog) => (
                <Col xs={24} sm={24} md={12} lg={8} key={blog.id}>
                  <Card
                    hoverable
                    style={{ 
                      height: '100%',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      background: 'rgba(255, 255, 255, 0.98)',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    styles={{ body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' } }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                    }}
                  >
                    {/* Header with gradient */}
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      padding: '20px',
                      color: 'white'
                    }}>
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Tag 
                            icon={<HeartFilled />} 
                            color="rgba(255, 255, 255, 0.2)"
                            style={{ 
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          >
                            {blog.likes} Likes
                          </Tag>
                        </div>
                        <Title 
                          level={4} 
                          style={{ 
                            color: 'white', 
                            margin: 0,
                            fontSize: 'clamp(1.1em, 3vw, 1.3em)',
                            lineHeight: '1.4'
                          }}
                        >
                          {blog.title}
                        </Title>
                      </Space>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Space direction="vertical" size="middle" style={{ width: '100%', flex: 1 }}>
                        {/* URL */}
                        {blog.url && (
                          <div>
                            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                              <LinkOutlined /> Link
                            </Text>
                            <Tooltip title={blog.url}>
                              <a 
                                href={blog.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ 
                                  fontSize: 'clamp(13px, 2.5vw, 14px)',
                                  color: '#667eea',
                                  wordBreak: 'break-all'
                                }}
                              >
                                {blog.url.length > 40 ? blog.url.substring(0, 40) + '...' : blog.url}
                              </a>
                            </Tooltip>
                          </div>
                        )}

                        {/* Author */}
                        <div>
                          <Space>
                            <Avatar 
                              icon={<UserOutlined />} 
                              style={{ backgroundColor: '#667eea' }}
                              size="small"
                            />
                            <Text strong style={{ fontSize: 'clamp(13px, 2.5vw, 14px)' }}>
                              {blog.username}
                            </Text>
                          </Space>
                        </div>

                        <Divider style={{ margin: '8px 0' }} />

                        {/* Actions */}
                        <Space 
                          direction="vertical" 
                          size="small" 
                          style={{ width: '100%' }}
                        >
                          <Button 
                            type="primary"
                            block
                            icon={<ReadOutlined />}
                            onClick={() => navigate(`/blogs/${blog.id}`)}
                            style={{ 
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              borderColor: 'transparent',
                              fontWeight: '600',
                              fontSize: 'clamp(13px, 2.5vw, 14px)'
                            }}
                            size="middle"
                          >
                            Read Full Blog
                          </Button>
                          
                          <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Space size="small">
                              <Tooltip title="Like this blog">
                                <Button 
                                  type="primary"
                                  icon={<LikeOutlined />}
                                  onClick={() => handleLikeChange(blog.id, blog.likes, true, blog.title)}
                                  style={{ 
                                    background: '#52c41a',
                                    borderColor: '#52c41a',
                                    fontSize: 'clamp(12px, 2vw, 14px)'
                                  }}
                                  size="small"
                                >
                                  Like
                                </Button>
                              </Tooltip>
                              <Tooltip title="Dislike this blog">
                                <Button 
                                  danger
                                  icon={<DislikeOutlined />}
                                  onClick={() => handleLikeChange(blog.id, blog.likes, false, blog.title)}
                                  style={{ fontSize: 'clamp(12px, 2vw, 14px)' }}
                                  size="small"
                                >
                                  Dislike
                                </Button>
                              </Tooltip>
                            </Space>
                          </Space>

                          <Button 
                            block
                            icon={<BookOutlined />}
                            onClick={() => addBlogToReadingList(blog.id, blog.title)}
                            style={{ 
                              borderColor: '#667eea',
                              color: '#667eea',
                              fontSize: 'clamp(12px, 2vw, 14px)'
                            }}
                            size="small"
                          >
                            Add to Reading List
                          </Button>

                          {/* Delete Button - Only for owner */}
                          {userId === blog.userid && (
                            <Button 
                              block
                              danger
                              type="primary"
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteClick(blog)}
                              style={{ fontSize: 'clamp(12px, 2vw, 14px)' }}
                              size="small"
                            >
                              Delete Blog
                            </Button>
                          )}
                        </Space>
                      </Space>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default BlogPage;