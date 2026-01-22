# 项目交接文档 (Handoff Documentation)

## 项目概述
本项目是一个建筑工地智能监控系统的演示前端项目，基于 React + TypeScript + Vite 构建。
界面风格采用“战术指挥风格 (Tactical Command)”，适配深色模式。

## 技术栈
- **构建工具**: Vite
- **框架**: React 18+
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件库**: shadcn/ui (基于 Radix UI)
- **图表库**: Recharts
- **路由**: wouter
- **图标**: Lucide React
- **日期处理**: date-fns

## 快速开始

### 1. 安装依赖
推荐使用 `pnpm` 进行包管理。

```bash
pnpm install
```

### 2. 启动本地开发服务器
```bash
pnpm dev
```
启动后访问 `http://localhost:3000` (端口可能根据占用情况变化)。

### 3. 生产环境打包
```bash
pnpm build
```
构建产物将输出到 `dist` 目录。

## 注意事项
1.  **模拟数据 (Mock Data)**: 
    *   本项目目前所有数据（包括报警记录、图表数据、KPI指标）均为前端硬编码的模拟数据。
    *   主要模拟数据位于 `client/src/pages/Reports.tsx` (报表中心) 和 `client/src/components/Alerts.tsx` (报警中心) 等组件文件中。
    *   **后续开发任务**: 需要对接真实后端 API 替换这些静态数据。

2.  **视频流**:
    *   目前的视频监控画面为静态占位符或演示视频。
    *   **后续开发任务**: 需要集成 HLS (m3u8) 或 WebRTC 播放器组件以接入实时监控流。

3.  **地图组件**:
    *   电子地图目前使用 SVG 模拟实现。
    *   **后续开发任务**: 可根据实际需求替换为 GIS 地图引擎 (如 Leaflet, Mapbox) 或定制的 Canvas 绘图。

## 目录结构
```
client/
  src/
    components/   # 通用组件 (Alerts, VideoWall, MapView 等)
    pages/        # 页面组件 (Home, Reports 等)
    lib/          # 工具函数
    contexts/     # React Context
    ...
public/           # 静态资源
server/           # (可选) 简单的 Express 服务器，用于生产环境预览
```
