import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Card, 
  Table, 
  Switch, 
  Button, 
  Typography, 
  Space,
  Tag,
  Tooltip,
  message,
  Descriptions,
  Popconfirm
} from 'antd';
import { 
  DeleteOutlined, 
  LinkOutlined,
  HeartOutlined,
  UserOutlined,
  CalendarOutlined,
  TagOutlined,
  ReadOutlined
} from '@ant-design/icons';
import matrixImage from '../kuvat/matrix-2.jpeg';

const { Content } = Layout;
const { Title, Text } = Typography;

const UserData = () => {
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState(null);
  const userId = Number(localStorage.getItem('userId'));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://blogapp-backend-e23a.onrender.com/api/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();
  }, []);

  const fetchUserData = async () => {
    if (userId) {
      try {
        const response = await axios.get(`https://blogapp-backend-e23a.onrender.com/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,

          },
          
        });
        console.log(response.data); 
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  if (!userData) {
    return <div>Loading... try log in or create new user?</div>;
  }

  const getUserName = (id) => {
    const user = users.find(user => user.id === id);
    return user ? user.name : 'Unknown';
  };

  const removeBlogFromReadingList = async (readingListId) => {
    try {
      await axios.delete(`https://blogapp-backend-e23a.onrender.com/api/reading-list/${readingListId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      message.success('Blog removed from reading list');
      fetchUserData();
    } catch (error) {
      console.error('Failed to remove blog from reading list', error);
      message.error('Failed to remove blog from reading list');
    }
  };

  const handleReadChange = async (readingListId, read) => {
    try {
      await axios.put(`https://blogapp-backend-e23a.onrender.com/api/reading-list/${readingListId}`, {
        read: !read
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      });
      message.success('Reading status updated');
      fetchUserData();
    } catch (error) {
      console.error('Failed to update reading status', error);
      message.error('Failed to update reading status');
    }
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <Space direction="vertical" size="small" style={{ maxWidth: '300px' }}>
          <Button 
            type="link" 
            onClick={() => navigate(`/blogs/${record.id}`)}
            style={{ 
              padding: 0, 
              height: 'auto',
              fontSize: '16px',
              fontWeight: 'bold',
              textAlign: 'left'
            }}
          >
            {text}
          </Button>
          {record.description && (
            <Text type="secondary" style={{ fontSize: '13px' }} ellipsis>
              {record.description.substring(0, 100)}...
            </Text>
          )}
          {record.category && (
            <Tag icon={<TagOutlined />} color="blue">{record.category}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      render: (text) => (
        <Space>
          <UserOutlined />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: 'Added By',
      dataIndex: 'userid',
      key: 'userid',
      render: (userid) => getUserName(userid),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => (
        date ? (
          <Space>
            <CalendarOutlined />
            <Text>{new Date(date).toLocaleDateString()}</Text>
          </Space>
        ) : null
      ),
    },
    {
      title: 'Link',
      dataIndex: 'url',
      key: 'url',
      render: (url) => (
        url ? (
          <Tooltip title={url}>
            <Button 
              type="link" 
              icon={<LinkOutlined />} 
              href={url} 
              target="_blank"
            >
              Visit
            </Button>
          </Tooltip>
        ) : <Text type="secondary">-</Text>
      ),
    },
    {
      title: 'Likes',
      dataIndex: 'likes',
      key: 'likes',
      align: 'center',
      render: (likes) => (
        <Space>
          <HeartOutlined style={{ color: '#ff4d4f' }} />
          <Text>{likes || 0}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'read',
      key: 'read',
      align: 'center',
      render: (read, record) => (
        <Switch
          checked={read}
          onChange={() => handleReadChange(record.readingListId, read)}
          checkedChildren="Read"
          unCheckedChildren="Unread"
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space direction="vertical" size="small">
          <Button 
            type="primary"
            icon={<ReadOutlined />}
            onClick={() => navigate(`/blogs/${record.id}`)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
            }}
          >
            Continue Reading
          </Button>
          <Popconfirm
            title="Remove from reading list"
            description="Are you sure you want to remove this blog?"
            onConfirm={() => removeBlogFromReadingList(record.readingListId)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} block>
              Remove
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, rgba(102, 126, 234, 0.92) 0%, rgba(118, 75, 162, 0.92) 100%), url(${matrixImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <Content style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* User Profile Card */}
            <Card
              title={
                <Title level={2} style={{ margin: 0, color: '#667eea' }}>
                  <UserOutlined /> My Profile
                </Title>
              }
              style={{
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              }}
            >
              <Descriptions bordered column={{ xs: 1, sm: 1, md: 3 }}>
                <Descriptions.Item label="Name" span={1}>
                  <Text strong>{userData.name}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Username" span={1}>
                  <Text>{userData.username}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Member Since" span={1}>
                  <Space>
                    <CalendarOutlined />
                    {userData.created_at ? new Date(userData.created_at).toLocaleDateString() : 'N/A'}
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            {/* Reading List Card */}
            <Card
              title={
                <Title level={2} style={{ margin: 0, color: '#667eea' }}>
                  📚 My Reading List ({userData.readings?.length || 0})
                </Title>
              }
              style={{
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
              }}
            >
              <Table
                columns={columns}
                dataSource={userData.readings || []}
                rowKey={(record) => record.readingListId}
                pagination={{ 
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} items`
                }}
                scroll={{ x: 1200 }}
                locale={{
                  emptyText: 'No blogs in your reading list yet'
                }}
              />
            </Card>
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default UserData;