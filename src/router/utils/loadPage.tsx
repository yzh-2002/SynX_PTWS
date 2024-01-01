import { ComponentType, ReactElement } from "react";
import { useRecoilValue } from "recoil";
import { isLoginSelector, userInfoState } from "../../store/login";
import { Navigate } from "react-router-dom";
import { Result } from "antd";
import { ErrorBoundary } from "./ErrorBoundary";
import PermissionDeny from "./PermissionDeny";

function withLoginCheck(Component: ComponentType<any>): ComponentType<any> {
    return (props: any) => {
        const openAccess = !!props?.openAccess
        const noRedirect = !!props?.noRedirect
        const isLogin = useRecoilValue(isLoginSelector)
        if (openAccess || isLogin) {
            return (<Component {...props} />)
        } else {
            if (noRedirect) {
                return <Navigate to={'/login'} />
            } else {
                return <Navigate to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`} />
            }
        }
    }
}

function withAuthCheck(Component: ComponentType<any>, callback: ReactElement): ComponentType<any> {
    return (props: any) => {
        const user = useRecoilValue(userInfoState)
        // TODO:props中access字段和user的关系
        let hasAuth = true
        const openAccess = !!props?.openAccess
        if (openAccess) {
            hasAuth = true
        } else {

        }
        if (hasAuth) {
            return <Component {...props} />
        } else {
            return callback
        }
    }
}

// react-router-dom v6 无法处理内部错误，只能捕获路由错误（可以处理404）
function withErrorHandler(Component: ComponentType<any>): ComponentType<any> {
    return (props: any) => {
        return (
            // @ts-ignore
            <ErrorBoundary fallback={({ error: e }) => (
                <Result
                    status={'error'}
                    title={'渲染错误'}
                    subTitle={(e && e.toString()) || '未知错误'}
                />
            )}>
                <Component {...props} />
            </ErrorBoundary>
        )

    }
}


type ComponentImportType = ComponentType<any> | (() => Promise<{ default: ComponentType<any> }>)

export function loadPage(Component: ComponentImportType) {
    let c = Component as ComponentType<any>
    c = withAuthCheck(c, <PermissionDeny />)
    c = withLoginCheck(c)
    c = withErrorHandler(c)
    return c
}