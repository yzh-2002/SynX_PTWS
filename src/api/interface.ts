import { AxiosRequestConfig, Method } from "axios";

export interface RequestConfig extends AxiosRequestConfig {
    url: string,
    method: Method
}
export interface NotificationProps {
    title?: string,
}

export interface ApiExecuteOptions {
    message?: boolean, //错误=>使用antd的message提示
    notification?: boolean | NotificationProps, //错误=>使用antd的notification提示
    silent?: boolean, //错误不提示不报错
    success?: boolean | string, //成功提示
}