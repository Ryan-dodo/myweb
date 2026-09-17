import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Space } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import AuthCard from '../components/AuthCard';
import BackgroundGlow from '../components/BackgroundGlow';

const { Title, Text } = Typography;

const OurPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 可以在这里添加页面加载时的逻辑，比如检查登录状态
    // 示例：
    // const token = localStorage.getItem('token');
    // if (!token) {
    //   navigate('/login');
    // }
  }, [navigate]);

  const handleLogout = () => {
    // 清除本地存储的登录信息
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    // 跳转到登录页或首页
    navigate('/login');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoProfile = () => {
    navigate('/profile');
  };

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a'
    }}>
      {/* 背景发光效果 */}
      <BackgroundGlow />

      {/* 主内容卡片 */}
      <AuthCard
        title="我们的页面"
        extra={
          <Space>
            <Button
              type="text"
              icon={<HomeOutlined />}
              onClick={handleGoHome}
              style={{ color: '#fff' }}
            >
              首页
            </Button>
            <Button
              type="text"
              icon={<UserOutlined />}
              onClick={handleGoProfile}
              style={{ color: '#fff' }}
            >
              个人中心
            </Button>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              danger
            >
              退出登录
            </Button>
          </Space>
        }
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Title level={2} style={{ color: '#fff', marginBottom: 16 }}>
            欢迎来到我们的页面
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16 }}>
            这里可以展示团队介绍、项目信息或任何你想要的内容。
          </Text>

          <div style={{ marginTop: 40 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{
                padding: 20,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <Title level={4} style={{ color: '#fff' }}>关于我们</Title>
                <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
                  我们是一个充满激情的团队，致力于为用户提供最好的产品和服务。
                  我们相信技术创新的力量，并不断努力创造更好的用户体验。
                </Text>
              </div>

              <div style={{
                padding: 20,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <Title level={4} style={{ color: '#fff' }}>我们的使命</Title>
                <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
                  通过持续创新和卓越服务，为客户创造最大价值，
                  成为行业内最受信赖的合作伙伴。
                </Text>
              </div>
            </Space>
          </div>
        </div>
      </AuthCard>
    </div>
  );
};

export default OurPage;