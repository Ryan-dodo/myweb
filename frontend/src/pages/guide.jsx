import { useNavigate } from "react-router-dom";

import "./Guide.css";

const menuItems = [
  {
    title: "个人中心",
    icon: "👤",
    desc: "查看个人资料与账户信息",
    path: "/profile",
    color: "#58a6ff",
  },
  {
    title: "聊天室",
    icon: "💬",
    desc: "进入群聊和实时聊天",
    path: "/chat",
    color: "#3fb950",
  },
  {
    title: "文件中心",
    icon: "📁",
    desc: "上传、下载与分享文件",
    path: "/files",
    color: "#d2a8ff",
  },
  {
    title: "任务管理",
    icon: "📋",
    desc: "管理待办事项与任务",
    path: "/todo",
    color: "#f778ba",
  },
  {
    title: "AI助手",
    icon: "🤖",
    desc: "调用AI能力处理内容",
    path: "/ai",
    color: "#ffa657",
  },
  {
    title: "系统设置",
    icon: "⚙️",
    desc: "网站配置与系统管理",
    path: "/setting",
    color: "#79c0ff",
  },
];

function Guide() {
  const navigate = useNavigate();

  const handleJump = (path) => {
    navigate(path);
  };

  return (
    <div className="guide-page-container">
      {/* 背景光晕 */}
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>
      <div className="glow glow-3"></div>

      <div className="guide-glass-card">

        {/* 顶部区域 */}
        <div className="guide-header">
          <h1 className="guide-title">
            🚀 Jiatao Cloud Hub
          </h1>

          <p className="guide-subtitle">
            Personal Navigation Center
          </p>
        </div>

        {/* 功能入口 */}
        <div className="guide-grid">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className="guide-item"
              onClick={() => handleJump(item.path)}
              style={{
                "--glow-color": item.color,
              }}
            >
              <div className="guide-icon">
                {item.icon}
              </div>

              <div className="guide-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Guide;