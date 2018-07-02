const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');

const config = require("./config")
const index = require('./routes/index');
const user = require('./routes/user');
const netflow = require('./routes/netflow');
const host = require('./routes/host');

// middlewares
app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(convert(require('koa-static')(__dirname + '/public')));

app.use(views(__dirname + '/views', {
  extension: 'jade'
}));

// app.use(views(__dirname + '/views-ejs', {
//   extension: 'ejs'
// }));
// test auto deploy

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// router.use('/', index.routes(), index.allowedMethods());
router.use('/login', user.routes(), user.allowedMethods());
router.use('/netflow', netflow.routes(), netflow.allowedMethods());
router.use('/host', host.routes(), host.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// response

app.on('error', function (err, ctx) {
  console.log(err)
  log.error('server error', err, ctx);
});


module.exports = app;