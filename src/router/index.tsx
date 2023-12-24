import { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import { loadPage } from "./utils/loadPage";

const Login = loadPage(lazy(() => import("../views/Login")))
const App = loadPage(lazy(() => import("../App")))

const router = createBrowserRouter([
    {
        path: '/',
        element: <Navigate to="/login" />
    },
    {
        path: '/login',
        element: <Login {
            ...{
                openAccess:true,
                noRedirect:true
            }
        } />
    },
    {
        path: '/app',
        element: <App />
    },
])

export default router