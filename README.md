# 心流 · FLOW LAB

一个面向中文读者的交互学习网站：从《心流》的核心观点出发，连接研究证据与一次可以亲手完成的专注实验。

## 功能

- **快速理解**：首页挑战—能力互动地图；三张核心观点卡片，按需展开论证。
- **深入探索**：原著阅读路线、误区辨析、研究发现与局限、六条分级阅读资源。
- **动手实践**：学习、写作、编程、音乐及自定义场景；明确目标与反馈；10/25/45 分钟计时、暂停与提前结束。
- **复盘积累**：本机保存最近 100 条记录，展示最近 5 条，支持 JSON 导出与确认清空。
- **适配与可访问性**：手机/桌面布局，键盘操作、表单标签、跳转正文、减少动画偏好。

## 本地运行

需要 Node.js 20 或更新版本，无依赖安装、无构建步骤。

```sh
node server.mjs
```

打开 `http://127.0.0.1:4173`。也可以使用 `npm start`。使用 HTTP 服务以确保本机记录行为一致，不建议直接通过 `file://` 打开。

```sh
npm run check
```

检查 JavaScript 语法并运行 Node 原生测试。浏览器实测范围与限制见 [产品功能说明](docs/PRODUCT.md)。

## 发布

`.github/workflows/pages.yml` 在推送 `main` 后检查并发布 GitHub Pages。仅上传 `index.html`、`style.css`、`app.js`、`favicon.svg`，不会上传文档、测试或本机记录。

若仓库尚未启用 Pages，仓库管理员需在 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。工作流尝试自动启用，但 GitHub 的默认工作流令牌未必有创建 Pages 站点的权限。以 Actions 的实际成功状态为准；只推送成功不代表已经上线。

预期 Pages 地址：`https://jerrychen-mcgill.github.io/xinliu/`。根目录静态文件也可以部署到任何静态托管服务；全部资产路径为相对路径，支持子目录托管。

## 结构

```text
index.html               页面语义结构与主题导读
style.css                视觉、响应式布局与无障碍状态
app.js                   地图、测验、练习、存储与资源
favicon.svg              站点标识
server.mjs               本地预览（仅允许读取公开资产）
tests/site.test.mjs      静态完整性及本地服务测试
docs/PRODUCT.md          产品功能说明与验收记录
docs/SOURCES.md          来源、论证映射及阅读范围
.github/workflows/       GitHub Pages 自动发布
```

## 数据与内容边界

任务和复盘保存在当前浏览器的 `localStorage`，不上传服务器、没有账户、不跨设备同步。浏览器拒绝存储时会提示导出。练习中的刷新或关闭会提示确认，计时不跨刷新恢复；暂停不计入练习时长。后台计时以时间戳校正，系统时间大幅调整可能影响计时。

正文可离线显示；Google Fonts 为可选外部字体，加载失败回退本机字体。外部阅读链接需要网络。本网站不包含原书全文。中文为主题式原创概括，不是中文译本、不构成完整逐章阅读替代。地图、练习及时间选项是教学设计，不是经验证的测评或心流干预方案。

详细参考资料：[SOURCES.md](docs/SOURCES.md)。
