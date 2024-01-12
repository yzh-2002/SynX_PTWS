import { api } from "../request";
import { UserInfoType, LoginParams } from "@/objects/user";


export const loginByLarkCode = api<LoginParams, void>({
    method: 'POST',
    url: '/login'
})


export const getUserInfo = api<void, { userInfo: UserInfoType }>({
    method: 'GET',
    url: '/user/self-info'
})

// FIXME:前端本地Mock时测试接口
export const test = api({
    method: "GET",
    url: '/test'
})
