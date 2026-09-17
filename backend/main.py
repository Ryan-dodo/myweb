import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import (
    init_database,
    create_user,
    get_user_by_id,
    get_user_by_username,
    get_all_users,
    verify_login,
    update_invite_code,
    update_password,
    delete_user_by_username,
    SessionLocal,
    User,
    Message,
)
import os
from dotenv import load_dotenv

app = FastAPI()


# 初始化数据库
init_database()

# 加载 .env 文件
load_dotenv('.env.production' if os.getenv('APP_ENV') == 'production' else '.env')
# CORS
origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
print(f"✅ CORS 允许的源: {origins}")  # 加这行
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "MyWeb backend is running"
    }


@app.post("/api/register")
def register(data: dict):

    username = data.get("username")
    password = data.get("password")
    invite_code = data.get("inviteCode")

    print("收到注册请求")
    print("用户名：", username)

    # 基础检查
    if not username:
        return {
            "success": False,
            "message": "账号不能为空"
        }

    if not password:
        return {
            "success": False,
            "message": "密码不能为空"
        }

    # 查询账号是否已经存在
    existing_user = get_user_by_username(username)

    if existing_user:
        return {
            "success": False,
            "message": "账号已经存在"
        }

    # 目前先直接保存密码
    # 后面我们再加入密码哈希
    create_user(username,password,invite_code)

    print("注册成功")
    # print("用户ID：", user_id)

    return {
        "success": True,
        "message": "注册成功",
        # "userId": 123
    }


@app.get("/api/users")
def api_get_all_users():
    """
    获取所有用户列表
    """
    users = get_all_users()

    # 将数据库对象转换为字典列表，以便 FastAPI 能自动将其转换为 JSON
    user_list = [
        {
            "id": user.id,
            "username": user.username,
            "invite_code": user.invite_code,
            "created_at": user.created_at
        }
        for user in users
    ]

    return {
        "success": True,
        "data": user_list,
        "total": len(user_list)
    }

@app.post("/api/login")
def login(data: dict):
    """
    用户登录
    """
    username = data.get("username")
    password = data.get("password")

    print("收到登录请求")
    print("用户名：", username)

    # 基础检查
    if not username:
        return {
            "success": False,
            "message": "账号不能为空"
        }

    if not password:
        return {
            "success": False,
            "message": "密码不能为空"
        }

    # 验证用户名和密码
    is_valid = verify_login(username, password)

    if not is_valid:
        return {
            "success": False,
            "message": "账号或密码错误"
        }

    # 登录成功，获取用户信息
    user = get_user_by_username(username)

    print("登录成功")

    return {
        "success": True,
        "message": "登录成功",
        "data": {
            "id": user.id,
            "username": user.username,
            "invite_code": user.invite_code
        }
    }
# ═══════════════════════════════════════
# 聊天 API
# ═══════════════════════════════════════


@app.post("/api/chat/messages")
def create_message(data: dict):
    """
    发送聊天消息
    """

    sender_id = data.get("sender_id")
    content = data.get("content")

    print("收到发送消息请求")
    print("发送者ID：", sender_id)
    print("消息内容：", content)

    # 基础检查
    if not sender_id:
        return {
            "success": False,
            "message": "用户ID不能为空"
        }

    if not content or not content.strip():
        return {
            "success": False,
            "message": "消息不能为空"
        }

    content = content.strip()

    with SessionLocal() as session:

        # 查询发送者
        user = (
            session.query(User)
            .filter(User.id == sender_id)
            .first()
        )

        if not user:
            return {
                "success": False,
                "message": "用户不存在"
            }

        # 创建消息
        message = Message(
            sender_id=user.id,
            content=content
        )

        session.add(message)
        session.commit()
        session.refresh(message)

        print("消息发送成功")
        print("消息ID：", message.id)

        return {
            "success": True,
            "message": "发送成功",
            "data": {
                "id": message.id,
                "sender_id": message.sender_id,
                "sender_name": user.username,
                "content": message.content,
                "created_at": message.created_at
            }
        }


@app.get("/api/chat/messages")
def get_messages(
    limit: int = 50,
    offset: int = 0
):
    """
    获取聊天记录

    limit:
        获取多少条消息，默认50条

    offset:
        从第几条开始，默认0
    """

    # 防止前端传入奇怪的参数
    if limit < 1:
        limit = 1

    if limit > 100:
        limit = 100

    if offset < 0:
        offset = 0

    with SessionLocal() as session:

        messages = (
            session.query(Message)
            .join(User, Message.sender_id == User.id)
            .order_by(
                Message.created_at.asc(),
                Message.id.asc()
            )
            .offset(offset)
            .limit(limit)
            .all()
        )

        message_list = []

        for message in messages:

            message_list.append({
                "id": message.id,
                "sender_id": message.sender_id,
                "sender_name": message.sender.username,
                "content": message.content,
                "created_at": message.created_at
            })

        return {
            "success": True,
            "data": message_list,
            "total": len(message_list)
        }


@app.delete("/api/chat/messages/{message_id}")
def delete_message(
    message_id: int,
    user_id: int
):
    """
    删除聊天消息

    只有发送者本人可以删除自己的消息。
    """

    print("收到删除消息请求")
    print("消息ID：", message_id)
    print("用户ID：", user_id)

    with SessionLocal() as session:

        # 查询消息
        message = (
            session.query(Message)
            .filter(Message.id == message_id)
            .first()
        )

        if not message:
            return {
                "success": False,
                "message": "消息不存在"
            }

        # 检查是不是消息发送者本人
        if message.sender_id != user_id:
            return {
                "success": False,
                "message": "不能删除其他用户的消息"
            }

        # 删除消息
        session.delete(message)
        session.commit()

        print("消息删除成功")

        return {
            "success": True,
            "message": "消息删除成功"
        }