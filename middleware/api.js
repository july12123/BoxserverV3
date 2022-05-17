const KoaRouter = require('koa-router');
const api = new KoaRouter();

api
    .get('/', async ctx => {ctx.body = "Welcome to Boxserver API!"})
    .get('/status', async ctx => {try{data.CurrentTime = new Date().toISOString();ctx.body = data}catch{ctx.body = {}}})

module.exports = api