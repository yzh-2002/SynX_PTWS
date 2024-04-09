import { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { loadPage } from "../utils/loadPage";
import { withBreakpoint } from "@/utils/breakpoints";

const OpenAccessLayout = loadPage(lazy(() => import("@/layouts/OpenAccessLayout")))
const Login = loadPage(lazy(() => import("@/views/App/Login")))
const NotFound = lazy(() => import("@/router/utils/NotFound"))

let AppLayout = loadPage(lazy(() => import("@/layouts/AppLayout")))
AppLayout = withBreakpoint(AppLayout)

const AdminHomePage = loadPage(lazy(() => import("@/views/web/Admin/HomePage")))
const TeachStuInfo = loadPage(lazy(() => import("@/views/web/Admin/TeachStuInfo")))
const RoundInfo = loadPage(lazy(() => import("@/views/web/Admin/RoundInfo")))
const MSInfo = loadPage(lazy(() => import("@/views/web/Admin/MSInfo")))

const StuHomePage = loadPage(lazy(() => import("@/views/web/Student/HomePage")))
const StuTask = loadPage(lazy(() => import("@/views/web/Student/Task")))

const TeachHomePage = loadPage(lazy(() => import("@/views/web/Teacher/HomePage")))
const TeachTask = loadPage(lazy(() => import("@/views/web/Teacher/Task")))

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
        element: <AppLayout openAccess={true} />,
        children: [
            {
                path: 'admin-home',
                element: <AdminHomePage access={'admin'} />
            },
            {
                path: "round-info",
                element: <RoundInfo access={'admin'} />
            },
            {
                path: "teach-stu-info",
                element: <TeachStuInfo access={'admin'} />
            },
            {
                // mutual select
                path: "ms-info",
                element: <MSInfo access={'admin'} />
            },
            // 学生端
            {
                path: 'stu-home',
                element: <StuHomePage access="student" />
            },
            {
                path: 'stu-task',
                element: <StuTask access='student' />
            },
            // 教师端
            {
                path: 'tutor-home',
                element: <TeachHomePage access="teacher" />
            },
            {
                path: 'teach-task',
                element: <TeachTask access='teacher' />
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
])

export default router