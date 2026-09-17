// 注册表
import {
  Form,
  Input,
  Button,
  Typography,
    message,
} from 'antd';

import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
} from '@ant-design/icons';


const { Text } = Typography;

function RegisterForm({ onSwitchLogin }) {

  const handleSubmit = async (values) => {
  console.log('① 点击注册，表单数据：', values);

  try {
    console.log('② 准备发送请求');

    const response = await fetch(
      'http://127.0.0.1:8000/api/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          inviteCode: values.inviteCode,
        }),
      }
    );

    console.log('③ 收到 HTTP 响应：', response);
    console.log('HTTP 状态码：', response.status);

    const data = await response.json();

    console.log('④ 后端返回：', data);
    if (response.ok) {
        // 3. 注册成功，显示提示信息
        await message.success('注册成功，请登录！');

        // 4. 调用父组件传来的函数，切换回登录框
        onSwitchLogin();
      } else {
        // 5. 注册失败，显示后端返回的错误信息
        // 假设后端返回的错误信息在 data.message 中
        await message.error(data.message || '注册失败');
      }



  } catch (error) {
    console.error('⑤ 注册请求失败：', error);
  }
};

  return (
    <>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        onFinishFailed={(errorInfo) => {
    console.log('❌ 表单验证失败：', errorInfo);
  }}
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

                if (
                  !value ||
                  getFieldValue('password') === value
                ) {
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

        {/* 注册按钮 */}
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

      <div className="switch-mode">

        <Text className="switch-text">
          已有账号？
        </Text>

        <Button
          type="link"
          onClick={onSwitchLogin}
        >
          返回登录
        </Button>

      </div>
    </>
  );
}

export default RegisterForm;