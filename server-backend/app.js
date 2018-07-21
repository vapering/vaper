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

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms `);
});


// error handle
app.use(async (ctx, next) => {
  try {
    console.log("1")
    await next();
    console.log("4")
  } catch (err) {
    // will only respond with JSON
    ctx.status = err.statusCode || err.status || 500;
    console.log(err.message)
    ctx.body = {
      status: "error",
      message: err.message
    };
  }
})

//check response format
app.use(async (ctx, next) => {
  console.log("2")
  await next();
  console.log("3")
  const statuses = ["success", "error"]

  if (ctx.body !== undefined){
    if (statuses.indexOf(ctx.body.status) == -1) {
      const message = "Error in response body,The ctx.body.status: (" + ctx.body.status + ") is not success or error"
      throw new Error(message)
    }
  }
})


// router.use('/', index.routes(), index.allowedMethods());
router.use('/login', user.routes(), user.allowedMethods());
router.use('/netflow', netflow.routes(), netflow.allowedMethods());
router.use('/host', host.routes(), host.allowedMethods());

// response
app.use(router.routes(), router.allowedMethods());

app.on('error', function (error, ctx) {
  console.error(error.stack)
});

module.exports = app;