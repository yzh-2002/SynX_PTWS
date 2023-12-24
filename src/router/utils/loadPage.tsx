import { ComponentType, ReactElement } from "react";
import { useRecoilValue } from "recoil";
import { isLoginSelector, userInfoState } from "../../store/login";
import { Navigate } from "react-router-dom";

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
                return <Navigate to={`/login?redirect=${encodeURIComponent(window.location.href)}`} />
            }
        }
    }
}

function withAuthCheck(Component: ComponentType<any>, callback: ReactElement): ComponentType<any> {
    return (props: any) => {
        const user = useRecoilValue(userInfoState)
        // TODO:props中access字段和user的关系
        let hasAuth = false
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

type ComponentImportType = ComponentType<any> | (() => Promise<{ default: ComponentType<any> }>)

export function loadPage(Component: ComponentImportType) {
    let c = Component as ComponentType<any>
    c = withAuthCheck(c, <PermissionDeny />)
    c = withLoginCheck(c)
    return c
}