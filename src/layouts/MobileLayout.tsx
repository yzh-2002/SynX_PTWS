import MobileBar from "@/views/mobile/MobileBar";
import AppFooter from "@/views/App/AppFooter";
import { Outlet } from "react-router-dom";

export default function () {
    return (
        <div className="flex flex-col h-full">
            <MobileBar />
            <div className="flex-1">
                <Outlet />
            </div>
            <AppFooter />
        </div>
    )
}