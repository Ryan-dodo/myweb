import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Space } from 'antd';
import { UserOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import AuthCard from '../components/AuthCard';
import BackgroundGlow from '../components/BackgroundGlow';
import './loginedpage.css';   // ← 加上这行有内容

const { Title, Text } = Typography;

function LoginedPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/');
    }
  }, [navigate]);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <div className="logined-page">
      <BackgroundGlow />

      <AuthCard>
        <div className="logined-content">
          {/* 头像区域 */}
          <div className="avatar-wrapper">
            <div className="avatar">
              <UserOutlined style={{ fontSize: 48, color: '#fff' }} />
            </div>
          </div>

          {/* 欢迎信息 */}
          <Title level={3} style={{ color: '#fff', marginBottom: 8 }}>
            登录成功！
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16 }}>
            欢迎回来，{userInfo.username}
          </Text>

          {/* 用户信息卡片 */}
          <div className="info-card">
            <div className="info-item">
              <Text style={{ color: 'rgba(255,255,255,0.5)' }}>用户名</Text>
              <Text style={{ color: '#fff', fontWeight: 500 }}>{userInfo.username}</Text>
            </div>
            <div className="info-item">
              <Text style={{ color: 'rgba(255,255,255,0.5)' }}>邀请码</Text>
              <Text style={{ color: '#fff', fontWeight: 500 }}>{userInfo.invite_code || '暂无'}</Text>
            </div>
            <div className="info-item">
              <Text style={{ color: 'rgba(255,255,255,0.5)' }}>用户ID</Text>
              <Text style={{ color: '#fff', fontWeight: 500 }}>{userInfo.id}</Text>
            </div>
          </div>

          {/* 操作按钮 */}
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Button
              type="primary"
              size="large"
              block
              icon={<HomeOutlined />}
              onClick={() => {
                const pageMap = {
                  'A001': '/guide',
                  'B002': '/page-b',
                  'C003': '/page-c',
                };
                const code = userInfo.invite_code || '';
                const target = pageMap[code] || '/';
                navigate(target);
              }}
              className="action-button"
            >
              进入首页
            </Button>
            <Button
              size="large"
              block
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="action-button logout"
            >
              退出登录
            </Button>
          </Space>
        </div>
      </AuthCard>
    </div>
  );
}

export default LoginedPage;