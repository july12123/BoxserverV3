const http = require("http")
const https = require("https")
const Koa = require("koa")
const views = require('koa-views');
const serve = require('koa-static')
const mount = require('koa-mount')
const bodyParser = require('koa-body');
const favicon = require('koa-favicon');
const fs = require('fs')
const path = require('path')
const app = new Koa();

require('dotenv').config();

const router = require('./middleware/router');
const logger = require('./middleware/logger')

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

const httpServe = http.createServer(app.callback())
const httpsServer = https.createServer(options, app.callback())
httpServe.listen(process.env.PHttp || 80,process.env.hostname || "0.0.0.0")
httpsServer.listen(process.env.PHttps || 443,process.env.hostname || "0.0.0.0")
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
app.use(favicon(path.join(__dirname, '/src/public/favicon.ico')));
app.use(mount('/public',serve(path.join(__dirname, '/src/public'))))


app.use(router.routes());
app.use(router.allowedMethods());
app.use(bodyParser());

setInterval(()=>{require('./module/status')("test").then(res => {res.LastUpdated = new Date().toISOString();data = res})},30000)