export const loginUrl = window.location.toString()
export const appId = 'cli_a3d1746d1bb8d00e'
// TODO:应用密钥应存储在后端，不应由前端传递
export const appSecret = 'uPvSUdkSQ7OBw2jMCKFX3e6jEmZ0qlAt'

// FIXME:防止出现多个code的情况
const getRedirectUri = () => {
    const currrntUrl = window.location.href
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('code')) {
        urlParams.delete('code')
    }
    const newUrl = currrntUrl.split('?')[0] + '?' + urlParams.toString()
    return newUrl
}

export const LarkAuthUrl = `https://open.feishu.cn/open-apis/authen/v1/index?redirect_uri=${encodeURIComponent(getRedirectUri())}&app_id=${appId}`