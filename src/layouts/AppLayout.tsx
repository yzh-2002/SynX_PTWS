import AppBar from "@/views/App/AppBar";
import AppFooter from "@/views/App/AppFooter";
import { Outlet } from "react-router-dom";
import UserMenu from "@/views/web/UserMenu";

export default function () {
    return (
        <div className="flex flex-col h-full">
            <AppBar user={<UserMenu />} />
            <div className="flex-1">
                <Outlet />
            </div>
            <AppFooter />
        </div>
    )
}