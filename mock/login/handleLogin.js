const axios = require('axios')
const { config } = require('./config')

// 获取app_access_token（此步骤也可获取tenant_access_token）
async function getAppAccessToken(ctx) {
    const res = await axios.post("https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal", {
        "app_id": config.appId,
        "app_secret": config.appSecret
    })
    return res.data
}


// 根据前端获取的授权码code获取应用登录态（user_access_token）
// 此步骤种cookie
async function getUserAccessToken(ctx) {
    let data = await getAppAccessToken(ctx)
    const res = await axios.post("https://open.feishu.cn/open-apis/authen/v1/oidc/access_token", {
        "grant_type": "authorization_code",
        "code": ctx.request.body?.code
    }, {
        headers: {
            "Authorization": `Bearer ${data?.app_access_token}`
        }
    })
    if (res?.data?.data) {
        ctx.session.userinfo = res?.data?.data
        ctx.cookies.set('lark_token', res?.data?.data?.access_token, {
            domain: '', //默认为当前请求域名
            path: '', //默认为“/”
            maxAge: 2 * 3600 * 1000,
            httpOnly: true,
            overwrite: true
        })
        ctx.body = {
            ...(res?.data || {}),
            code: 1,
        }
    } else {
        ctx.body = {
            code: -2
        }
    }
    return
}

// 根据refresh_token获取user_access_token（用户无感刷新）

// 根据user_access_token获取用户身份信息
// 此步骤需要验证用户是否登录
async function getUserInfo(ctx) {
    // let data = await getUserAccessToken(ctx)
    const data = ctx.session.userinfo
    const lark_token = ctx.cookies.get("lark_token") || ""
    if (data && data.access_token && lark_token?.length > 0 && data.access_token == lark_token) {
        const res = await axios.get("https://open.feishu.cn/open-apis/authen/v1/user_info", {
            headers: {
                "Authorization": `Bearer ${data?.access_token}`
            }
        })
        ctx.body = {
            ...(res?.data || {}),
            code: 1
        }
        return
    }
    // 未登录
    ctx.body = {
        code: -1,
        msg: '用户未登录！'
    }
    return
}


module.exports = { getAppAccessToken, getUserAccessToken, getUserInfo }