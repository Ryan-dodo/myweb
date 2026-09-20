
import { useNavigate } from "react-router-dom";
import "./guide.css";

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
    {
    title: "照片墙",
    icon: "📷",
    desc: "照片墙",
    path: "/photography",
    color: "#7950f1",
  },
    {
    title: "待定",
    icon: "📷",
    desc: "照片墙",
    path: "/setting",
    color: "#7912ff",
  },
];

export default function Guide() {
  const navigate = useNavigate();

  // =========================
  // ① 获取当前登录用户
  // =========================
  const userInfoString = localStorage.getItem("userInfo");

  let userInfo = null;

  try {
    userInfo = userInfoString
      ? JSON.parse(userInfoString)
      : null;
  } catch (error) {
    console.error("userInfo 解析失败:", error);
    userInfo = null;
  }

  // =========================
  // ② 获取邀请码
  // =========================
  const inviteCode = userInfo?.invite_code || "";

  console.log("当前用户:", userInfo);
  console.log("当前邀请码:", inviteCode);

  // =========================
  // ③ 根据邀请码决定显示哪些导航
  // =========================
  let visibleMenuItems = [];

  if (inviteCode === "A001") {
    // A001：显示全部
    visibleMenuItems = menuItems;
  } else if (inviteCode === "B002") {
    // B002：显示部分
    visibleMenuItems = menuItems.filter((item) =>
      [
        "/profile",
        "/ourpage",
        "/files",
        "/todo",
      ].includes(item.path)
    );
  } else {
    // 无邀请码 / 其他邀请码：只显示基础功能
    visibleMenuItems = menuItems.filter((item) =>
      [
        "/profile",
        "/ourpage",
      ].includes(item.path)
    );
  }

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
        {visibleMenuItems.map((item) => (
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