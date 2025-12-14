# RN App 项目启动指南

## 1. 环境准备

在开始之前，请确保你的 macOS 开发环境已安装以下工具：

- **Node.js**: JavaScript 运行时环境。
- **Xcode**: iOS 开发必备工具（包含 Xcode IDE 和 Command Line Tools）。
- **CocoaPods**: iOS 项目的依赖管理工具。
- **Ruby**: 推荐使用 Homebrew 安装的最新版 Ruby，以避免系统自带 Ruby 的权限和 SSL 问题。

## 2. 项目安装

### 2.1 安装 Node 依赖

在项目根目录下运行：

```bash
npm install
```

### 2.2 安装 iOS 原生依赖

本项目包含原生代码，需要通过 CocoaPods 安装 iOS 依赖：

```bash
cd ios
pod install
cd ..
```

## 3. 启动项目

### 启动 iOS 模拟器并运行 (推荐)

此命令会执行原生构建，生成的应用会在模拟器桌面显示图标：

```bash
npm run ios
```
