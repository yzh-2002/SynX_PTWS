import { useCallback } from 'react'
import { atom, selector, useRecoilState, useRecoilValue } from 'recoil'

export const userInfoState = atom({
    key: 'userInfo',
    default: {
        id: '',
        name: '',
        avator: ''
    }
})

export const isLoginSelector = selector({
    key: 'isLogin',
    get: ({ get }) => {
        // const userInfo = get(userInfoState)
        return false
    }
})

export function useLoginAction() {
    const isLogin = useRecoilValue(isLoginSelector)
    const [userInfo, setUserInfo] = useRecoilState(userInfoState)
    return useCallback(async (loginApi?: Promise<void>) => {
        if (isLogin) return userInfo
        try {
            if (loginApi) {
                await loginApi
            }
            // let { user: userInfo } = await getUserInfo()
            // setUserInfo(userInfo)
        } catch (error) {

        }
    }, [isLogin, userInfo])
}
