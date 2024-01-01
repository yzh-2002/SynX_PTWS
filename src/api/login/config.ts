// 不加query（修复双重code的情况...）
// TODO：此处添加port，后续上线要去除
export const loginUrl = `http://${window.location.hostname}:${window.location.port}${window.location.pathname}`
export const appId = 'cli_a50c27156af8500c'
export const LarkAuthUrl = `https://open.feishu.cn/open-apis/authen/v1/index?redirect_uri=${encodeURIComponent(loginUrl)}&app_id=${appId}`