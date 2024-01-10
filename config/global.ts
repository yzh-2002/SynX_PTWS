export const MOCK_PORT = 3001
export const API_ENTRY = '/api/biz/v1'


const TARGET = {
    // 本地测试环境
    DEV: `http://127.0.0.1:${MOCK_PORT}`,
    // 线上测试环境
    TEST_ENV: 'http://121.37.1.63',
    // 线上环境
    PRODUCTION: ''
}
const proxy = {
    [API_ENTRY]: {
        // TODO:根据环境不同此处需调整
        target: TARGET['TEST_ENV'],
        changeOrigian: true,
        // rewrite: (path: string) => path.replace(new RegExp("/^" + API_ENTRY + "/"), "")
    }
}

export const PROXY = proxy
// 项目入口：web/mobile
export const entryKey = 'web'