export const MOCK_PORT = 3001
export const API_ENTRY = '/api/biz/v1'


export const TARGET = {
    // 本地测试环境
    DEV: `http://127.0.0.1:${MOCK_PORT}`,
    // 线上测试环境
    TEST_ENV: 'http://106.75.142.195',
    // 线上环境
    PRODUCTION: ''
}

// 根据环境不同此处需调整
export const env = 'TEST_ENV'

const proxy = {
    [API_ENTRY]: {
        target: TARGET[env],
        changeOrigian: true,
        // rewrite: (path: string) => path.replace(new RegExp("/^" + API_ENTRY + "/"), "")
    }
}

export const PROXY = proxy
// 项目入口：web/mobile
export const entryKey = 'web'