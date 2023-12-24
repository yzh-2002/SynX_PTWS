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
    ctx.body = res?.data || {}
    return res?.data || {}
}

// 根据refresh_token获取user_access_token（用户无感刷新）

// 根据user_access_token获取用户身份信息
async function getUserInfo(ctx) {
    let data = await getUserAccessToken(ctx)
    console.log(data?.data?.access_token)
    const res = await axios.get("https://open.feishu.cn/open-apis/authen/v1/user_info", {
        headers: {
            "Authorization":`Bearer ${data?.data?.access_token}`
        }
    })
    console.log(res?.data)
    ctx.body =res?.data || {}
    return res?.data
}


module.exports = { getAppAccessToken, getUserAccessToken, getUserInfo }