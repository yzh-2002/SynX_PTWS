import AppBar from "@/views/App/AppBar";
import { Outlet } from "react-router-dom";

export default function () {
    return (
        <>
            <AppBar />
            <Outlet />
        </>
    )
}