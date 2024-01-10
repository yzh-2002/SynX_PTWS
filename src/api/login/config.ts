// 不加query（修复双重code的情况...）
// TODO：此处添加port，后续上线要去除
export const loginUrl = `http://${window.location.hostname}:${window.location.port}${window.location.pathname}`
export const appId = 'cli_a3d1746d1bb8d00e'
// TODO:应用密钥应存储在后端，不应由前端传递
export const appSecret ='uPvSUdkSQ7OBw2jMCKFX3e6jEmZ0qlAt'
export const LarkAuthUrl = `https://open.feishu.cn/open-apis/authen/v1/index?redirect_uri=${encodeURIComponent(loginUrl)}&app_id=${appId}`