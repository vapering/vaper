# Vaper-server-frontend

[documentation](https://vapering.github.io/vaper/#/)  

## Requirement

* node.js

## Installation

```bash
git clone https://github.com/vapering/vaper.git
cd vaper/vaper-server-frontend
npm install
npm run dev
```

The frontend server should listen on 9191 port.
open [http://localhost:9191](http://localhost:9191)

## Build
```bash
npm run build:prod
```
You can move the `server-fontend/dist/` to `server-backend/public/`

## How it works together with backend

* ### First: the frontend create a http request that url is http://localhost:9191/api/host/count

Setting in `config/dev.env.js`:

```javascript
BASE_API: '"http://localhost:9191/api"'
```

* ### Second: webpack proxy the request to http://localhost:3000/host/count (backend)

Setting in `build/webpack.dev.conf.js`

```javascript
proxy: {
  "/api": {
    target: "http://localhost:3000",
    pathRewrite: { "^/api": "" }
  }
}
```
