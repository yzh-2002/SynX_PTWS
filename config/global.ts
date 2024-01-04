export const MOCK_PORT = 3001
export const API_ENTRY = '/api'

const TARGET = {
    // 本地测试环境
    DEV: `http://127.0.0.1:${MOCK_PORT}`,
    // 线上测试环境
    TEST_ENV: '',
    // 线上环境
    PRODUCTION: ''
}
const proxy = {
    [API_ENTRY]: {
        // TODO:根据环境不同此处需调整
        target: TARGET['DEV'],
        changeOrigian: true,
        rewrite: (path:string) => path.replace(/^\/api/, "")
    }
}

export const PROXY = proxy
// 项目入口：web/mobile
export const entryKey ='mobile'