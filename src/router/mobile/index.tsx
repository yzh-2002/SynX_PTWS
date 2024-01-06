import { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { loadPage } from "../utils/loadPage";
import { withBreakpoint } from "@/utils/breakpoints";

const OpenAccessLayout = loadPage(lazy(() => import("@/layouts/OpenAccessLayout")))
const Login = loadPage(lazy(() => import("../../views/App/Login")))
const App = loadPage(lazy(() => import("../../App")))
const NotFound = lazy(() => import("@/router/utils/NotFound"))

let MobileLayout = loadPage(lazy(() => import("@/layouts/MobileLayout")))
MobileLayout = withBreakpoint(MobileLayout)

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
        element: <MobileLayout />,
        children: [
            {
                index: true,
                element: <App />,
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
                path:'*',
                element: <NotFound />
            }
        ]
    }
], { basename: '/mobile' })

export default router