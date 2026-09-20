import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import LoginedPage from './pages/LoginedPage';
import OurPage from './pages/OurPage';
import GuidePage from './pages/guide';
// ✅ 正确路径：App.jsx 在 src/ 下，components 也在 src/ 下


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/logined" element={<LoginedPage />} />
        <Route path="/ourpage" element={<OurPage />} />
        <Route path="/guide" element={<GuidePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;