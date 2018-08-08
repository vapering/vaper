const router = require('koa-router')();

router.get('/', async function (ctx, next) {
  ctx.state = {
    title: 'Vaper'
  };

  ctx.body = {
    "status":"success",
    "message": "Vaper backend, we all know."
  }
});


module.exports = router;