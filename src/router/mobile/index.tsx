import { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { loadPage } from "../utils/loadPage";
import { withBreakpoint } from "@/utils/breakpoints";

const OpenAccessLayout = loadPage(lazy(() => import("@/layouts/OpenAccessLayout")))
const Login = loadPage(lazy(() => import("../../views/App/Login")))
const App = loadPage(lazy(() => import("@/views/mobile/Admin/HomePage")))
const NotFound = lazy(() => import("@/router/utils/NotFound"))

let MobileLayout = loadPage(lazy(() => import("@/layouts/MobileLayout")))
MobileLayout = withBreakpoint(MobileLayout)


const ServiceList = lazy(() => import("@/views/mobile/Admin/Service"))
const ServiceDetail = lazy(() => import("@/views/mobile/Admin/ServiceDetail"))
const CreateService = lazy(() => import("@/views/mobile/Form/Service"))
const CreateTeach = lazy(() => import("@/views/mobile/Form/TeachInfo"))

const CreateStu = lazy(() => import("@/views/mobile/Form/StuInfo"))

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" />,
    },
    {
        path: '/login',
        element: <OpenAccessLayout {
            ...{
                openAccess: true,
                noRedirect: true
            }
        } />,
        children: [
            {
                index: true,
                element: <Login {
                    ...{
                        openAccess: true,
                        noRedirect: true
                    }
                } />
            }
        ]
    },
    {
        path: '/app',
        element: <MobileLayout openAccess />,
        children: [
            // 管理端首页
            {
                path: 'admin-home',
                element: <App access="admin" />,
            },
            {
                path: 'service', //导师匹配服务页面
                element: <ServiceList />
            },
            {
                path: 'service-detail', //详情页（管理员主体页面）
                element: <ServiceDetail />
            },
            {
                path: "create-service",
                element: <CreateService />
            },
            {
                path: 'create-round',
                element: <></>
            },
            {
                path: 'create-teach',
                element: <CreateTeach />
            },
            {
                path: 'create-stu',
                element: <CreateStu />
            }
        ]
    },
    {
        path: "/",
        element: <OpenAccessLayout {
            ...{
                openAccess: true,
                noRedirect: true
            }
        } />,
        children: [
            {
                path: '*',
                element: <NotFound />
            }
        ]
    }
], { basename: '/mobile' })

export default router