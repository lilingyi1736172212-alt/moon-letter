# 月下有书信

一封可在手机上打开的中秋书信。轻触信封，封口翻开、信纸抽出并展开；阅读祝福后，查看完整原始贺卡，放大查看或长按保存。

![分享封面](dist/assets/share-cover.png)

这是《月下有书信》的完整开源项目。仓库：https://github.com/lilingyi1736172212-alt/moon-letter 。网页发布地址以仓库 Settings → Pages 中的实际结果为准；原先的 chatgpt.site 地址已出现访问拦截，不作为可用分享入口。

## 本地运行

解压整个项目，双击 `打开贺卡.html`。无需安装依赖。

网页由原生 HTML、CSS、JavaScript 构成，无数据库、外部字体或素材服务。访客无需登录。应用没有统计脚本，托管平台可能记录安全访问日志。

## 免费发布到 GitHub Pages

1. 登录自己的 GitHub 账号，新建名为 `moon-letter` 的 **Public（公开）** 仓库。
2. 上传本项目文件，包括隐藏的 `.github` 文件夹。仓库首页应直接看到 `dist`、`scripts`、`README.md`，不能再套一层项目文件夹。可以使用 GitHub Desktop 提交整个文件夹。
3. 进入仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。
4. 进入 **Actions → Publish greeting card → Run workflow**。如果首次上传发生在启用 Pages 之前而失败，启用后重新运行即可。
5. 等待运行显示绿色成功，再从 **Settings → Pages** 复制平台实际给出的 HTTPS 地址。它通常是 `https://你的用户名.github.io/moon-letter/`；此示例不是已经发布的地址。
6. 用大陆手机的 Wi-Fi 和移动数据分别测试，再用微信打开。能发布成功不代表所有地区、运营商或微信都能稳定访问；本项目尚未完成大陆真机网络验证。

公开仓库可使用 GitHub Free 的 Pages，不必购买域名或服务器。不要选择付费升级。当前依据：[Pages 官方说明](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)、[HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)、[官方发布流程](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 封面与微信分享

封面文件是 `dist/assets/share-cover.png`，可以单独保存并发给朋友。自动发布会将平台返回的实际地址写入分享图片和页面元信息，兼容 GitHub 项目路径，无需手工替换用户名。

标准分享元信息不能保证微信显示带缩略图的卡片。本项目未接入微信 JS-SDK。现在可以把封面图片与网页链接分别发到聊天；好友点击链接进入交互页面。不要将本地文件路径当作分享链接。

## 修改祝福和贺卡

用记事本打开 `dist/content.js`，修改 `blessing` 的三段字符串，保留引号和逗号：

```js
blessing: [
  "又是一年中秋。",
  "无论相隔多远，都愿这轮明月为你带去一份温暖的祝福。",
  "中秋快乐，愿一切安好！"
]
```

若需要关闭 JavaScript 时也显示新祝福，同步修改 `dist/index.html` 最下方的 `noscript` 文本。

用新的 PNG 替换 `dist/assets/mid-autumn-card.png` 即可更换贺卡。也可在 `content.js` 修改 `cardImage`、`cardAlt`、`cardWidth`、`cardHeight`。网页完整保留图片比例；宽高填实际像素尺寸。每次提交到 main，发布流程都会更新网页。

## 文件结构

```text
├─ .github/workflows/pages.yml  GitHub 自动发布
├─ scripts/prepare-share.cjs    自动填入真实网址和封面地址
├─ 打开贺卡.html                双击预览
├─ README.md / LICENSE / ASSETS.md
├─ TEST-RESULTS.json            原网页检查记录
└─ dist/                       完整网站，亦可迁移到其他静态托管
   ├─ index.html / styles.css / app.js / content.js
   └─ assets/
      ├─ mid-autumn-card.png    原始贺卡
      ├─ osmanthus-twig.png     桂花装饰
      └─ share-cover.png        分享封面
```

没有安装步骤或付费依赖。脚本只在自动发布时运行，网页本身不依赖 Node.js。

## 检查范围

原网页已检查多种手机宽度、正常开信、减少动态效果、查看大图、重播、200% 字体和原图一致性，采用 Chromium 手机尺寸模拟。GitHub 版的本地交互与封面配置检查见 `GITHUB-PACKAGE-CHECKS.json`。自动发布流程需要在实际仓库运行后才能确认成功；不能据本地测试宣称 iPhone Safari、微信或大陆网络已验证。

## 开源范围

源代码与文档采用 MIT 许可；图片不在代码许可范围内，详见 `ASSETS.md`。
