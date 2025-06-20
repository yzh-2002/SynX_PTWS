import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { RequestConfig, ApiExecuteOptions, UploadRequestConfig } from "./interface";
import { API_ENTRY } from "../../config/global"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isLoginSelector, userInfoState } from "@/store/login";
import { useCallback } from "react";
import { message, notification } from "antd";
import { ApiError, errorToString } from "./error";
import { useNavigate } from "react-router-dom";

export const API_SUCCESS_CODE = 1
export const API_MSG_KEY = 'message'
export const API_CODE_KEY = 'status'
export const API_DATA_KEY = 'data'
export const TimeoutMillisecond = 60 * 1000

export async function ajax<Return = void>(config: AxiosRequestConfig): Promise<Return> {
    try {
        config = {
            ...config,
            url: `${API_ENTRY}/` + config.url?.split("/").filter(v => !!v).join("/"),
            timeout: TimeoutMillisecond
        }
        let res: any = await axios(config)
        if (res.data instanceof Blob) {
            let resInfo = await res.data.text()
            try {
                resInfo = JSON.parse(resInfo)
            } catch (e: any) {
                return res
            }
            // 解析成功说明返回的不是文件而是错误提示信息，故throw出去
            throw resInfo
        }
        if (!(res.data instanceof Object) || res.data[API_CODE_KEY] != API_SUCCESS_CODE) {
            throw res.data
        } else {
            return res.data[API_DATA_KEY]
        }
    } catch (e: any) {
        const error = new ApiError(e)
        throw error
    }
}

export function uploadFile<Return = void>({
    url, method = 'POST', onUploadProgress, file, fileName, key = "file", params, extra = {}
}: UploadRequestConfig): Promise<Return> {
    let formdata = new FormData()
    let fileKey = key || 'file'
    formdata.append(fileKey, file, file instanceof File ? file.name : fileName || '')

    Object.entries(extra).forEach(([k, v]) => {
        formdata.append(k, v)
    })

    return ajax<Return>({
        method: method,
        url: url || '',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        // ajax用法基本等价于axios，故需要考虑不同类型参数的传递位置
        // api函数封装后默认POST请求参数全部在data，GET请求参数全部在params
        data: formdata,
        params: params,
        onUploadProgress
    })
}

export async function downloadFile({ method = 'GET', ...args }: AxiosRequestConfig) {
    const res = await ajax<AxiosResponse>({
        ...args,
        method: method,
        // FIXME：添加responseType会使得后端返回的错误提示信息也转为blob类型从而无法捕获错误信息
        // 故需要在ajax函数中处理
        responseType: 'blob'
    })
    const headers = res.headers || {}
    const disposition = headers['content-disposition'] || ''
    // disposition内容采用了RFC 5987扩展语法，也即实际内容为：
    // content-disposition: attachment;filename*=[encode]''[filename] 
    const fileType = headers['content-type'] || ''
    console.log(fileType)
    let fileName = '导师匹配管理系统下载文件.xlsx' //默认文件名
    const matches = /filename\*=utf-8''(.+)/.exec(disposition)
    if (matches && matches[1]) {
        const encodedFileName = matches[1]
        fileName = decodeURIComponent(encodedFileName)
    }
    let blob = new Blob([res.data], { type: fileType })
    // let blob = res.data.blob()
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a)
    return res
}

/**
 * @param apiConfig 请求函数配置
 * @param callback 处理返回结果（e.g. ...）
 * @param preprocess 参数预处理（e.g. 设置默认值）
 * @returns 封装后的请求函数
 */
export function api<ParamsType = void, Return = void>(
    apiConfig: RequestConfig | ((params: ParamsType) => Promise<Return>),
    callback?: (res: any) => Return,
    preprocess?: (params: ParamsType) => any
): (params: ParamsType, config?: ApiExecuteOptions) => Promise<Return> {
    let func: (params: ParamsType) => Promise<Return>
    if (apiConfig instanceof Function) {
        // skip：无需处理，直接使用apiConfig请求函数
        func = apiConfig
    } else {
        func = async function (params: ParamsType) {
            let res: any
            if (params instanceof Object) {
                const paramKey = apiConfig.method.toString().toUpperCase() === 'GET'
                    ? 'params' : 'data'
                // 针对不同请求类型设置对应参数字段
                // 缺点：POST请求无法query和body参数一起使用
                // 此时可直接传自定义函数实现，也即apiConfig instanceof Function的情况
                const paramsConfig = apiConfig[paramKey]
                    ? { [paramKey]: { ...params, ...apiConfig[paramKey] } }
                    : { [paramKey]: params }
                const axiosConfig = Object.assign({}, apiConfig, paramsConfig)
                res = await ajax(axiosConfig)
            } else {
                res = await ajax(apiConfig)
            }
            return res
        }
    }
    return async (params: ParamsType) => {
        if (preprocess instanceof Function) {
            params = preprocess(params)
        }
        const res = await func(params)
        if (callback instanceof Function) {
            return callback(res)
        } else {
            return res
        }
    }
}


// 提供登录状态检查+提示信息处理
export function useApi<FnType extends (...v: any) => any>(fn: FnType) {
    const isLogin = useRecoilValue(isLoginSelector)
    const setUserInfo = useSetRecoilState(userInfoState)
    const navigator = useNavigate()
    type DataType = Awaited<ReturnType<FnType>>
    return useCallback((params?: Parameters<FnType>[0] | null, options?: ApiExecuteOptions) => {
        let {
            message: emitMessage = false,
            notification: emitNotification = false,
            success = false as boolean | string,
        } = options || {}
        if (success === true) {
            // 默认文案，也可自定义
            success = '操作成功'
        }
        return new Promise<DataType>((resolve: (v: DataType) => void, reject) => {
            fn(params).then((res: DataType) => {
                if (success) {
                    message.success(success)
                }
                resolve(res)
            }).catch((e: any) => {
                if (e.code === ApiError.NOT_LOGIN) {
                    // 登录失效
                    message.error('登录失效，请重新登录')
                    emitMessage = false
                    emitNotification = false
                    setTimeout(() => {
                        setUserInfo({
                            createdTime: NaN,
                            creatorId: "",
                            id: "",
                            name: "",
                            password: "",
                            gender: NaN,
                            mail: "",
                            code: "",
                            identity: "",
                        })
                        navigator("/login")
                    }, 2000)
                } else {
                    const errorText = errorToString(e)
                    if (emitMessage) {
                        message.error(errorText)
                    }
                    if (emitNotification) {
                        const props = emitNotification instanceof Object
                            ? { message: emitNotification.title || '服务报错', description: errorText }
                            : { message: '服务报错', description: errorText }
                        notification.error(props)
                    }
                    reject(e)
                }
            })
        })
    }, [isLogin])
}