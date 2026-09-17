import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OurPage.css";

// 模拟群成员数据
const groupMembers = [
  { id: 1, name: "张三", avatar: "🧑", color: "#58a6ff" },
  { id: 2, name: "李四", avatar: "👩", color: "#d2a8ff" },
  { id: 3, name: "王五", avatar: "🧔", color: "#3fb950" },
  { id: 4, name: "赵六", avatar: "👨‍💻", color: "#f778ba" },
  { id: 5, name: "我", avatar: "😎", color: "#ffa657", isMe: true },
];

// 模拟初始聊天记录
const initialMessages = [
  { id: 1, senderId: 1, text: "大家好，欢迎来到我们的群聊！", time: "09:30" },
  { id: 2, senderId: 2, text: "早上好～今天天气不错呢", time: "09:31" },
  { id: 3, senderId: 3, text: "是啊，适合出去走走", time: "09:32" },
  { id: 4, senderId: 1, text: "有人想一起下午去打球吗？🏀", time: "09:33" },
  { id: 5, senderId: 4, text: "算我一个！几点？", time: "09:34" },
  { id: 6, senderId: 1, text: "下午3点，老地方见", time: "09:35" },
  { id: 7, senderId: 2, text: "好的，我也来～", time: "09:36" },
  { id: 8, senderId: 3, text: "👍 到时候见", time: "09:37" },
];

function OurPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 获取发送者信息
  const getSender = (senderId) => groupMembers.find((m) => m.id === senderId);

  // 发送消息
  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      senderId: 5, // "我"的id
      text: inputText.trim(),
      time: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages([...messages, newMsg]);
    setInputText("");
    setShowEmoji(false);
  };

  // 回车发送
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 表情列表
  const emojis = ["😀", "😂", "🤣", "😍", "🥰", "😘", "👍", "👎", "🎉", "🔥", "❤️", "💯", "🏀", "⚽", "🎮", "💻"];

  return (
    <div className="chat-page-container">
      {/* 背景光晕 */}
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>
      <div className="glow glow-3"></div>

      {/* 主聊天容器 */}
      <div className="chat-glass-card">
        {/* 顶部群聊标题栏 */}
        <div className="chat-header">
          <div className="header-left">
            <span className="back-btn" onClick={() => navigate(-1)}>
              ←
            </span>
            <div className="group-info">
              <h2 className="group-name">🏀 周末打球群</h2>
              <span className="member-count">{groupMembers.length} 人</span>
            </div>
          </div>
          <div className="header-right">
            <button className="header-btn" title="群设置">⚙️</button>
          </div>
        </div>

        {/* 群成员头像栏 */}
        <div className="member-avatars">
          {groupMembers.map((member) => (
            <div key={member.id} className="member-avatar" title={member.name}>
              <span className="avatar-emoji">{member.avatar}</span>
              <span className="avatar-name">{member.name}</span>
            </div>
          ))}
        </div>

        {/* 消息列表区 */}
        <div className="messages-container">
          {messages.map((msg) => {
            const sender = getSender(msg.senderId);
            const isMe = sender?.isMe;
            return (
              <div
                key={msg.id}
                className={`message-row ${isMe ? "message-right" : "message-left"}`}
              >
                {!isMe && (
                  <div
                    className="message-avatar"
                    style={{ backgroundColor: sender?.color }}
                  >
                    {sender?.avatar}
                  </div>
                )}
                <div className="message-content">
                  {!isMe && <span className="sender-name">{sender?.name}</span>}
                  <div className={`message-bubble ${isMe ? "bubble-me" : "bubble-other"}`}>
                    {msg.text}
                  </div>
                  <span className="message-time">{msg.time}</span>
                </div>
                {isMe && (
                  <div
                    className="message-avatar"
                    style={{ backgroundColor: sender?.color }}
                  >
                    {sender?.avatar}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* 底部输入区 */}
        <div className="chat-input-area">
          {/* 表情面板 */}
          {showEmoji && (
            <div className="emoji-panel">
              {emojis.map((emoji, idx) => (
                <button
                  key={idx}
                  className="emoji-btn"
                  onClick={() => setInputText((prev) => prev + emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <div className="input-row">
            <button
              className="tool-btn emoji-toggle"
              onClick={() => setShowEmoji(!showEmoji)}
              title="表情"
            >
              😊
            </button>
            <textarea
              className="chat-textarea"
              placeholder="输入消息..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className={`send-btn ${inputText.trim() ? "send-active" : ""}`}
              onClick={handleSend}
              disabled={!inputText.trim()}
            >
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurPage;