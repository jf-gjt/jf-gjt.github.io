# 郭景涛学术主页

这是一个无需构建步骤的 GitHub Pages 静态站点。页面使用 HTML5 语义化结构、Bootstrap 5 响应式栅格，以及原生 JavaScript 从配置文件动态加载资料。

## 更新个人资料

只需编辑 [data/profile.json](data/profile.json)。该文件集中维护姓名、机构、研究方向、教育经历、论文、项目和联系方式；数组顺序就是页面展示顺序。教育经历应按时间倒序填写，论文的 `category` 会自动生成筛选按钮。

[data/profile.schema.json](data/profile.schema.json) 是配置字段的 JSON Schema 说明。在 VS Code 等支持 JSON Schema 的编辑器中，可将 `profile.json` 关联到该文件以获得字段提示。发布前请将当前标记为“待更新”的示例资料替换为已核实的真实信息，并更新 GitHub 链接。

配置中常用字段：

| 区域 | 字段 | 用途 |
| --- | --- | --- |
| 基本信息 | `person` | 姓名、身份、机构、简介和摘要信息 |
| 快捷链接 | `links` | 首页按钮；`external` 为 `true` 时新窗口打开 |
| 教育背景 | `education` | `period`、学校、学位、专业与备注 |
| 学术成果 | `publications` | 年份、标题、作者、出处、分类、链接 |
| 联系方式 | `contacts` | 联系方式标签、显示值和链接 |

## 本地预览

由于页面通过 `fetch` 读取 JSON，不能直接双击 `index.html` 预览。任选一个本地静态服务器，例如：

```powershell
py -m http.server 8080
```

然后访问 `http://localhost:8080`。不需要安装 Node.js 依赖。

## 部署到 GitHub Pages

1. 在 GitHub 创建一个仓库，例如 `your-user.github.io`（个人站点）或任意项目仓库（项目站点）。
2. 将本目录全部文件提交并推送到仓库的默认分支。
3. 在仓库中打开 **Settings > Pages**，在 **Build and deployment** 选择 **Deploy from a branch**。
4. 选择分支 `main`（或实际默认分支）及目录 `/(root)`，保存。
5. GitHub 发布完成后，个人站点地址为 `https://your-user.github.io/`；项目站点地址为 `https://your-user.github.io/repository-name/`。

仓库中的 `.nojekyll` 可避免 GitHub Pages 进行不需要的 Jekyll 处理。Bootstrap 由可信 CDN 加载，站点本身不依赖后端服务。

## 功能与维护说明

- 浅色/深色模式会跟随系统初始偏好，并保存用户手动选择。
- 论文分类由 `publications[].category` 自动生成，点击即可筛选。
- 页脚“本地访问次数”由浏览器 `localStorage` 保存，只统计当前浏览器和当前设备，不会收集或上传个人数据。若需要全站真实访问量，可在 GitHub Pages 后接入 Cloudflare Web Analytics、GoatCounter 等统计服务。
- 站点使用响应式栅格、系统字体与单个 Bootstrap CDN 资源；图片采用文字占位，避免无必要的大型资源。替换为正式头像时，建议使用 WebP/AVIF 并控制在 100 KB 内。
