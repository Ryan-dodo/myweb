import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LoginedPage from './pages/LoginedPage';  // 登录成功后的页面

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/logined" element={<LoginedPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;