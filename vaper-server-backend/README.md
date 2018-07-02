# Vaper-server-backend

[Vaper doc home](https://vapering.github.io/vaper-docs/)
> [vaper-server-backend](https://github.com/vapering/vaper-server-backend)
> was generated from [koa-generator](https://github.com/17koa/koa-generator)

## Requirement

* node.js
* [neo4j](https://neo4j.com/) as database

## Getting Start

### Get source from github

```bash
git clone https://github.com/vapering/vaper-server-backend.git
cd vaper-server-backend
```

### Configuration

In `config.js`, you can modify the configration about the backend and the neo4j database setting.

```javascript
neo4j: {
    uri: 'bolt://127.0.0.1',
    user: 'neo4j',
    password: '123456'
}
```

### Run

```bash
npm install
npm run dev
```

open in browser

The backend server should listen on 3000 port.
The [http://localhost:3000/](http://localhost:3000/) will be "Vaper backend, we all know."

## pm2

You can also use the pm2(Advanced, production process manager for Node.js)
```bash
 #npm run pm2
 pm2 start bin/run
```