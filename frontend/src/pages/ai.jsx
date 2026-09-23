
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/api/axios";

import "./ai.css";


export default function AI() {

  const navigate = useNavigate();

  // =========================
  // 获取当前用户
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
  // 状态
  // =========================

  const [inputValue, setInputValue] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "ai",
      content: "你好，我是 AI 助手。有什么可以帮助你的吗（暂不支持上下文）？",
    },
  ]);

  const [loading, setLoading] = useState(false);


  // =========================
  // 消息底部引用
  // =========================

  const messagesEndRef = useRef(null);


  // =========================
  // 自动滚动到底部
  // =========================

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, loading]);


  // =========================
  // 发送消息
  // =========================

  const handleSend = async () => {

    const text = inputValue.trim();

    if (!text || loading) {
      return;
    }


    // 用户消息
    const userMessage = {
      id: Date.now(),
      role: "user",
      content: text,
    };


    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInputValue("");

    setLoading(true);


    try {

      const data = await api.post(
      "/api/ai/chat",
      {
        message: text,
        user_id: userInfo?.id || null,
      },
      {
        timeout: 120000,
      }
    );


      console.log("AI 后端返回:", data);


      if (data.success) {

        const aiMessage = {
          id: Date.now() + 1,
          role: "ai",
          content:
            data.message ||
            data.data?.message ||
            "AI 没有返回内容。",
        };


        setMessages((prev) => [
          ...prev,
          aiMessage,
        ]);

      } else {

        // 后端返回失败
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "ai",
            content:
              data.message ||
              "AI 请求失败，请稍后再试。",
          },
        ]);

      }

    } catch (error) {

      console.error("AI 请求异常:", error);


      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          content:
            error.response?.data?.message ||
            "AI 服务暂时不可用，请稍后再试。",
        },
      ]);

    } finally {

      setLoading(false);

    }
  };


  // =========================
  // 键盘事件
  // =========================

  const handleKeyDown = (event) => {

    // Enter 发送
    // Shift + Enter 换行

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      handleSend();

    }
  };


  return (
    <div className="ai-page">

      {/* =================================
          背景
      ================================= */}

      <div className="ai-glow ai-glow-1" />
      <div className="ai-glow ai-glow-2" />
      <div className="ai-glow ai-glow-3" />


      {/* =================================
          顶部导航
      ================================= */}

      <header className="ai-header">

        <button
          className="ai-back-button"
          onClick={() => navigate("/guide")}
        >
          ←
          <span>返回</span>
        </button>


        <div className="ai-title">

          <div className="ai-title-icon">
            🤖
          </div>

          <div>
            <h1>AI 助手</h1>

            <p>
              Intelligent AI Assistant
            </p>
          </div>

        </div>

      </header>


      {/* =================================
          主聊天区域
      ================================= */}

      <main className="ai-main">

        <div className="ai-chat-panel">


          {/* =================================
              消息
          ================================= */}

          <div className="ai-messages">

            {messages.map((item) => (

              <div
                key={item.id}
                className={`ai-message-row ${
                  item.role === "user"
                    ? "user-message"
                    : "ai-message"
                }`}
              >

                {/* AI头像 */}

                {item.role === "ai" && (
                  <div className="message-avatar ai-avatar">
                    🤖
                  </div>
                )}


                <div className="message-content">

                  <div className="message-name">
                    {item.role === "user"
                      ? "你"
                      : "AI 助手"}
                  </div>

                  <div className="message-bubble">
                    {item.content}
                  </div>

                </div>


                {/* 用户头像 */}

                {item.role === "user" && (
                  <div className="message-avatar user-avatar">
                    👤
                  </div>
                )}

              </div>

            ))}


            {/* AI 思考状态 */}

            {loading && (

              <div className="ai-message-row ai-message">

                <div className="message-avatar ai-avatar">
                  🤖
                </div>

                <div className="message-content">

                  <div className="message-name">
                    AI 助手
                  </div>

                  <div className="message-bubble ai-loading">

                    <span className="loading-dot" />
                    <span className="loading-dot" />
                    <span className="loading-dot" />

                  </div>

                </div>

              </div>

            )}


            <div ref={messagesEndRef} />

          </div>


          {/* =================================
              输入框
          ================================= */}

          <div className="ai-input-area">

            <textarea
              value={inputValue}
              onChange={(event) =>
                setInputValue(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="输入你想问 AI 的内容..."
              disabled={loading}
              rows={1}
            />

            <button
              className="ai-send-button"
              onClick={handleSend}
              disabled={
                loading ||
                !inputValue.trim()
              }
            >

              {loading
                ? "思考中..."
                : "发送"}

            </button>

          </div>


          <div className="ai-input-tip">
            Enter 发送 · Shift + Enter 换行
          </div>

        </div>

      </main>

    </div>
  );
}

