import { api } from "../request";
import { UserInfoType, LoginParams } from "@/objects/user";


export const loginByLarkCode = api<LoginParams, void>({
    method: 'POST',
    url: '/login'
})

// TODO:后端接口尚未开发
// export const getUserInfo = api<void, { user: UserInfoType }>({
//     method: 'GET',
//     url: '/userinfo'
// })

export const test = api({
    method: "GET",
    url: '/test'
})
