import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uuid  # 新增唯一标识符生成
from fastapi.responses import JSONResponse  # 新增 JSONResponse
from pathlib import Path  # 新增 Path，用于处理跨平台路径
from datetime import datetime  # 新增时间处理
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


# ================= 配置上传目录 =================
# 假设 backend 和 frontend 在同一级目录 myweb 下
# __file__ 是 backend/main.py，parent 是 backend，parent.parent 是 myweb
UPLOAD_DIR = Path(__file__).parent.parent / "frontend" / "src" / "photos"

# 允许的图片格式
ALLOWED_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# ================= 图片上传接口 =================
@app.post("/api/photos/upload")
async def upload_photo(file: UploadFile = File(...)):
    """
    上传图片到本地
    """
    try:
        # 1. 验证文件类型
        if file.content_type not in ALLOWED_TYPES:
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "message": f"不支持的文件类型: {file.content_type}，仅支持 JPEG/PNG/GIF/WebP"
                }
            )

        # 2. 读取文件内容并检查大小
        content = await file.read()
        if len(content) > MAX_FILE_SIZE:
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "message": f"文件过大，最大支持 {MAX_FILE_SIZE // 1024 // 1024}MB"
                }
            )

        # 3. 生成唯一文件名（防止重名）
        file_extension = Path(file.filename).suffix
        unique_filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex[:8]}{file_extension}"

        # 4. 确保上传目录存在
        UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

        # 5. 保存文件
        file_path = UPLOAD_DIR / unique_filename
        with open(file_path, "wb") as buffer:
            buffer.write(content)

        # 6. 返回相对路径（前端可直接使用）
        relative_path = f"photos/{unique_filename}"

        print(f"图片上传成功: {relative_path}")

        return {
            "success": True,
            "message": "上传成功",
            "data": {
                "filename": unique_filename,
                "path": relative_path,
            }
        }

    except Exception as e:
        print(f"上传失败: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": f"上传失败: {str(e)}"
            }
        )