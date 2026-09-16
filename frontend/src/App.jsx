import { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Divider,
  message,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  GithubOutlined,
} from '@ant-design/icons';

import './App.css';

const { Title, Text } = Typography;

function App() {
  const [isRegister, setIsRegister] = useState(false);

  const handleLogin = (values) => {
    console.log('登录信息:', values);
    message.success('登录请求已提交');
  };

  const handleRegister = (values) => {
    console.log('注册信息:', values);
    message.success('注册请求已提交');
  };

  return (
    <div className="login-page">

      {/* 背景光晕 */}
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>
      <div className="glow glow-3"></div>

      {/* 登录 / 注册卡片 */}
      <div className="glass-card">

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

            <Form
              layout="vertical"
              onFinish={handleRegister}
              autoComplete="off"
            >

              {/* 账号 */}
              <Form.Item
                label="账号"
                name="username"
                rules={[
                  {
                    required: true,
                    message: '请输入账号',
                  },
                  {
                    min: 3,
                    message: '账号至少 3 个字符',
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="请输入账号"
                />
              </Form.Item>

              {/* 密码 */}
              <Form.Item
                label="密码"
                name="password"
                rules={[
                  {
                    required: true,
                    message: '请输入密码',
                  },
                  {
                    min: 6,
                    message: '密码至少 6 个字符',
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                />
              </Form.Item>

              {/* 确认密码 */}
              <Form.Item
                label="确认密码"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  {
                    required: true,
                    message: '请再次输入密码',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error('两次输入的密码不一致')
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="请再次输入密码"
                />
              </Form.Item>

              {/* 邀请码 */}
              <Form.Item
                label={
                  <span>
                    邀请码&nbsp;
                    <Text type="secondary">
                      （可选）
                    </Text>
                  </span>
                }
                name="inviteCode"
              >
                <Input
                  size="large"
                  prefix={<SafetyOutlined />}
                  placeholder="请输入邀请码（可选）"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  className="submit-button"
                >
                  注册
                </Button>
              </Form.Item>

            </Form>

            <Divider />

            <div className="switch-mode">
              <Text>
                已有账号？
              </Text>

              <Button
                type="link"
                onClick={() => setIsRegister(false)}
              >
                返回登录
              </Button>
            </div>
          </>
        ) : (
          <>
            <Title level={2} className="title">
              Welcome back
            </Title>

            <Text className="subtitle">
              登录你的 MyWeb 账户
            </Text>

            <Form
              layout="vertical"
              onFinish={handleLogin}
              autoComplete="off"
            >

              {/* 账号 */}
              <Form.Item
                label="账号"
                name="username"
                rules={[
                  {
                    required: true,
                    message: '请输入账号',
                  },
                ]}
              >
                <Input
                  size="large"
                  prefix={<UserOutlined />}
                  placeholder="请输入账号"
                />
              </Form.Item>

              {/* 密码 */}
              <Form.Item
                label="密码"
                name="password"
                rules={[
                  {
                    required: true,
                    message: '请输入密码',
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<LockOutlined />}
                  placeholder="请输入密码"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  className="submit-button"
                >
                  登录
                </Button>
              </Form.Item>

            </Form>

            <Divider />

            <div className="switch-mode">
              <Text>
                还没有账号？
              </Text>

              <Button
                type="link"
                onClick={() => setIsRegister(true)}
              >
                立即注册
              </Button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default App;