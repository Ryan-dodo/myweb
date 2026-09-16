from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import get_connection, init_database


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

    connection = get_connection()
    cursor = connection.cursor()

    # 查询账号是否已经存在
    cursor.execute(
        "SELECT id FROM users WHERE username = ?",
        (username,)
    )

    existing_user = cursor.fetchone()

    if existing_user:
        connection.close()

        return {
            "success": False,
            "message": "账号已经存在"
        }

    # 目前先直接保存密码
    # 后面我们再加入密码哈希
    cursor.execute(
        """
        INSERT INTO users
        (username, password_hash, invite_code)
        VALUES (?, ?, ?)
        """,
        (
            username,
            password,
            invite_code
        )
    )

    connection.commit()

    user_id = cursor.lastrowid

    connection.close()

    print("注册成功")
    print("用户ID：", user_id)

    return {
        "success": True,
        "message": "注册成功",
        "userId": user_id
    }