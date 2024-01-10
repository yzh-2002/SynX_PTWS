import { API_CODE_KEY, API_MSG_KEY } from "./request"

// from legato in joyta
const ERROR_CODE = {
    UNKNOWN: 9999,
    EMPTY_RESPONSE: 1000,
    SERVER_ERROR: 1001,
    UPLOAD_ERROR: 1002,
    PERMISSION_DENY: 1004,
    SERVER_DATA_FORMAT_ERROR: 1005,
    TIMEOUT: 1100,
    NOT_LOGIN: -1,
    // 双选系统中未接入验证码
    INCORRECT_CAPTCHA: -3
}

interface ErrorMap {
    [key: string]: string
}

const ERROR_MESSAGE: ErrorMap = {
    [ERROR_CODE.UNKNOWN]: '未知错误',
    [ERROR_CODE.EMPTY_RESPONSE]: '服务器未响应',
    [ERROR_CODE.SERVER_ERROR]: '服务报错（未知错误）',
    [ERROR_CODE.NOT_LOGIN]: '登录过期，请重新登录',
    [ERROR_CODE.SERVER_DATA_FORMAT_ERROR]: '数据格式错误',
    [ERROR_CODE.TIMEOUT]: '服务器未响应: 访问超时',
    [ERROR_CODE.INCORRECT_CAPTCHA]: '验证码错误',
    [ERROR_CODE.PERMISSION_DENY]: '当前用户暂无权限'
}

export interface ApiErrorType extends Error {
    code: number | string,
    raw: any
}

export class ApiError extends Error implements ApiErrorType {
    static UNKNOWN = ERROR_CODE.UNKNOWN
    static EMPTY_RESPONSE = ERROR_CODE.EMPTY_RESPONSE
    static SERVER_ERROR = ERROR_CODE.SERVER_ERROR
    static SERVER_DATA_FORMAT_ERROR = ERROR_CODE.SERVER_DATA_FORMAT_ERROR
    static NOT_LOGIN = ERROR_CODE.NOT_LOGIN
    static TIMEOUT = ERROR_CODE.TIMEOUT
    static INCORRECT_CAPTCHA = ERROR_CODE.INCORRECT_CAPTCHA

    code: number | string
    raw: any

    constructor(e: any, code?: number | string, message?: string) {
        super()
        this.code = NaN
        this.message = ''
        // console.log('create ApiError', e, code)
        // console.dir(e)

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError)
        }

        this.name = 'ApiError'

        Object.defineProperty(this, 'raw', {
            value: e,
            writable: false,
            enumerable: false,
        })

        const codeIsNaN = typeof code === 'number' && isNaN(code)
        switch (true) {
            case !(e instanceof Object):
                // 文字错误信息
                this.message = e == null ? '' : String(e)
                break
            case e instanceof ApiError && !message && (code == null || codeIsNaN):
                // 不创建新错误
                return e
            case e.isAxiosError:
                // axios上报的网络错误
                switch (true) {
                    case e.code === 'ECONNABORTED':
                        this.code = ApiError.TIMEOUT
                        break
                    case !(e.response instanceof Object):
                        this.code = ApiError.EMPTY_RESPONSE
                        break
                    case e.response.data instanceof Object:
                        this.message = e.response.data[API_MSG_KEY]
                        this.code = e.response.data[API_CODE_KEY]
                        break
                }
                if (!this.code) {
                    this.message = `HTTP Error: ${e.response.status} ${e.response.statusText}`
                    this.code = e.response.status
                }
                break
            case e instanceof Error:
                // Http状态码错误或前端错误
                this.message = e.message
                break
            case (e[API_MSG_KEY] != null) || (e[API_CODE_KEY] != null):
                // 接口内报错
                // console.log('ajax error', e)
                this.message = e[API_MSG_KEY]
                this.code = e[API_CODE_KEY]
                break
        }

        if ((code != null) && !codeIsNaN) {
            this.code = code
        }
        if (message) {
            // console.log('set message')
            this.message = message
        } else if (this.code in ERROR_MESSAGE && !this.message) {
            this.message = ERROR_MESSAGE[this.code]
        }

        if (!this.message) {
            this.message = ERROR_MESSAGE[ERROR_CODE.SERVER_ERROR]
        }
        if (this.code === '' || (typeof this.code === 'number' && isNaN(this.code)) || this.code == null) {
            this.code = ERROR_CODE.SERVER_ERROR
        }
        // console.log('done', this.code, this.message)
    }

    toString() {
        return this.message
    }
}

export function errorToString(e: any): string {
    if (e instanceof Object && e.errorFields) {
        return '表单验证错误'
    }
    return e == null ? '未知错误' : e.toString()
}