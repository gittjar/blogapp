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
  const [readingListBlogs, setReadingListBlogs] = useState(new Map()); // Map of blogId -> readingListId
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
        
        // Check which blogs are in reading list
        if (userId && response.data.length > 0) {
          const blogIds = response.data.map(blog => blog.id).join(',');
          try {
            const readingListResponse = await axios.get(
              `https://blogapp-backend-e23a.onrender.com/api/reading-list/check?blogIds=${blogIds}`,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('userToken')}`,
                },
              }
            );
            const readingMap = new Map();
            readingListResponse.data.forEach(item => {
              readingMap.set(item.blog_id, item.reading_list_id);
            });
            setReadingListBlogs(readingMap);
          } catch (error) {
            console.error('Failed to check reading list', error);
          }
        }
      } catch (error) {
        console.error('Failed to fetch blogs', error);
        message.error('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [userId]);

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
      
      // Update local state to show it's in reading list
      setReadingListBlogs(new Map(readingListBlogs.set(blogId, true)));
      
      message.success(`📚 "${blogName}" added to reading list`);
    } catch (error) {
      console.error('Failed to add blog to reading list', error);
      if (error.response?.status === 409) {
        message.warning(error.response.data.message || 'Kyseinen blogi on jo lukulistallasi');
      } else {
        message.error('Failed to add blog to reading list');
      }
    }
  };

  const removeBlogFromReadingList = async (blogId, blogName) => {
    try {
      await axios.delete(`https://blogapp-backend-e23a.onrender.com/api/reading-list/blog/${blogId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      
      // Update local state to remove from reading list
      const newMap = new Map(readingListBlogs);
      newMap.delete(blogId);
      setReadingListBlogs(newMap);
      
      message.success(`🗑️ "${blogName}" removed from reading list`);
    } catch (error) {
      console.error('Failed to remove blog from reading list', error);
      message.error('Failed to remove blog from reading list');
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
                    cover={
                      <div style={{ 
                        height: '200px', 
                        overflow: 'hidden',
                        position: 'relative',
                        background: blog.image_url 
                          ? `url(${blog.image_url})` 
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}>
                        {/* Overlay with stats */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          padding: '16px',
                          background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 100%)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}>
                          <Space size="small">
                            <Tag icon={<HeartFilled />} color="rgba(255,255,255,0.9)" style={{ color: '#ff4d4f', fontWeight: 'bold', border: 'none' }}>
                              {blog.likes}
                            </Tag>
                            {blog.views !== null && blog.views !== undefined && (
                              <Tag color="rgba(255,255,255,0.9)" style={{ color: '#1890ff', fontWeight: 'bold', border: 'none' }}>
                                👁️ {blog.views}
                              </Tag>
                            )}
                          </Space>
                          {blog.category && (
                            <Tag color="gold" style={{ fontWeight: 'bold' }}>
                              {blog.category}
                            </Tag>
                          )}
                        </div>
                        {/* Title overlay at bottom */}
                        {!blog.image_url && (
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '20px',
                            background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 100%)'
                          }}>
                            <Title level={4} style={{ color: 'white', margin: 0, fontSize: 'clamp(1em, 3vw, 1.2em)' }}>
                              {blog.title}
                            </Title>
                          </div>
                        )}
                      </div>
                    }
                    style={{ 
                      height: '100%',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: 'white',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    styles={{ body: { padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 } }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                    }}
                  >
                    {/* Card Content */}
                    <Space direction="vertical" size="middle" style={{ width: '100%', flex: 1 }}>
                      {/* Title (only if image exists) */}
                      {blog.image_url && (
                        <Title level={4} style={{ margin: 0, fontSize: 'clamp(1em, 3vw, 1.2em)', color: '#262626' }}>
                          {blog.title}
                        </Title>
                      )}
                      
                      {/* Description */}
                      {blog.description && (
                        <Paragraph 
                          ellipsis={{ rows: 2 }} 
                          style={{ margin: 0, color: '#595959', fontSize: '14px' }}
                        >
                          {blog.description}
                        </Paragraph>
                      )}

                      {/* Author */}
                      <Space size="small">
                        <Avatar icon={<UserOutlined />} size="small" style={{ backgroundColor: '#667eea' }} />
                        <Text strong style={{ fontSize: '13px', color: '#595959' }}>
                          {blog.username}
                        </Text>
                      </Space>

                      <Divider style={{ margin: '8px 0' }} />

                      {/* Action Buttons - Clean Button Group */}
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Button 
                          type="primary"
                          block
                          size="large"
                          icon={<ReadOutlined />}
                          onClick={() => navigate(`/blogs/${blog.id}`)}
                          style={{ 
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                            fontWeight: '600',
                            height: '40px'
                          }}
                        >
                          Read Blog
                        </Button>
                        
                        <Space.Compact block>
                          <Button 
                            icon={<LikeOutlined />}
                            onClick={() => handleLikeChange(blog.id, blog.likes, true, blog.title)}
                            style={{ flex: 1, color: '#52c41a', borderColor: '#52c41a' }}
                          >
                            Like
                          </Button>
                          <Button 
                            icon={<DislikeOutlined />}
                            onClick={() => handleLikeChange(blog.id, blog.likes, false, blog.title)}
                            danger
                            style={{ flex: 1 }}
                          >
                            Dislike
                          </Button>
                        </Space.Compact>

                        {readingListBlogs.has(blog.id) ? (
                          <Button 
                            block
                            icon={<BookOutlined />}
                            onClick={() => removeBlogFromReadingList(blog.id, blog.title)}
                            style={{ 
                              background: '#52c41a',
                              borderColor: '#52c41a',
                              color: 'white',
                              fontWeight: '600'
                            }}
                          >
                            ✓ In Reading List
                          </Button>
                        ) : (
                          <Button 
                            block
                            icon={<BookOutlined />}
                            onClick={() => addBlogToReadingList(blog.id, blog.title)}
                          >
                            Add to Reading List
                          </Button>
                        )}

                        {userId === blog.userid && (
                          <Button 
                            block
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteClick(blog)}
                          >
                            Delete Blog
                          </Button>
                        )}
                      </Space>
                    </Space>
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