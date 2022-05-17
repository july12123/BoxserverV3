const KoaRouter = require('koa-router');
const router = new KoaRouter();

router
    .get('/', ctx => ctx.render('index'))
    .get('/statuspage',ctx => ctx.render('status'))
    .get('/about',ctx => ctx.render('about'))
    .get('/404',ctx => ctx.render('404'))
module.exports = router;