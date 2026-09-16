// 页面组织
import { useState } from 'react';

import {
  Typography,
  Divider,
} from 'antd';

import {
  GithubOutlined,
} from '@ant-design/icons';

import BackgroundGlow from '../components/BackgroundGlow';
import AuthCard from '../components/AuthCard';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const { Title, Text } = Typography;

function LoginPage() {

  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="login-page">

      {/* 背景 */}
      <BackgroundGlow />

      {/* 登录卡片 */}
      <AuthCard>

        {/* Logo */}
        <div className="logo">
          <GithubOutlined />
          <span>MyWeb</span>
        </div>

        {isRegister ? (
          <>
            <Title level={2} className="title">
              创建账户
            </Title>

            <Text className="subtitle">
              创建你的 MyWeb 账户
            </Text>

            <RegisterForm
              onSwitchLogin={() => setIsRegister(false)}
            />

            <Divider />
          </>
        ) : (
          <>
            <Title level={2} className="title">
              Welcome back
            </Title>

            <Text className="subtitle">
              登录你的 MyWeb 账户
            </Text>

            <LoginForm
              onSwitchRegister={() => setIsRegister(true)}
            />

            <Divider />
          </>
        )}

      </AuthCard>

    </div>
  );
}

export default LoginPage;