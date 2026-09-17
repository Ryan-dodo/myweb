import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginedPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // 检查是否已登录
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      // 没登录就跳回首页
      navigate('/');
    }
  }, [navigate]);

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>登录成功！</h1>
      <p>欢迎，{userInfo.username}</p>
      <button onClick={handleLogout}>退出登录</button>
    </div>
  );
}

export default LoginedPage;