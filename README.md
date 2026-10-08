# URL Query Viewer

一个 Chrome / Chromium Manifest V3 扩展：点击浏览器右上角的扩展图标，即可查看当前标签页 URL 的查询参数，并可复制单个 `key=value` 或完整 URL。

## 本地加载

1. 打开 `chrome://extensions`。
2. 开启右上角的“开发者模式”。
3. 点击“加载已解压的扩展程序”，选择本项目目录。
4. 打开带查询参数的网页，点击工具栏中的扩展图标。

`chrome://` 等浏览器内部页面不允许扩展读取 URL；切换至普通网页即可使用。
