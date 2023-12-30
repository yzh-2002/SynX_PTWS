import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { message } from "antd"

import { LarkAuthUrl, appId } from "@/api/login/config"
import { loginByLarkCode } from "@/api/login"
import { useLoginAction } from "@/store/login"
import { ApiError } from "@/api/error"


function Login() {
    let navigate = useNavigate()
    const loginAction = useLoginAction()
    const loginByCode = async (code: string) => {
        await loginAction(loginByLarkCode({
            code: code,
        }))
        navigate("/app")
    }

    const tryAutoLogin = async () => {
        try {
            await loginAction()
            navigate("/app")
        } catch (e: any) {
            if (e.code !== ApiError.NOT_LOGIN) {
                message.error(e.toString())
            }
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        // 飞书内部免登录
        if (!!window.h5sdk) {
            window.h5sdk.ready(() => {
                tt.requestAuthCode({
                    appId: appId,
                    success(res: any) {
                        loginByCode(res?.code)
                    }
                })
            })
        }
        if (params.get('code')) {
            loginByCode(params.get('code')!)
        } else {
            tryAutoLogin()
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