import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Space, Tag } from 'antd';
import {
  HomeOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import AuthCard from '../components/AuthCard';
import BackgroundGlow from '../components/BackgroundGlow';
import './OurPage.css';

const { Title, Text, Paragraph } = Typography;

function OurPage() {
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
    <>
      <div className="logined-page-bg" />

      <div className="logined-page">
        <BackgroundGlow />

        <AuthCard>
          <div className="logined-content">
            {/* 页面标题 */}
            <div className="page-header">
              <FileTextOutlined className="header-icon" />
              <Title level={3} style={{ color: '#fff', margin: 0 }}>
                基础内容展示
              </Title>
              <Tag color="blue" style={{ marginTop: 8 }}>
                <InfoCircleOutlined /> 信息页
              </Tag>
            </div>

            {/* 内容展示框 */}
            <div className="content-box">
              <div className="content-section">
                <Text strong style={{ color: '#58a6ff', fontSize: 15 }}>
                  📌 关于我们
                </Text>
                <Paragraph style={{ color: 'rgba(255,255,255,0.7)', marginTop: 8, lineHeight: 1.8 }}>
                  这是一个基础的内容展示页面，用于展示项目信息、公告通知或其他静态内容。
                  你可以根据实际需求修改这里的文字内容。
                </Paragraph>
              </div>

              <div className="content-section">
                <Text strong style={{ color: '#58a6ff', fontSize: 15 }}>
                  📋 功能说明
                </Text>
                <ul className="content-list">
                  <li>支持深色主题，护眼舒适</li>
                  <li>毛玻璃卡片，视觉统一</li>
                  <li>响应式布局，移动端适配</li>
                  <li>背景钉死，滚动不跑</li>
                </ul>
              </div>

              <div className="content-section">
                <Text strong style={{ color: '#58a6ff', fontSize: 15 }}>
                  👤 当前用户
                </Text>
                <div className="user-info-row">
                  <span className="user-label">用户名</span>
                  <span className="user-value">{userInfo.username || '未登录'}</span>
                </div>
                <div className="user-info-row">
                  <span className="user-label">用户ID</span>
                  <span className="user-value">{userInfo.id || '-'}</span>
                </div>
                <div className="user-info-row">
                  <span className="user-label">邀请码</span>
                  <span className="user-value">{userInfo.invite_code || '暂无'}</span>
                </div>
              </div>
            </div>

            {/* 底部操作按钮 */}
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <button
                className="nav-button primary"
                onClick={() => navigate('/')}
              >
                <HomeOutlined /> 返回首页
              </button>
              <button
                className="nav-button secondary"
                onClick={handleLogout}
              >
                <LogoutOutlined /> 退出登录
              </button>
            </Space>
          </div>
        </AuthCard>
      </div>
    </>
  );
}

export default OurPage;