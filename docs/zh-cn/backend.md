# Vaper-server-backend

[documentation](https://vapering.github.io/vaper/#/)  
vaper-server 后端是一个基于koa2开发的WEB工程

## 环境

* node.js 运行环境
* [neo4j](https://neo4j.com/) 作为数据库

## 克隆项目

```bash
git clone https://github.com/vapering/vaper.git
cd vaper/vaper-server-backend
```

## 配置

在 `config.js`文件中, 你可以修改关于后端核数据库的连接设置。

```javascript
neo4j: {
    uri: 'bolt://127.0.0.1',
    user: 'neo4j',
    password: '123456'
}
```

## 运行

```bash
npm install
npm run dev
```

浏览器打开地址 [http://localhost:3000/](http://localhost:3000) 会出现下面的提示:
```json
{
  "status": "success",
  "message": "Vaper backend, we all know."
}
```
## 部署

在生产环境可以使用pm2来运行项目
```bash
 pm2 start bin/run
```