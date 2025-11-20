import React, { useEffect, useState } from 'react';
import { Spin, Card, Progress, Space, Typography, Timeline, Alert } from 'antd';
import { 
  LoadingOutlined, 
  DatabaseOutlined, 
  CloudServerOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  SyncOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const Spinner = () => {
  const [message, setMessage] = useState('Connecting to database...');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Establishing connection', icon: <CloudServerOutlined />, duration: 5000 },
    { title: 'Authenticating request', icon: <ThunderboltOutlined />, duration: 8000 },
    { title: 'Fetching data', icon: <DatabaseOutlined />, duration: 15000 },
    { title: 'Processing results', icon: <SyncOutlined />, duration: 20000 },
  ];

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 1;
      });
    }, 300);

    // Step progression
    const stepTimers = steps.map((step, index) => 
      setTimeout(() => {
        setCurrentStep(index);
        setMessage(step.title);
      }, step.duration)
    );

    // Patient message after 10 seconds
    const messageTimer = setTimeout(() => {
      setMessage('Almost there! Our database is warming up...');
    }, 10000);

    return () => {
      clearInterval(progressInterval);
      stepTimers.forEach(timer => clearTimeout(timer));
      clearTimeout(messageTimer);
    };
  }, []);

  const customSpinner = <LoadingOutlined style={{ fontSize: 48, color: '#667eea' }} spin />;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '70vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px 15px'
    }}>
      <Card
        style={{
          maxWidth: 600,
          width: '100%',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}
        variant="borderless"
      >
        <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
          {/* Main Spinner */}
          <Spin indicator={customSpinner} size="large" />
          
          {/* Title */}
          <Title level={3} style={{ margin: 0, color: '#667eea', fontSize: 'clamp(1.2em, 4vw, 1.5em)' }}>
            <DatabaseOutlined /> Loading Your Blogs
          </Title>

          {/* Current Message */}
          <Alert
            message={message}
            type="info"
            showIcon
            style={{ borderRadius: '8px', fontSize: 'clamp(12px, 2.5vw, 14px)' }}
          />

          {/* Progress Bar */}
          <div>
            <Progress 
              percent={progress} 
              status="active"
              strokeColor={{
                '0%': '#667eea',
                '100%': '#764ba2',
              }}
            />
            <Text type="secondary" style={{ fontSize: 'clamp(11px, 2vw, 12px)' }}>
              {progress < 95 ? 'Loading...' : 'Finalizing...'}
            </Text>
          </div>

          {/* Timeline */}
          <Timeline
            style={{ textAlign: 'left', marginTop: '20px' }}
            items={steps.map((step, index) => ({
              dot: index < currentStep 
                ? <CheckCircleOutlined style={{ fontSize: '16px', color: '#52c41a' }} />
                : index === currentStep
                ? <SyncOutlined spin style={{ fontSize: '16px', color: '#667eea' }} />
                : step.icon,
              color: index < currentStep ? 'green' : index === currentStep ? 'blue' : 'gray',
              children: (
                <Text 
                  style={{ 
                    fontWeight: index === currentStep ? 'bold' : 'normal',
                    color: index <= currentStep ? '#000' : '#999',
                    fontSize: 'clamp(13px, 2.5vw, 14px)'
                  }}
                >
                  {step.title}
                </Text>
              ),
            }))}
          />

          {/* Information */}
          <Card 
            size="small" 
            variant="borderless"
            style={{ 
              background: '#f6f8fb', 
              borderRadius: '8px'
            }}
          >
            <Space direction="vertical" size="small">
              <Text strong style={{ color: '#667eea', fontSize: 'clamp(13px, 2.5vw, 14px)' }}>
                💡 Did you know?
              </Text>
              <Paragraph style={{ margin: 0, fontSize: 'clamp(12px, 2.5vw, 13px)' }}>
                Our database is hosted on a free-tier cloud service. 
                It may take <strong>30-50 seconds</strong> to wake up from sleep mode. 
                Thank you for your patience! ☕
              </Paragraph>
            </Space>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default Spinner;