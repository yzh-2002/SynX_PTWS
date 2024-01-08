import { ReactNode } from "react";
import Logo from "./Logo";

interface AppBarPropType {
    user?: ReactNode
}

function AppBar(props: AppBarPropType) {
    const APP_NAME = "信息与软件工程学院导师匹配管理系统"

    return (
        <div
            className="h-14 flex items-center justify-between bg-slate-50 mx-2"
        >
            <div className="flex items-center">
                <Logo />
                <div className="py-0 px-2 font-thin text-2xl">|</div>
                <div className="font-bold text-2xl">{APP_NAME}</div>
            </div>
            <div>{props?.user}</div>
        </div>
    )
}

export default AppBar