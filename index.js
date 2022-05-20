const http = require("http")
const https = require("https")
const Koa = require("koa")
const views = require('koa-views');
const serve = require('koa-static')
const mount = require('koa-mount')
const favicon = require('koa-favicon');
const fs = require('fs')
const path = require('path')
const cors = require('@koa/cors');
const api = new Koa();
const app = new Koa();

require('dotenv').config();

const rapi = require('./middleware/api');
const router = require('./middleware/router');
const logger = require('./middleware/logger');

var options;
try{options = {
  key: fs.readFileSync(__dirname+'/Keys/key.pem'),
  cert: fs.readFileSync(__dirname+'/Keys/cert.pem')
}}catch(err){console.error("Invalid or Missing Key and Cert",err)}



//api
console.log("starting api")
const apiHttps = https.createServer(options, api.callback());apiHttps.listen(process.env.apiHttps || 8081,process.env.hostname || "0.0.0.0")
api.listen = () => {var apiserver = https.createServer(this);return apiserver.listen.apply(apiserver, arguments)}
api.on('error',err =>{console.error('api error', err)})
api.use(logger())
api.use(cors());
api.use(rapi.routes())
console.log("api started")



//website
console.log(`starting website`)
const httpServer = http.createServer(app.callback());httpServer.listen(process.env.Http || 80,process.env.hostname || "0.0.0.0")
const httpsServer = https.createServer(options, app.callback());httpsServer.listen(process.env.Https || 443,process.env.hostname || "0.0.0.0")
app.listen = () => {var server = http.createServer(this);return server.listen.apply(server, arguments)}
app.on('error', err => {console.error('website error', err)});

app.use(logger());
app.use(favicon(path.join(__dirname, '/src/public/favicon.ico')));
app.use(mount('/public',serve(path.join(__dirname, '/src/public'))))

app.use(views(`${__dirname}/src/views`, {extension: 'ejs'}));
app.use(router.routes());
console.log('website started')


//api stuff

require('./module/status')("test").then(res => {res.LastUpdated = new Date().toISOString();data = res})

setInterval(()=>{require('./module/status')("test").then(res => {res.LastUpdated = new Date().toISOString();data = res})},15000)