const koa = require('koa')
const http = require("http")
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const session = require("koa-session")
// const CryptoJS = require('crypto-js')

const { getUserAccessToken, getUserInfo, test } = require("./login/handleLogin")

function CreateMockServer({ port }) {
    const app = new koa()
    app.use(bodyParser())
    const router = new Router()

    app.keys = ["yzh20020717"]
    const KoaSessionConfig = {
        key: "",
        maxAge: 2 * 3600 * 1000, //cookie过期时间，单位ms
        overwrite: true,
        httpOnly: true, //仅服务端可以获取cookie
        signed: true, //使用app.keys
        rolling: true, //每次请求时强行设置cookie，重置cookie过期时间
        renew: false, //当session将要过期时是否更新
    }
    app.use(session(KoaSessionConfig, app))

    router.post("/login", getUserAccessToken)
    router.get("/userinfo", getUserInfo)
    router.get("/test", test)
    app.use(router.routes()).use(router.allowedMethods())

    const server = http.createServer(app.callback())
    server.listen(port, () => {
        console.log()
        console.log(`Mock server is start, listening on port ${port}`)
        console.log()
    })
    return { server, app }
}

// 本地开发时注释掉
CreateMockServer({ port: 3001 })

// module.exports = CreateMockServer