import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { message, Button, Card } from "antd"

import { LarkAuthUrl, appId, appSecret, loginUrl } from "@/api/login/config"
import { loginByLarkCode } from "@/api/login"
import { useLoginAction, userInfoState } from "@/store/login"
import { ApiError } from "@/api/error"
import PageLoading from "./PageLoading"
import SynXCopyright from "./SynXCopyright"
import UESTCSceneUrl from "@/assets/uestc_scene.jpg"

import { isLoginSelector } from "@/store/login"
import { useRecoilValue } from "recoil"
import { RoleHome } from "@/constants/app"
import { withBreakpoint, useBreakpoint } from "@/utils/breakpoints"


function Login() {
    let navigate = useNavigate()
    const loginAction = useLoginAction()
    const [loading, setLoading] = useState(true)
    const isLogin = useRecoilValue(isLoginSelector)
    const userInfo = useRecoilValue(userInfoState)
    const breakpoints = useBreakpoint()
    const loginByCode = async (code: string) => {
        // const params = new URLSearchParams(location.search)
        try {
            await loginAction(loginByLarkCode({
                clientId: appId,
                clientSecret: appSecret,
                redirectUri: loginUrl,
                code: code,
            }))
            if (isLogin) {
                // 登录失效之后返回首页，不再返回当前页面
                navigate(
                    // params.get("redirect") || 
                    `/app${RoleHome[userInfo?.identity]}`, { replace: true })
            } else {
                setLoading(false)
            }
        } catch (e: any) {
            if (e.code == ApiError.SERVER_DATA_FORMAT_ERROR) {
                // TODO:是否要跳转到一个备用页面
                message.error(e.toString())
            }
            setLoading(false)
        }
    }

    const tryAutoLogin = async () => {
        const params = new URLSearchParams(location.search)
        try {
            await loginAction()
            if (isLogin) {
                // replace，替换掉/login的路由记录，防止回退时反复进入login页面
                navigate(params.get("redirect") || `/app${RoleHome[userInfo?.identity]}`, { replace: true })
            } else {
                setLoading(false)
            }
        } catch (e: any) {
            if (e.code !== ApiError.NOT_LOGIN) {
                message.error(e.toString())
            }
            setLoading(false)
        }
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        if (!!window.h5sdk) {
            tryAutoLogin()
            // 飞书内部免登录
            window.h5sdk.ready(() => {
                tt.requestAuthCode({
                    appId: appId,
                    success(res: any) {
                        loginByCode(res?.code)
                    }
                })
            })
        } else {
            // 飞书外部
            if (params.get('code')) {
                loginByCode(params.get('code')!)
            } else {
                // setLoading(false)
                tryAutoLogin()
            }
        }
    }, [isLogin])

    const goLarkLoginPage = () => {
        const a = document.createElement('a')
        a.href = LarkAuthUrl
        a.click()
    }

    return (
        <div className="h-full">
            {loading ? (<PageLoading />) : (
                <div className="h-full flex flex-col justify-center items-center">
                    <Card
                        bodyStyle={{ padding: '32px 40px 12px 40px' }}
                        style={{ width: breakpoints.width < 520 ? breakpoints.width * 0.8 : '500px', margin: 'auto', marginTop: '96px', background: 'rgba(255,255,255, 0.9)' }}
                    >
                        <div className="mb-1">
                            <div style={{ height: '180px', margin: '0 0 20px 0' }}>
                                <img
                                    style={{ width: breakpoints.width < 520 ? breakpoints.width * 0.6 : '320px', margin: 'auto' }}
                                    src="https://sf1-scmcdn-tos.pstatp.com/goofy/ee/suite/passport/static/login/img/login-bg.bb9a66c0.svg"
                                    alt="飞书登录"
                                />
                            </div>
                            <Button
                                size={'large'} block type="primary"
                                onClick={goLarkLoginPage}
                            >前往飞书授权登录</Button>
                        </div>
                        <SynXCopyright />
                    </Card>
                    <div
                        className="h-full w-full"
                        style={{
                            backgroundImage: `url(${UESTCSceneUrl})`,
                            zIndex: -1,
                            opacity: 1,
                            position: "fixed",
                            backgroundPosition: "top center",
                            backgroundSize: "cover"
                        }} />
                </div>
            )}
        </div>
    )
}

export default withBreakpoint(Login)