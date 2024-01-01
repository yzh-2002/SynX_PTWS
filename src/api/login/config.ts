const loginUrl = `${window.location}`
export const appId = 'cli_a50c27156af8500c'
export const LarkAuthUrl = `https://open.feishu.cn/open-apis/authen/v1/index?redirect_uri=${encodeURIComponent(loginUrl)}&app_id=${appId}`