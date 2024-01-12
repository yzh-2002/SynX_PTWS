import { useCallback } from 'react'
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'
import { getUserInfo } from '@/api/login'
import { ApiError } from '@/api/error'
import { UserInfoType } from '@/objects/user'

export const userInfoState = atom<UserInfoType>({
    key: 'userInfo',
    default: {
        createdTime: NaN,
        creatorId: "",
        id: "",
        name: "",
        password: "",
        gender: NaN,
        mail: "",
        code: "",
        identity: "",
    }
})

export const isLoginSelector = selector({
    key: 'isLogin',
    get: ({ get }) => {
        const selfInfo = get(userInfoState)
        return !!selfInfo.id
    }
})

export function useLoginAction() {
    const isLogin = useRecoilValue(isLoginSelector)
    const [userInfo, setUserInfo] = useRecoilState(userInfoState)
    // 无论免登录还是手动授权登录，最终都要通过code登录
    return useCallback(async (loginApi?: Promise<void>) => {
        if (isLogin) return userInfo
        try {
            if (loginApi) {
                await loginApi
            }
            let { userInfo } = await getUserInfo()
            setUserInfo(userInfo)
        } catch (e: any) {
            if (e.code === ApiError.NOT_LOGIN) {
                const error = new ApiError(e, ApiError.NOT_LOGIN, '登录失败：服务错误，请联系管理员')
                throw error
            } else {
                throw e
            }
        }
    }, [isLogin, userInfo])
}
