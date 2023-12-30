const koa = require('koa')
const http = require("http")
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const CryptoJS = require('crypto-js')

const { getUserInfo } = require("./login/handleLogin")

function CreateMockServer({ port }) {
    const app = new koa()
    app.use(bodyParser())
    const router = new Router()

    router.post("/loginbycode", getUserInfo)
    app.use(router.routes()).use(router.allowedMethods())

    const server = http.createServer(app.callback())
    server.listen(port, () => {
        console.log()
        console.log(`Mock server is start, listening on port ${port}`)
        console.log()
    })
    return { server, app }
}

module.exports = CreateMockServer