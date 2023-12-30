import { api } from "../request";
import { UserInfoType } from "@/objects/user";


export const loginByLarkCode = api<{ code: string }, void>({
    method: 'POST',
    url: '/login'
})

export const getUserInfo = api<void, { user: UserInfoType }>({
    method: 'GET',
    url: '/userinfo'
}, (res: any) => {
    return {
        user: {
            id: res?.open_id,
            name: res?.name,
            avatar: res?.avatar_url
        }
    }
})
