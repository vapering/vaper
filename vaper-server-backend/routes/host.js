const router = require('koa-router')()
const host = require("../controllers/host")

router.post('/add_or_update', host.add_or_update)
router.post('/search', host.search)
router.post('/search/by/id/deepth', host.searchNodesByIdNDeepth)
router.post('/search/by/uids', host.searchByUids)
router.get('/count', host.count)
router.post('/updateTags', host.updateTags)

module.exports = router;