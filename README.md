# EIANUN · 出海金融路线图

这是一个轻量、响应式的单页网站复刻，参考 [nifulei.com](https://www.nifulei.com/) 的路线图、工具库和免责声明结构，适合部署在只有约 500MB 可用空间的机器上。

## 本地运行

```bash
pnpm install --frozen-lockfile
pnpm run dev
pnpm run build
```

页面不依赖数据库、上传存储或常驻 API。邀请码复制、分类筛选、深浅色切换和免责声明只使用浏览器端交互。

## 页面内容

- 场景路线：加密货币、港美股、海外账户、出境通讯
- 工具库：分类筛选和邀请码复制
- 7 步路线图、信任说明、响应式移动端布局
- 默认暗色主题，可切换浅色主题
- 首次访问显示免责声明，确认状态只保存在当前浏览器会话

## 空间建议

500MB 足够容纳这个静态站点和构建产物；实际部署时建议不上传 `node_modules`、`.pnpm-store`、`dist` 等本地目录，仅部署构建平台需要的源代码或产物。

## Useful commands

- `pnpm run dev`: 启动本地开发服务
- `pnpm run build`: 构建可部署版本
- `pnpm run build:static`: 生成 Alpine 服务器使用的纯静态包
- `pnpm test`: 构建并检查首页服务端渲染内容

## 500MB Alpine 服务器一键安装与更新

GitHub Actions 会在云端完成依赖安装、页面构建和静态包发布。服务器不需要安装 Node、npm、pnpm、Git 或 Docker。

首次安装（等待 GitHub Actions 成功后执行）：

```bash
busybox wget -qO- https://raw.githubusercontent.com/illria/eianun-web/main/server/install.sh | sh
```

以后更新：

```bash
/usr/local/sbin/eianun-web-update
```

脚本会从 `gh-pages` 分支下载最新静态包，用 BusyBox `httpd` 在 80 端口提供网页，并注册为 Alpine OpenRC 服务。若 80 端口被占用，可先修改 `/etc/conf.d/eianun-web` 的 `EIANUN_WEB_PORT`。
