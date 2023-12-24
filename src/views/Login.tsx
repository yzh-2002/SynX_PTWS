import { useEffect } from "react"
import { useRequest } from "ahooks"

import { LarkAuthUrl, appId } from "../api/login/config"
import LoginApi from '../api/login/login'

const { loginByCode } = LoginApi

function Login() {
    const { run } = useRequest(loginByCode, { manual: true })

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        // （1） 判断第三方是否存有登录状态
        // TODO
        // （2） 没有=>判断是否在飞书内部
        if (!!window.h5sdk) {
            // 检测到JSAPI，飞书内部，默认免登录
            window.h5sdk.ready(() => {
                tt.requestAuthCode({
                    appId: appId,
                    success(res: any) {
                        run({ code: res.code })
                    }
                })
            })

        } else {
            // （4）不再飞书内部则展示UI，用户可选择跳转登录页登录或账号密码登录
        }
        if (params.get('code')) {
            let res = run({
                code: params.get('code')
            })
            if (res?.code === 0) {
                // TODO：更新全局用户信息
            }
        } else {
            // (1)
            // 

        }
    }, [])

    const goLarkLoginPage = () => {
        const a = document.createElement('a')
        a.href = LarkAuthUrl
        a.click()
    }

    return (
        <div className="h-full flex justify-center items-center">
            <button className='text-orange-600' onClick={goLarkLoginPage}>Login</button>
        </div>
    )
}

export default Login