var router = require('koa-router')();

router.post('/login', function (ctx, next) {
  ctx.body = 'this a users response!';
  ctx.body = {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  }
});

router.get('/info', function (ctx, next) {
  ctx.body = 'this a users response!';
  ctx.body = {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  }
});

module.exports = router;
