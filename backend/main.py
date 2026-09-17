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
)



app = FastAPI()


# 初始化数据库
init_database()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
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