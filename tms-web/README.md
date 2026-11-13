# TMS 运输管理平台 · Web 前端

基于 **React 19** 的后台管理前端，对接同仓库后端（`tms-admin`，Spring Boot，默认 `http://localhost:8080`，上下文 `/api`）。

当前版本：`tms-web@0.0.0`（平台整体版本 **3.9.2**）

---

## 技术栈

### 核心

| 技术 | 版本 | 说明 |
|------|------|------|
| **React** | **19.1.x** | UI 框架（含 `react-dom`） |
| TypeScript | ~5.8 | 类型系统 |
| Vite | ^6.4 | 构建与开发服务器 |
| React Router | ^7.9 | 路由（`HashRouter`） |

### UI 与样式

| 技术 | 版本 | 说明 |
|------|------|------|
| TDesign React | ^1.18 | 组件库（含 React 19 adapter） |
| TDesign Icons | ^0.6 | 图标 |
| Tailwind CSS | ^4.2 | 原子化样式（`@tailwindcss/vite`） |
| react-jss | ^10.10 | CSS-in-JS（布局/主题相关） |
| simplebar-react | ^3.3 | 自定义滚动条 |

### 状态与数据

| 技术 | 版本 | 说明 |
|------|------|------|
| Redux Toolkit | ^2.11 | 全局状态 |
| react-redux | ^9.2 | React 绑定 |
| Immer | ^11.1 | 不可变更新（含 Map/Set） |
| Axios | ^1.12 | HTTP 请求 |
| js-cookie | ^3.0 | Cookie |
| dayjs | ^1.11 | 日期时间 |

### 工程与体验

| 技术 | 版本 | 说明 |
|------|------|------|
| keepalive-for-react | ^5.0 | 路由页面缓存 |
| nprogress | ^0.2 | 路由切换进度条 |
| crypto-js | ^4.2 | 加解密 |
| number-precision | ^1.6 | 高精度计算 |
| element-china-area-data | ^6.1 | 省市区数据 |
| unplugin-icons | ^22.5 | 按需图标（含本地 SVG） |
| vite-plugin-svgr | ^5.2 | SVG 转 React 组件 |
| ESLint 9 | — | 代码规范 |
| code-inspector-plugin | — | 开发态 DOM → IDE 定位（可选） |

生产构建额外启用压缩、图片优化等插件；生产环境可注册 `public/sw.js` Service Worker。

---

## 功能概览

- 登录鉴权、Token 管理、路由守卫
- 基于后端菜单动态生成路由
- 多布局 / 主题偏好（preferences）
- 多标签页（tabs）与 KeepAlive
- 系统管理：用户、角色、菜单、部门、岗位
- 个人中心、字典、操作/登录日志等接口封装
- 通用业务组件：`BasicTable`、`BasicForm`、`BasicDialog`、`SearchBox` 等

---

## 目录结构

```text
tms-web/
├── public/                 # 静态资源、favicon、sw.js
├── src/
│   ├── api/                # 接口层（modules 自动合并）
│   ├── assets/             # 静态资源
│   ├── components/         # 通用业务组件
│   ├── constants/          # 常量
│   ├── hooks/              # 自定义 Hooks
│   ├── icons/              # 本地 SVG 图标
│   ├── interface/          # TS 类型
│   ├── layout/             # 布局（侧栏、顶栏、标签页等）
│   ├── pages/              # 页面
│   │   ├── home/
│   │   ├── login/
│   │   ├── personal-center/
│   │   ├── system/         # user / role / menu / dept / post
│   │   └── notFound/
│   ├── plugins/            # 首屏 loading、主题相关等
│   ├── router/             # 路由、守卫、菜单转路由
│   ├── store/              # Redux（user / menu / tabs / preferences）
│   ├── styles/             # 全局样式
│   ├── utils/              # 请求封装、Token、加解密等
│   ├── App.tsx
│   └── main.tsx
├── vite/                   # Vite 插件与优化配置
├── .env.development
├── .env.production
├── .env.example
├── package.json
└── vite.config.ts
```

---

## 环境要求

- **Node.js**：建议 18+（推荐 LTS）
- **包管理器**：推荐 **pnpm**（已配置 `.npmrc`：`node-linker=hoisted`，避免 Windows 下符号链接问题）
- 后端：本地 `tms-admin` 默认监听 **8080**，`context-path: /api`

---

## 快速开始

```bash
# 进入前端目录
cd tms-web

# 安装依赖
pnpm install
# 或 npm install

# 启动开发（默认 http://localhost:3000，/api 代理到 8080）
pnpm dev

# 类型检查 + 生产构建
pnpm build

# 预览构建产物
pnpm preview

# ESLint
pnpm lint
```

### 开发代理

`vite.config.ts` 中：

- 开发端口：`3000`
- 代理：`/api` → `http://localhost:8080`

请先启动后端，再访问前端。

### 可选：Code Inspector

默认关闭以加快冷启动。需要「按住修饰键点击页面元素跳转 IDE」时，在环境变量中设置：

```env
CODE_INSPECTOR=1
```

- Windows：`Alt + Shift` + 点击  
- macOS：`Option + Shift` + 点击  

---

## 环境变量

参考 `.env.example`，主要变量：

| 变量 | 说明 |
|------|------|
| `VITE_API_URL` | API 基址；开发建议 `/`（走 Vite 代理） |
| `VITE_API_MAX_CONCURRENT` | 全局 API 最大并发（默认约 6） |
| `VITE_BASE_HOME_PATH` | 登录后首页路径，如 `/home` |
| `VITE_BASE_Title` | 浏览器标题 / 项目名 |
| `VITE_APP_RELEASE` | 发布标识，如 `tms-web@dev` |
| `CODE_INSPECTOR` | 设为 `1` 开启 DOM 定位 IDE |

---

## 与后端模块关系

本仓库为前后端一体结构：

| 模块 | 说明 |
|------|------|
| `tms-web` | 本前端工程 |
| `tms-admin` | Spring Boot 启动入口 |
| `tms-framework` | 安全、配置等框架层 |
| `tms-system` | 系统业务 |
| `tms-common` | 通用工具 |
| `tms-generator` | 代码生成 |

后端技术概要：Java 17、Spring Boot 4.0.x、MyBatis、Redis、JWT、Knife4j / springdoc 等。

---

## 脚本说明

| 命令 | 作用 |
|------|------|
| `pnpm dev` | 启动 Vite 开发服务器 |
| `pnpm build` | `tsc` 类型检查后执行 `vite build` |
| `pnpm preview` | 预览生产构建 |
| `pnpm lint` | 运行 ESLint |

---

## License

私有项目（`private: true`），仅供内部使用。
