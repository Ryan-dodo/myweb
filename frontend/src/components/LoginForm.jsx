{/* 登录表 */}
import {
  Form,
  Input,
  Button,
  Typography,
} from 'antd';

import {
  UserOutlined,
  LockOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

function LoginForm({ onSwitchRegister }) {

  const handleSubmit = (values) => {
    console.log('登录信息:', values);
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