# 我的网页
## 前端设计风格
Glassmorphism 毛玻璃
特点：123
类似github网页
半透明卡片
backdrop-filter: blur()
背景渐变
光晕
透明边框
层次感强

适合： AI、科技、金融、Dashboard

## 功能介绍
权限分级为访客、核心成员、管理员

登录成功后显示对应功能按钮自行跳转

管理员支持聊天室功能
## nignx配置参考

`
server {
        listen 80;
    server_name 122.51.165.233;
  # 允许最大 10MB 的请求体（按需调整）
        client_max_body_size 10M;
    # ========= API反向代理，放在最上面 =========
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ========= 前端静态页面 =========
    location / {
        root /home/ubuntu/myweb/frontend/dist;
        # 单页应用路由，重点！不要保留原来的 $uri.html
        try_files $uri $uri/ /index.html;
    }`



## 前端配置文件.env.production 参考

`# 上云后的后端地址之前是/
VITE_API_BASE_URL=/
VITE_ENV=production
`

## 后端配置文件参考 .env.production 参考

`# 后端 .env 文件
# 允许跨域的前端地址，多个地址用英文逗号分隔
ALLOWED_ORIGINS=http://122.51.165.233
`
## md语法备忘

| 功能 | 语法 |
|---|---|
| 标题 | `# 标题` |
| 粗体 | `文字` |
| 斜体 | `*文字*` |
| 删除线 | `~~文字~~` |
| 行内代码 | `` `代码` `` |
| 代码块 | ` ```语言 代码 ``` ` |
| 无序列表 | `- 项目` |
| 有序列表 | `1. 项目` |
| 引用 | `> 文字` |
| 链接 | `[文字](URL)` |
| 图片 | `![描述](URL)` |
| 表格 | `\| 列1 \| 列2 \|` |
| 分割线 | `---` |

# 后端常用指令
pip install -r requirements.txt
pip freeze > requirements.txt
source .venv/bin/activate

ps -ef | grep "fastapi run"
kill 【进程号】
ps -ef | grep "fastapi run" | grep -v grep
nohup fastapi run > backend.log 2>&1 &

# 前端常用指令