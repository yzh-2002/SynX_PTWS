import { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { loadPage } from "../utils/loadPage";
import { withBreakpoint } from "@/utils/breakpoints";

const OpenAccessLayout = loadPage(lazy(() => import("@/layouts/OpenAccessLayout")))
const Login = loadPage(lazy(() => import("../../views/App/Login")))
const NotFound = lazy(() => import("@/router/utils/NotFound"))

let AppLayout = loadPage(lazy(() => import("@/layouts/AppLayout")))
AppLayout = withBreakpoint(AppLayout)

//TODO:Test
// const Round = lazy(() => import("@/views/web/Components/Form/Round"))
// const CollapseCard = lazy(() => import("@/views/web/Components/CollapseCard"))
const AdminHomePage = lazy(() => import("@/views/web/Admin/HomePage"))
const TeachStuInfo = lazy(() => import("@/views/web/Admin/TeachStuInfo"))
const RoundInfo = lazy(() => import("@/views/web/Admin/RoundInfo"))
const MSInfo = lazy(() => import("@/views/web/Admin/MSInfo"))

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
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <AdminHomePage />
            },
            {
                path: "round-info",
                element: <RoundInfo />
            },
            {
                path: "teach-stu-info",
                element: <TeachStuInfo />
            },
            {
                // mutual select
                path: "ms-info",
                element: <MSInfo />
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