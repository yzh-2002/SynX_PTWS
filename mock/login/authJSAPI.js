const axios = require('axios')

const LoginUtil =require('./utils')
const config =require('./config')

// 服务端从认证中心获取鉴权参数，用于用户向飞书客户端鉴权
async function getAuthParam(ctx){
    LoginUtil.allowCDR(ctx)
    // (1) 根据AppID和App Secret从认证中心获取access_token
    // url：https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal
    const res =await axios.post("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",{
        "app_id":config.app_id,
        "app_secret":config.app_secret
    },{
        headers:{
            "Content-Type": "application/json"
        }
    })

    // (2) 根据access_token获取jsapi_ticket
    
}