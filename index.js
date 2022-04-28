const http = require("http")
const https = require("https")
const Koa = require("koa")
const views = require('koa-views');
const serve = require('koa-static')
const mount = require('koa-mount')
const logger = require('koa-logger');
const bodyParser = require('koa-body');
const fs =require('fs')
const path = require('path')
const app = new Koa();

const router = require('./middleware/router');

var options;
try{
options = {
  key: fs.readFileSync(__dirname+'/Keys/key.pem'),
  cert: fs.readFileSync(__dirname+'/Keys/cert.pem')
};
}catch(err){
  console.error("Invalid or Missing Key and Cert",err)
}

//run server on ports defined on Phttp and Phttps
http.createServer(app.callback()).listen(process.env.PHttp || 80)
https.createServer(options, app.callback()).listen(process.env.PHttps || 443)
console.log(`Server Started`)

app.listen = () => {
  var server = http.createServer(this)
  return server.listen.apply(server, arguments)
}

app.on('error', err => {
  console.error('server error', err)
});

app.use(logger());

app.use(views(`${__dirname}/src/views`, {
  extension: 'ejs'
}));

app.use(mount('/public',serve(path.join(__dirname, './src/public'))))


app.use(router.routes());
app.use(router.allowedMethods());
app.use(bodyParser());

setInterval(()=>{require('./module/status')("test").then(res => {data = res})},30000)