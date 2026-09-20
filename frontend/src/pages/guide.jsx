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
    path: "/ourpage",
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

export default function Guide() {
  const navigate = useNavigate();

  return (
    <div className="guide-page">
      <div className="glow glow-1" />
      <div className="glow glow-2" />
      <div className="glow glow-3" />

      <header className="guide-hero">
        <h1>🚀 Cloud Hub</h1>
        <p>Personal Navigation Center</p>
      </header>

      <section className="guide-dashboard">
        {menuItems.map((item) => (
          <div
            key={item.path}
            className="dashboard-tile"
            style={{
              "--tile-color": item.color,
            }}
            onClick={() => navigate(item.path)}
          >
            <span className="tile-icon">
              {item.icon}
            </span>

            <div className="tile-info">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}