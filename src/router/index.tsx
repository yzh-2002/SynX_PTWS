import { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { loadPage } from "./utils/loadPage";

const LoginLayout = loadPage(lazy(() => import("@/layouts/LoginLayout")))
const Login = loadPage(lazy(() => import("../views/App/Login")))
const App = loadPage(lazy(() => import("../App")))
const NotFound = lazy(() => import("@/router/utils/NotFound"))

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" />,
    },
    {
        path: '/login',
        element: <LoginLayout {
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
        element: <App />
    },
    {
        path: "*",
        element: <NotFound />
    }
])

export default router