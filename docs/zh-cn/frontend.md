# Vaper-server-frontend

[documentation](https://vapering.github.io/vaper/#/)  

前端工程是一个基于[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)的工程  
## 环境要求

* node.js

## 安装

```bash
git clone https://github.com/vapering/vaper.git
cd vaper/vaper-server-frontend
npm install
npm run dev
```

浏览器打开 [http://localhost:9191](http://localhost:9191)

## 前端如何与后端一起工作

* ### 第一步: 前端发出一个http请求到地址 http://localhost:9191/api/host/count

`config/dev.env.js` 中的webpack代理配置:

```javascript
BASE_API: '"http://localhost:9191/api"'
```

* ### 第二部: webpack 将请求代理给了 http://localhost:3000/host/count (后端)

`build/webpack.dev.conf.js` 配置如下

```javascript
proxy: {
  "/api": {
    target: "http://localhost:3000",
    pathRewrite: { "^/api": "" }
  }
}
```
