import React, { useState } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { 
  Layout, 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Space,
  Select,
  message
} from 'antd';
import { 
  EditOutlined, 
  LinkOutlined,
  FileTextOutlined,
  TagsOutlined,
  PictureOutlined,
  UserOutlined
} from '@ant-design/icons';
import matrixImage from '../kuvat/matrix-5.jpeg';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateBlog = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleSubmit = async (values) => {
    setLoading(true);

    const blog = {
      author: values.author,
      title: values.title,
      description: values.description,
      content: values.content,
      url: values.url,
      image_url: values.image_url,
      category: values.category,
      likes: 0,
    };

    const userToken = localStorage.getItem('userToken');

    try {
      const response = await axios.post('https://blogapp-backend-e23a.onrender.com/api/blogs', blog, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (response.status === 201) {
        message.success('🎉 Blog created successfully!');
        form.resetFields();
        setTimeout(() => {
          navigate('/blogs');
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to add blog', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      const errorMsg = error.response?.data || 'Failed to create blog. Please try again.';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card>
          <Text style={{ fontSize: '1.2rem' }}>
            Please <a href="/login">log in</a> to create a blog.
          </Text>
        </Card>
      </Layout>
    );
  }

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
        padding: '40px 20px'
      }}>
        <Card
          style={{
            maxWidth: '800px',
            width: '100%',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            background: 'rgba(255, 255, 255, 0.98)'
          }}
          variant="borderless"
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
              <EditOutlined style={{ fontSize: '48px', color: '#667eea', marginBottom: '16px' }} />
              <Title level={2} style={{ margin: '0 0 8px 0', fontSize: 'clamp(1.5em, 4vw, 2em)' }}>
                Create New Blog Post
              </Title>
              <Text type="secondary" style={{ fontSize: 'clamp(14px, 2.5vw, 15px)' }}>
                Share your thoughts with the world
              </Text>
            </div>

            {/* Form */}
            <Form
              form={form}
              name="createBlog"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              autoComplete="off"
            >
              <Form.Item
                label="Author Name"
                name="author"
                rules={[
                  { required: true, message: 'Please enter author name!' },
                ]}
              >
                <Input 
                  prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Your name or pen name"
                />
              </Form.Item>

              <Form.Item
                label="Title"
                name="title"
                rules={[
                  { required: true, message: 'Please enter blog title!' },
                  { min: 5, message: 'Title must be at least 5 characters' },
                  { max: 255, message: 'Title is too long' }
                ]}
              >
                <Input 
                  prefix={<FileTextOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Enter an engaging title"
                />
              </Form.Item>

              <Form.Item
                label="Short Description"
                name="description"
                rules={[
                  { max: 500, message: 'Description is too long' }
                ]}
              >
                <TextArea
                  rows={2}
                  placeholder="A brief summary of your blog post (optional)"
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              <Form.Item
                label="Content"
                name="content"
                rules={[
                  { min: 10, message: 'Content should be at least 10 characters' }
                ]}
              >
                <TextArea
                  rows={8}
                  placeholder="Write your blog content here... (optional)"
                  showCount
                />
              </Form.Item>

              <Form.Item
                label="URL"
                name="url"
                rules={[
                  { type: 'url', message: 'Please enter a valid URL!' }
                ]}
              >
                <Input 
                  prefix={<LinkOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="https://example.com/your-article (optional)"
                />
              </Form.Item>

              <Form.Item
                label="Image URL"
                name="image_url"
                rules={[
                  { type: 'url', message: 'Please enter a valid image URL!' }
                ]}
              >
                <Input 
                  prefix={<PictureOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="https://example.com/image.jpg (optional)"
                />
              </Form.Item>

              <Form.Item
                label="Category"
                name="category"
              >
                <Select
                  placeholder="Select a category (optional)"
                  suffixIcon={<TagsOutlined />}
                  allowClear
                >
                  <Option value="Technology">Technology</Option>
                  <Option value="Programming">Programming</Option>
                  <Option value="Design">Design</Option>
                  <Option value="Business">Business</Option>
                  <Option value="Lifestyle">Lifestyle</Option>
                  <Option value="Education">Education</Option>
                  <Option value="Science">Science</Option>
                  <Option value="Health">Health</Option>
                  <Option value="Travel">Travel</Option>
                  <Option value="Food">Food</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  icon={<EditOutlined />}
                  style={{
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                >
                  {loading ? 'Creating Blog...' : 'Publish Blog'}
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};


export default CreateBlog;