# database.py
from sqlalchemy import create_engine, Column, Integer, String, DateTime, func
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE = "sqlite:///myweb.db"

engine = create_engine(DATABASE, connect_args={"check_same_thread": False})
Base = declarative_base()
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


# ───────────── 用户模型 ─────────────
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, nullable=False, unique=True)
    password_hash = Column(String, nullable=False)
    invite_code = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"


# ───────────── 初始化数据库 ─────────────
def init_database():
    """创建表（程序启动时调用一次即可）"""
    Base.metadata.create_all(engine)


# ───────────── 增 ─────────────
def create_user(username: str, password_hash: str, invite_code: str = None):
    """
    创建新用户。
    返回 User 对象；如果用户名已存在，返回 None。
    """
    with SessionLocal() as session:
        # 检查用户名是否已存在
        existing = session.query(User).filter_by(username=username).first()
        if existing:
            return None

        new_user = User(
            username=username,
            password_hash=password_hash,
            invite_code=invite_code
        )
        session.add(new_user)
        session.commit()
        session.refresh(new_user)   # 刷新后 new_user.id 才有值
        return new_user


# ───────────── 查 ─────────────
def get_user_by_id(user_id: int):
    """根据 ID 查询用户，不存在返回 None"""
    with SessionLocal() as session:
        return session.query(User).filter_by(id=user_id).first()


def get_user_by_username(username: str):
    """根据用户名查询用户，不存在返回 None"""
    with SessionLocal() as session:
        return session.query(User).filter_by(username=username).first()


def get_all_users():
    """查询所有用户，返回列表"""
    with SessionLocal() as session:
        return session.query(User).all()


def verify_login(username: str, password_hash: str) -> bool:
    """验证用户名和密码是否正确"""
    with SessionLocal() as session:
        user = session.query(User).filter_by(
            username=username,
            password_hash=password_hash
        ).first()
        return user is not None


# ───────────── 改 ─────────────
def update_invite_code(username: str, new_code: str) -> bool:
    """
    更新用户的邀请码。
    成功返回 True，用户不存在返回 False。
    """
    with SessionLocal() as session:
        user = session.query(User).filter_by(username=username).first()
        if not user:
            return False
        user.invite_code = new_code
        session.commit()
        return True


def update_password(username: str, new_password_hash: str) -> bool:
    """
    修改用户密码。
    成功返回 True，用户不存在返回 False。
    """
    with SessionLocal() as session:
        user = session.query(User).filter_by(username=username).first()
        if not user:
            return False
        user.password_hash = new_password_hash
        session.commit()
        return True


# ───────────── 删 ─────────────
def delete_user_by_id(user_id: int) -> bool:
    """
    根据 ID 删除用户。
    成功返回 True，用户不存在返回 False。
    """
    with SessionLocal() as session:
        user = session.query(User).filter_by(id=user_id).first()
        if not user:
            return False
        session.delete(user)
        session.commit()
        return True


def delete_user_by_username(username: str) -> bool:
    """
    根据用户名删除用户。
    成功返回 True，用户不存在返回 False。
    """
    with SessionLocal() as session:
        user = session.query(User).filter_by(username=username).first()
        if not user:
            return False
        session.delete(user)
        session.commit()
        return True



if __name__ == "__main__":
    # 初始化数据库（建表）
    init_database()

    # ── 创建用户 ──
    print("=== 创建用户 ===")
    user1 = create_user("alice", "hash_aaa", "INV001")
    print(f"创建结果: {user1}")

    user2 = create_user("bob", "hash_bbb", "INV002")
    print(f"创建结果: {user2}")

    # 重复用户名
    dup = create_user("alice", "hash_ccc")
    print(f"重复创建结果: {dup}")  # None

    # ── 查询用户 ──
    print("\n=== 查询用户 ===")
    print("按ID查询:", get_user_by_id(1))
    print("按用户名查询:", get_user_by_username("bob"))
    print("不存在的用户:", get_user_by_username("charlie"))

    print("\n=== 所有用户 ===")
    for u in get_all_users():
        print(f"  [{u.id}] {u.username}  邀请码: {u.invite_code}  注册时间: {u.created_at}")

    # ── 验证登录 ──
    print("\n=== 验证登录 ===")
    print("正确密码:", verify_login("alice", "hash_aaa"))  # True
    print("错误密码:", verify_login("alice", "wrong_hash"))  # False

    # ── 更新数据 ──
    print("\n=== 更新邀请码 ===")
    print(update_invite_code("alice", "NEW_INV999"))  # True
    print(update_invite_code("nobody", "XXX"))  # False

    print("\n=== 更新密码 ===")
    print(update_password("bob", "hash_bbb_new"))  # True

    # 验证更新后的密码
    print("新密码登录bob:", verify_login("bob", "hash_bbb_new"))  # True

    # ── 删除用户 ──
    print("\n=== 删除用户 ===")
    print(delete_user_by_username("bob"))  # True
    print(delete_user_by_username("bob"))  # False（已删除）

    print("\n=== 删除后所有用户 ===")
    for u in get_all_users():
        print(f"  [{u.id}] {u.username}  邀请码: {u.invite_code}")
