# 4AGI.net

<p align="center">
  <img src="./public/logo.svg" alt="4AGI Logo" width="200" />
</p>

<p align="center">
  从代码到通用智能，从独行到共创未来，未来已来，从 4AGI 开始！
</p>

## 项目介绍

4AGI 是通往通用人工智能（AGI）的进化社区。我们从代码实践出发，探索技术边界的突破；打破个体能力局限，构建 AI 时代的共生网络。4AGI，邀您共同智启未来 —— AGI 的变革，始于每一次代码的迭代、每一次思维的碰撞，更始于您此刻的加入。

本项目是 4AGI 社区的官方网站，基于 Nuxt.js 构建，提供了丰富的 AI 相关内容和资源。

## 功能特点

- 📚 **丰富的文档资源**：提供 Prompt Engineering、Cursor、Trae 等 AI 工具的详细教程
- 🌐 **社区交流平台**：分享 AI 相关的文章、教程和经验
- 📰 **AI 资讯中心**：提供最新的 AI 技术和行业动态
- 🧭 **AI 工具导航**：收集和整理优质的 AI 工具和资源
- 🎨 **现代化 UI 设计**：基于 Tailwind CSS 和 Shadcn UI 组件库
- 🌙 **深色模式支持**：提供舒适的阅读体验
- 📱 **响应式设计**：适配各种设备屏幕

## 技术栈

- [Nuxt.js](https://nuxt.com/) - Vue.js 框架
- [Nuxt Content](https://content.nuxtjs.org/) - 文档驱动的内容管理
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Shadcn UI](https://ui.shadcn.com/) - 可定制的 UI 组件库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全的 JavaScript 超集

## 安装与使用

### 前置要求

- Node.js 18.0 或更高版本
- pnpm 包管理器

### 安装步骤

1. 克隆仓库

```bash
git clone https://github.com/4agi-net/4agi.net.git
cd 4agi.net
```

2. 安装依赖

```bash
pnpm install
```

3. 本地开发

```bash
pnpm dev
```

4. 构建生产版本

```bash
pnpm build
```

5. 预览生产版本

```bash
pnpm preview
```

## 项目结构

```
4agi.net/
├── app/                # 应用特定组件和配置
├── assets/             # 静态资源（CSS、图片等）
├── components/         # Vue 组件
│   ├── content/        # 内容相关组件
│   ├── layout/         # 布局组件
│   ├── post/           # 文章相关组件
│   └── ui/             # UI 组件
├── composables/        # 可复用的组合式函数
├── content/            # Markdown 内容
│   ├── docs/           # 文档内容
│   │   ├── prompt-engineering/ # 提示词工程文档
│   │   ├── cursor/     # Cursor 教程
│   │   └── trae/       # Trae 教程
│   ├── information/    # 资讯内容
│   ├── mcps/           # MCPs 内容
│   └── posts/          # 社区文章
├── lib/                # 工具函数和库
├── pages/              # 页面组件
├── plugins/            # Nuxt 插件
├── public/             # 公共静态文件
└── types/              # TypeScript 类型定义
```

## 贡献指南

我们欢迎并感谢任何形式的贡献！如果您想为 4AGI 社区做出贡献，请遵循以下步骤：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 联系我们

- GitHub: [https://github.com/4agi-net/4agi.net](https://github.com/4agi-net/4agi.net)
- 官方网站: [https://4agi.net](https://4agi.net)
