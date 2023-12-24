const koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const CryptoJS = require('crypto-js')

const { getUserInfo } = require("./login/handleLogin")

const MOCK_PORT = 3001
const app = new koa()
app.use(bodyParser())
const router = new Router()

router.post("/loginbycode", getUserInfo)
app.use(router.routes()).use(router.allowedMethods())
app.listen(MOCK_PORT, () => {
    console.log(`Mock server is start, listening on port${MOCK_PORT}`)
})
