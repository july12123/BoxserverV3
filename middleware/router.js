const KoaRouter = require('koa-router');
const router = new KoaRouter();
const apiPath = '/api'

router
    .get('/', ctx => ctx.render('index'))
    .get('/status',ctx => ctx.render('status'))
    .get('/about',ctx => ctx.render('about'))
    .get('/404',ctx => ctx.render('404'))
router
    .get(apiPath, async ctx => {ctx.body = "Welcome to Boxserver API!"})
    .get(apiPath+'/status', async ctx => {try{data.CurrentTime = new Date().toISOString();ctx.body = data}catch{ctx.body = {}}})
module.exports = router;