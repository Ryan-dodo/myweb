# database.py

from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    DateTime,
    func,
    ForeignKey
)
from sqlalchemy.orm import (
    declarative_base,
    sessionmaker,
    relationship
)


DATABASE = "sqlite:///myweb.db"

engine = create_engine(
    DATABASE,
    connect_args={"check_same_thread": False}
)

Base = declarative_base()

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
)


# ═══════════════════════════════════════
# 用户模型
# ═══════════════════════════════════════

class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    username = Column(
        String,
        nullable=False,
        unique=True
    )

    password_hash = Column(
        String,
        nullable=False
    )

    invite_code = Column(
        String,
        nullable=True
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    # 一个用户可以发送很多条消息
    messages = relationship(
        "Message",
        back_populates="sender",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"


# ═══════════════════════════════════════
# 消息模型
# ═══════════════════════════════════════

class Message(Base):
    __tablename__ = "messages"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    # 发送者
    sender_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    # 消息内容
    content = Column(
        String,
        nullable=False
    )

    # 创建时间
    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    # 当前消息属于哪个用户
    sender = relationship(
        "User",
        back_populates="messages"
    )

    def __repr__(self):
        return (
            f"<Message("
            f"id={self.id}, "
            f"sender_id={self.sender_id}, "
            f"content='{self.content}'"
            f")>"
        )


# ═══════════════════════════════════════
# 初始化数据库
# ═══════════════════════════════════════

def init_database():
    """创建不存在的表"""
    Base.metadata.create_all(engine)


# ═══════════════════════════════════════
# 用户：增
# ═══════════════════════════════════════

def create_user(
    username: str,
    password_hash: str,
    invite_code: str = None
):
    """
    创建新用户。

    成功：
        返回 User 对象

    用户名已存在：
        返回 None
    """

    with SessionLocal() as session:

        existing = (
            session.query(User)
            .filter_by(username=username)
            .first()
        )

        if existing:
            return None

        new_user = User(
            username=username,
            password_hash=password_hash,
            invite_code=invite_code
        )

        session.add(new_user)
        session.commit()
        session.refresh(new_user)

        return new_user


# ═══════════════════════════════════════
# 用户：查
# ═══════════════════════════════════════

def get_user_by_id(user_id: int):
    """根据 ID 查询用户"""

    with SessionLocal() as session:

        return (
            session.query(User)
            .filter_by(id=user_id)
            .first()
        )


def get_user_by_username(username: str):
    """根据用户名查询用户"""

    with SessionLocal() as session:

        return (
            session.query(User)
            .filter_by(username=username)
            .first()
        )


def get_all_users():
    """查询所有用户"""

    with SessionLocal() as session:

        return session.query(User).all()


def verify_login(
    username: str,
    password_hash: str
) -> bool:
    """验证用户名和密码"""

    with SessionLocal() as session:

        user = (
            session.query(User)
            .filter_by(
                username=username,
                password_hash=password_hash
            )
            .first()
        )

        return user is not None


# ═══════════════════════════════════════
# 用户：改
# ═══════════════════════════════════════

def update_invite_code(
    username: str,
    new_code: str
) -> bool:
    """更新用户邀请码"""

    with SessionLocal() as session:

        user = (
            session.query(User)
            .filter_by(username=username)
            .first()
        )

        if not user:
            return False

        user.invite_code = new_code

        session.commit()

        return True


def update_password(
    username: str,
    new_password_hash: str
) -> bool:
    """修改用户密码"""

    with SessionLocal() as session:

        user = (
            session.query(User)
            .filter_by(username=username)
            .first()
        )

        if not user:
            return False

        user.password_hash = new_password_hash

        session.commit()

        return True


# ═══════════════════════════════════════
# 用户：删
# ═══════════════════════════════════════

def delete_user_by_id(user_id: int) -> bool:
    """
    根据 ID 删除用户。

    删除用户时，
    该用户发送的所有消息也会删除。
    """

    with SessionLocal() as session:

        user = (
            session.query(User)
            .filter_by(id=user_id)
            .first()
        )

        if not user:
            return False

        session.delete(user)
        session.commit()

        return True


def delete_user_by_username(username: str) -> bool:
    """根据用户名删除用户"""

    with SessionLocal() as session:

        user = (
            session.query(User)
            .filter_by(username=username)
            .first()
        )

        if not user:
            return False

        session.delete(user)
        session.commit()

        return True


# ═══════════════════════════════════════
# 消息：增
# ═══════════════════════════════════════

def create_message(
    sender_id: int,
    content: str
):
    """
    创建一条聊天消息。

    成功：
        返回 Message 对象

    用户不存在：
        返回 None
    """

    with SessionLocal() as session:

        # 先确认发送者存在
        user = (
            session.query(User)
            .filter_by(id=sender_id)
            .first()
        )

        if not user:
            return None

        # 防止发送空消息
        content = content.strip()

        if not content:
            return None

        message = Message(
            sender_id=sender_id,
            content=content
        )

        session.add(message)
        session.commit()
        session.refresh(message)

        return message


# ═══════════════════════════════════════
# 消息：查
# ═══════════════════════════════════════

def get_message_by_id(message_id: int):
    """根据消息 ID 查询消息"""

    with SessionLocal() as session:

        return (
            session.query(Message)
            .filter_by(id=message_id)
            .first()
        )


def get_all_messages():
    """
    获取所有消息。

    按发送时间从旧到新排列。
    """

    with SessionLocal() as session:

        return (
            session.query(Message)
            .order_by(Message.created_at.asc())
            .all()
        )


def get_messages(
    limit: int = 50,
    offset: int = 0
):
    """
    分页获取聊天消息。

    limit:
        一次最多获取多少条

    offset:
        从第几条开始
    """

    with SessionLocal() as session:

        return (
            session.query(Message)
            .order_by(Message.created_at.asc())
            .offset(offset)
            .limit(limit)
            .all()
        )


# ═══════════════════════════════════════
# 消息：删
# ═══════════════════════════════════════

def delete_message(
    message_id: int,
    sender_id: int
) -> bool:
    """
    删除消息。

    只有消息发送者本人才能删除。

    成功：
        True

    消息不存在 / 不是本人：
        False
    """

    with SessionLocal() as session:

        message = (
            session.query(Message)
            .filter_by(id=message_id)
            .first()
        )

        if not message:
            return False

        # 判断是不是消息本人
        if message.sender_id != sender_id:
            return False

        session.delete(message)
        session.commit()

        return True


# ═══════════════════════════════════════
# 消息：统计
# ═══════════════════════════════════════

def get_message_count():
    """获取消息总数量"""

    with SessionLocal() as session:

        return session.query(Message).count()


# ═══════════════════════════════════════
# 测试
# ═══════════════════════════════════════

if __name__ == "__main__":

    init_database()

    # ─────────────────────────
    # 创建用户
    # ─────────────────────────

    print("=== 创建用户 ===")

    user1 = create_user(
        "alice",
        "hash_aaa",
        "INV001"
    )

    print("创建结果:", user1)

    user2 = create_user(
        "bob",
        "hash_bbb",
        "INV002"
    )

    print("创建结果:", user2)

    # ─────────────────────────
    # 创建消息
    # ─────────────────────────

    print("\n=== 创建消息 ===")

    if user1:
        msg1 = create_message(
            user1.id,
            "大家好"
        )

        print("消息1:", msg1)

    if user2:
        msg2 = create_message(
            user2.id,
            "你好 Alice"
        )

        print("消息2:", msg2)

    # ─────────────────────────
    # 查询消息
    # ─────────────────────────

    print("\n=== 所有消息 ===")

    messages = get_all_messages()

    for message in messages:

        print(
            f"[{message.id}] "
            f"sender_id={message.sender_id} "
            f"content={message.content} "
            f"time={message.created_at}"
        )

    # ─────────────────────────
    # 消息数量
    # ─────────────────────────

    print("\n=== 消息数量 ===")

    print(
        "消息数量:",
        get_message_count()
    )