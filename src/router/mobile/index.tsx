import { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { loadPage } from "../utils/loadPage";
import { withBreakpoint } from "@/utils/breakpoints";

const OpenAccessLayout = loadPage(lazy(() => import("@/layouts/OpenAccessLayout")))
const Login = loadPage(lazy(() => import("../../views/App/Login")))
const NotFound = lazy(() => import("@/router/utils/NotFound"))

let MobileLayout = loadPage(lazy(() => import("@/layouts/MobileLayout")))
MobileLayout = withBreakpoint(MobileLayout)

const AdminHome = loadPage(lazy(() => import("@/views/mobile/Admin/HomePage")))
const ServiceList = loadPage(lazy(() => import("@/views/mobile/Admin/Service")))
const ServiceDetail = loadPage(lazy(() => import("@/views/mobile/Admin/ServiceDetail")))
const CreateService = loadPage(lazy(() => import("@/views/mobile/Form/Service")))
const CreateTeach = loadPage(lazy(() => import("@/views/mobile/Form/TeachInfo")))
const CreateStu = loadPage(lazy(() => import("@/views/mobile/Form/StuInfo")))
const CreateRound = loadPage(lazy(() => import("@/views/mobile/Form/Round")))
const SpecifyStu = loadPage(lazy(() => import("@/views/mobile/Admin/SpecifyStu")))

const StuHome = loadPage(lazy(() => import("@/views/mobile/Student/HomePage")))
const StuRoundList = loadPage(lazy(() => import("@/views/mobile/Student/RoudList")))
const StuRoundResult = loadPage(lazy(() => import("@/views/mobile/Student/RoundResult")))
const StuRoundDetail = loadPage(lazy(() => import("@/views/mobile/Student/RoundDetail")))

const TeachHome = loadPage(lazy(() => import("@/views/mobile/Teach/HomePage")))
const TeachRoundResult = loadPage(lazy(() => import("@/views/mobile/Teach/RoundResult")))
const TeachRoundList = loadPage(lazy(() => import("@/views/mobile/Teach/RoudList")))
const TeachRoundDetail = loadPage(lazy(() => import("@/views/mobile/Teach/RoundDetail")))


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
                element: <AdminHome access="admin" />,
            },
            {
                path: 'service', //导师匹配服务页面
                element: <ServiceList access="admin" />
            },
            {
                path: 'service-detail', //详情页（管理员主体页面）
                element: <ServiceDetail access="admin" />
            },
            {
                path: "create-service",
                element: <CreateService access="admin" />
            },
            {
                path: 'create-round',
                element: <CreateRound access="admin" />
            },
            {
                path: 'create-teach',
                element: <CreateTeach access="admin" />
            },
            {
                path: 'create-stu',
                element: <CreateStu access="admin" />
            },
            {
                path: 'specify-stu',
                element: <SpecifyStu access="admin" />
            },
            // 学生端
            {
                path: 'stu-home',
                element: <StuHome access="student" />
            },
            {
                path: 'stu-round-list',
                element: <StuRoundList access="student" />
            },
            {
                path: 'stu-round-result',
                element: <StuRoundResult access="student" />
            },
            {
                path: 'stu-round-detail',
                element: <StuRoundDetail access="student" />
            },
            // 教师端
            {
                path: 'tutor-home',
                element: <TeachHome access="teacher" />
            },
            {
                path: 'tutor-round-result',
                element: <TeachRoundResult access="teacher" />
            },
            {
                path: 'tutor-round-list',
                element: <TeachRoundList access="teacher" />
            },
            {
                path: 'tutor-round-detail',
                element: <TeachRoundDetail access="teacher" />
            },
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