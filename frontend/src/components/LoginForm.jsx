
{/* 登录表 */}
import {
  Form,
  Input,
  Button,
  Typography,
  message,
} from 'antd';

import { useNavigate } from 'react-router-dom';

import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';

import api from '@/api/axios';

const { Text } = Typography;

function LoginForm({ onSwitchRegister }) {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    console.log('登录信息:', values);

    try {
      const data = await api.post('/api/login', {
        username: values.username,
        password: values.password,
      });

      console.log('后端返回:', data);

      if (data.success) {
        // 登录成功
        message.success('登录成功！');

        // 保存用户信息
        localStorage.setItem(
          'userInfo',
          JSON.stringify(data.data)
        );

        navigate('/logined');

      } else {
        // 登录失败
        message.error(data.message || '登录失败');
      }

    } catch (error) {
      console.error('请求异常:', error);

      message.error(
        error.response?.data?.message ||
        '网络异常，请稍后重试'
      );
    }
  };

  // 游客模式
  const handleGuestLogin = () => {
    navigate('/guide');
  };

  return (
    <>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
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

        {/* 登录按钮 */}
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

        {/* 游客模式 */}
        <Form.Item>
          <Button
            type="link"
            block
            onClick={handleGuestLogin}
          >
            游客模式（免登录）
          </Button>
        </Form.Item>

      </Form>

      <div className="switch-mode">
        <Text className="switch-text">
          还没有账号？
        </Text>

        <Button
          type="link"
          onClick={onSwitchRegister}
        >
          立即注册
        </Button>
      </div>
    </>
  );
}

export default LoginForm;
