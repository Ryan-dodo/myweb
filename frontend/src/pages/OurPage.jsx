// OurPage.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./OurPage.css";

// FastAPI 地址
const API_BASE_URL = "http://127.0.0.1:8000";

// 模拟群成员数据
// 注意：这里的 id 必须和数据库 users 表中的 id 对应
const groupMembers = [
  { id: 1, name: "张三", avatar: "🧑", color: "#58a6ff" },
  { id: 2, name: "李四", avatar: "👩", color: "#d2a8ff" },
  { id: 3, name: "王五", avatar: "🧔", color: "#3fb950" },
  { id: 4, name: "赵六", avatar: "👨‍💻", color: "#f778ba" },
  { id: 5, name: "我", avatar: "😎", color: "#ffa657", isMe: true },
];

const emojis = [
  "😀",
  "😂",
  "🤣",
  "😍",
  "🥰",
  "😘",
  "👍",
  "👎",
  "🎉",
  "🔥",
  "❤️",
  "💯",
  "🏀",
  "⚽",
  "🎮",
  "💻",
];

function OurPage() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // 从 localStorage 获取当前登录用户 ID
  const userInfo = JSON.parse(
  localStorage.getItem("userInfo")
);

const currentUserId = userInfo?.id;

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // 获取发送者信息
  const getSender = (senderId, senderName) => {
    const localSender = groupMembers.find(
      (member) => member.id === senderId
    );

    // 如果本地没有对应成员，就使用后端返回的用户名
    if (localSender) {
      return localSender;
    }

    return {
      id: senderId,
      name: senderName || `用户${senderId}`,
      avatar: "🙂",
      color: "#8b949e",
    };
  };

  // 将后端消息转换为前端页面需要的格式
  const convertMessage = (message) => {
    const createdTime = message.created_at
      ? new Date(message.created_at).toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "";

    return {
      id: message.id,
      senderId: message.sender_id,
      senderName: message.sender_name,
      text: message.content,
      time: createdTime,
    };
  };

  // 获取历史聊天记录
  const loadMessages = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        `${API_BASE_URL}/api/chat/messages`
      );

      if (response.data.success) {
        const backendMessages = response.data.data || [];

        const frontendMessages = backendMessages.map(convertMessage);

        setMessages(frontendMessages);
      } else {
        setErrorMessage(response.data.message || "获取聊天记录失败");
      }
    } catch (error) {
      console.error("获取聊天记录失败：", error);
      setErrorMessage("无法连接聊天服务器");
    } finally {
      setLoading(false);
    }
  };

  // 页面第一次加载时获取聊天记录
  useEffect(() => {
    loadMessages();
  }, []);

  // 发送消息
  const handleSend = async () => {
    const content = inputText.trim();

    if (!content) {
      return;
    }

    if (!currentUserId) {
      alert("没有获取到当前用户信息，请重新登录");
      return;
    }

    try {
      setSending(true);
      setErrorMessage("");

      const response = await axios.post(
        `${API_BASE_URL}/api/chat/messages`,
        {
          sender_id: currentUserId,
          content: content,
        }
      );

      if (response.data.success) {
        const newMessage = convertMessage(response.data.data);

        // 将后端返回的真实消息追加到页面
        setMessages((prevMessages) => [
          ...prevMessages,
          newMessage,
        ]);

        setInputText("");
        setShowEmoji(false);
      } else {
        alert(response.data.message || "发送失败");
      }
    } catch (error) {
      console.error("发送消息失败：", error);

      if (error.response) {
        alert(
          error.response.data?.message || "服务器处理失败"
        );
      } else {
        alert("无法连接聊天服务器");
      }
    } finally {
      setSending(false);
    }
  };

  // 回车发送
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
            <span
              className="back-btn"
              onClick={() => navigate(-1)}
            >
              ←
            </span>

            <div className="group-info">
              <h2 className="group-name">🏀 周末打球群</h2>
              <span className="member-count">
                {groupMembers.length} 人
              </span>
            </div>
          </div>

          <div className="header-right">
            <button className="header-btn" title="群设置">
              ⚙️
            </button>
          </div>
        </div>

        {/* 群成员头像栏 */}
        <div className="member-avatars">
          {groupMembers.map((member) => (
            <div
              key={member.id}
              className="member-avatar"
              title={member.name}
            >
              <span className="avatar-emoji">
                {member.avatar}
              </span>
              <span className="avatar-name">
                {member.name}
              </span>
            </div>
          ))}
        </div>

        {/* 消息列表区 */}
        <div className="messages-container">
          {loading && (
            <div className="chat-status">
              正在加载聊天记录...
            </div>
          )}

          {!loading && messages.length === 0 && (
            <div className="chat-status">
              暂无聊天记录，发送第一条消息吧
            </div>
          )}

          {errorMessage && (
            <div className="chat-error">
              {errorMessage}
            </div>
          )}

          {messages.map((msg) => {
            const sender = getSender(
              msg.senderId,
              msg.senderName
            );

            // 直接根据数据库用户 ID 判断是不是当前登录用户
            const isMe = msg.senderId === currentUserId;

            return (
              <div
                key={msg.id}
                className={`message-row ${
                  isMe ? "message-right" : "message-left"
                }`}
              >
                {!isMe && (
                  <div
                    className="message-avatar"
                    style={{
                      backgroundColor: sender.color,
                    }}
                  >
                    {sender.avatar}
                  </div>
                )}

                <div className="message-content">
                  {!isMe && (
                    <span className="sender-name">
                      {sender.name}
                    </span>
                  )}

                  <div
                    className={`message-bubble ${
                      isMe
                        ? "bubble-me"
                        : "bubble-other"
                    }`}
                  >
                    {msg.text}
                  </div>

                  <span className="message-time">
                    {msg.time}
                  </span>
                </div>

                {isMe && (
                  <div
                    className="message-avatar"
                    style={{
                      backgroundColor: sender.color,
                    }}
                  >
                    {sender.avatar}
                  </div>
                )}
              </div>
            );
          })}

          <div ref={messagesEndRef}></div>
        </div>

        {/* 底部输入区 */}
        <div className="chat-input-area">
          {/* 表情面板 */}
          {showEmoji && (
            <div className="emoji-panel">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  className="emoji-btn"
                  onClick={() =>
                    setInputText((prev) => prev + emoji)
                  }
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <div className="input-row">
            <button
              className="tool-btn emoji-toggle"
              onClick={() => setShowEmoji((prev) => !prev)}
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
              className={`send-btn ${
                inputText.trim() ? "send-active" : ""
              }`}
              onClick={handleSend}
              disabled={!inputText.trim() || sending}
            >
              {sending ? "发送中..." : "发送"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OurPage;