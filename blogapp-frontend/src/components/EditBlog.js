import React, { useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Layout, 
  Card, 
  Form, 
  Input, 
  Button, 
  Typography, 
  Space,
  Select,
  message,
  Spin
} from 'antd';
import { 
  EditOutlined, 
  LinkOutlined,
  FileTextOutlined,
  TagsOutlined,
  PictureOutlined,
  UserOutlined,
  SaveOutlined
} from '@ant-design/icons';
import matrixImage from '../kuvat/matrix-5.jpeg';

const { Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditBlog = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchingBlog, setFetchingBlog] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(`/blogs/${id}`);
      const blog = response.data;
      
      // Check if user is the owner
      if (blog.userid !== parseInt(userId)) {
        message.error('You can only edit your own blogs');
        navigate('/blogs');
        return;
      }
      
      // Set form values
      form.setFieldsValue({
        author: blog.author,
        title: blog.title,
        description: blog.description || '',
        content: blog.content || '',
        url: blog.url || '',
        image_url: blog.image_url || '',
        category: blog.category || undefined,
      });
      
      setFetchingBlog(false);
    } catch (error) {
      console.error('Failed to fetch blog', error);
      message.error('Failed to load blog');
      navigate('/blogs');
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    const updatedBlog = {
      author: values.author,
      title: values.title,
      description: values.description,
      content: values.content,
      url: values.url,
      image_url: values.image_url,
      category: values.category,
    };

    const userToken = localStorage.getItem('userToken');

    try {
      const response = await axios.put(
        `/blogs/${id}`,
        updatedBlog
      );

      if (response.status === 200) {
        message.success('✅ Blog updated successfully!');
        setTimeout(() => {
          navigate(`/blogs/${id}`);
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to update blog', error);
      message.error('Failed to update blog. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!userId) {
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card>
          <Text style={{ fontSize: '1.2rem' }}>
            Please <Link to="/login">log in</Link> to edit blogs.
          </Text>
        </Card>
      </Layout>
    );
  }

  if (fetchingBlog) {
    return (
      <Layout style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" tip="Loading blog..." />
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
            <div style={{ textAlign: 'center' }}>
              <EditOutlined style={{ fontSize: '48px', color: '#667eea', marginBottom: '16px' }} />
              <Title level={2} style={{ margin: '0 0 8px 0', fontSize: 'clamp(1.5em, 4vw, 2em)' }}>
                Edit Blog Post
              </Title>
              <Text type="secondary" style={{ fontSize: 'clamp(14px, 2.5vw, 15px)' }}>
                Update your blog content
              </Text>
            </div>

            <Form
              form={form}
              name="editBlog"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
              autoComplete="off"
            >
              <Form.Item
                label="Author Name"
                name="author"
                rules={[{ required: true, message: 'Please enter author name!' }]}
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
                  { min: 5, message: 'Title must be at least 5 characters' }
                ]}
              >
                <Input 
                  prefix={<FileTextOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Enter an engaging title"
                />
              </Form.Item>

              <Form.Item label="Short Description" name="description">
                <TextArea rows={2} placeholder="A brief summary (optional)" showCount maxLength={500} />
              </Form.Item>

              <Form.Item label="Content" name="content">
                <TextArea rows={8} placeholder="Write your blog content here... (optional)" showCount />
              </Form.Item>

              <Form.Item label="URL" name="url" rules={[{ type: 'url', message: 'Please enter a valid URL!' }]}>
                <Input prefix={<LinkOutlined style={{ color: '#bfbfbf' }} />} placeholder="https://example.com (optional)" />
              </Form.Item>

              <Form.Item label="Image URL" name="image_url" rules={[{ type: 'url', message: 'Please enter a valid image URL!' }]}>
                <Input prefix={<PictureOutlined style={{ color: '#bfbfbf' }} />} placeholder="https://example.com/image.jpg (optional)" />
              </Form.Item>

              <Form.Item label="Category" name="category">
                <Select placeholder="Select a category (optional)" suffixIcon={<TagsOutlined />} allowClear>
                  <Option value="Technology">Technology</Option>
                  <Option value="Programming">Programming</Option>
                  <Option value="Design">Design</Option>
                  <Option value="Business">Business</Option>
                  <Option value="Lifestyle">Lifestyle</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Space style={{ width: '100%' }} direction="vertical" size="middle">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    icon={<SaveOutlined />}
                    style={{
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: '600',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      borderRadius: '8px',
                    }}
                  >
                    {loading ? 'Saving Changes...' : 'Save Changes'}
                  </Button>
                  
                  <Button
                    block
                    onClick={() => navigate(`/blogs/${id}`)}
                    style={{
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: '600',
                    }}
                  >
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default EditBlog;
