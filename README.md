# RN App 项目启动指南

本文档详细说明了如何配置环境、安装依赖并在 iOS 模拟器上启动本项目。

## 1. 环境准备

在开始之前，请确保你的 macOS 开发环境已安装以下工具：

- **Node.js**: JavaScript 运行时环境。
- **Xcode**: iOS 开发必备工具（包含 Xcode IDE 和 Command Line Tools）。
- **CocoaPods**: iOS 项目的依赖管理工具。
- **Ruby**: 推荐使用 Homebrew 安装的最新版 Ruby，以避免系统自带 Ruby 的权限和 SSL 问题。

### 关键环境变量配置

如果你使用了 Homebrew 安装 Ruby，请确保环境变量配置正确（例如在 `.zshrc` 中）：

```bash
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
export PATH="/opt/homebrew/lib/ruby/gems/3.4.0/bin:$PATH"
```

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

> **注意**: 如果 `pod install` 遇到网络问题或 SSL 证书错误，请检查 `ios/Podfile` 文件，确保使用了稳定的源（如 CDN）：
>
> ```ruby
> source 'https://cdn.cocoapods.org/'
> ```

## 3. 启动项目

### 启动 iOS 模拟器并运行 (推荐)

此命令会执行原生构建，生成的应用会在模拟器桌面显示图标：

```bash
npm run ios
```

或者使用：

```bash
npx expo run:ios
```

**该命令会自动执行以下步骤：**

1.  启动 Metro Bundler（开发服务器）。
2.  启动 iOS 模拟器（如果未运行）。
3.  调用 `xcodebuild` 编译原生应用。
4.  将应用安装到模拟器并自动打开。

## 4. 常见问题排查

- **模拟器无响应/卡在开机画面**：
  - 尝试重置模拟器数据：菜单栏 `Device` -> `Erase All Content and Settings`，或在终端运行 `xcrun simctl erase all`。
- **构建失败 (Build Failed)**：
  - 检查 `ios` 目录下是否生成了 `rnapp.xcworkspace` 文件。
  - 尝试清理构建缓存：`cd ios && xcodebuild clean`。
- **CocoaPods SSL 错误**：
  - 确认 Ruby 和 Gem 源配置正确（推荐使用 `rubygems.org`）。

## 5. 项目目录结构说明

```text
rn-app/
├── assets/             # 静态资源目录（应用图标、启动页图片等）
├── ios/                # iOS 原生工程代码（Xcode 项目文件、Podfile 等）
├── android/            # Android 原生工程代码（Gradle 构建文件等，如已生成）
├── App.tsx             # 项目主入口组件，你的大部分代码将从这里开始
├── app.json            # Expo 配置文件（设置应用名称、版本、图标路径等）
├── index.js            # App 注册入口（通常不需要修改）
├── package.json        # 项目依赖和脚本配置文件
├── tsconfig.json       # TypeScript 配置文件
├── .eslintrc.js        # 代码规范检查配置
└── .prettierrc         # 代码格式化配置
```
