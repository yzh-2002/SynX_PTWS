import { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { loadPage } from "../utils/loadPage";
import { withBreakpoint } from "@/utils/breakpoints";

const OpenAccessLayout = loadPage(lazy(() => import("@/layouts/OpenAccessLayout")))
const Login = loadPage(lazy(() => import("../../views/App/Login")))
const App = loadPage(lazy(() => import("../../App")))
const NotFound = lazy(() => import("@/router/utils/NotFound"))

let AppLayout = loadPage(lazy(() => import("@/layouts/AppLayout")))
AppLayout = withBreakpoint(AppLayout)

//TODO:Test
const Round = lazy(() => import("@/views/web/Components/Form/Round"))

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
                // element: <App />,
                element: <Round />
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
])

export default router