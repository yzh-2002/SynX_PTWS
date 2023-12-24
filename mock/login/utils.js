function allowCDR(ctx) {
    ctx.set("Access-Control-Allow-Origin", ctx.headers.origin)
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
    ctx.set("Access-Control-Allow-Credentials", "true");  //表示是否允许发送Cookie
    ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
}

module.exports ={ allowCDR }