const router = require('koa-router')();
const netflow = require("../controllers/netflow");

router.post('/add', netflow.add);
router.post('/search', netflow.search);
router.get('/count', netflow.count);
router.get('/', netflow.get);

module.exports = router;