const moment = require('moment');
const fs = require('fs')
module.exports = function (ctx,next){
    return async (ctx,next) => {
        const start = Date.now();
        try {
            await next();
        }
        finally {
            const ip = ctx.ips.length > 0 ? ctx.ips[0] : ctx.ip;
            const method = ctx.method;
            const url = ctx.originalUrl;
            const duration = Date.now() - start;
            const bytes = ctx.response.length || 0;
            const status = ctx.status;

            const logfile = process.env.logfile || "./logs.log"
            if(logfile == "")logfile = "./logs.log"

            const log = `[${moment().format('MMMM Do YYYY, h:mm:ss a')}] ${ip} (${method}) ${status} -> ${url} [${duration} ms | ${bytes} bytes]`
            fs.appendFile(process.env.logfile || "./logs.log",log + "\n", (err) => {if(err == null)return;console.error(err)})

            console.log(log)
        }
    }
}