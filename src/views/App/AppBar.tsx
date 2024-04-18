import { ReactNode } from "react";
import Logo from "./Logo";
import { useBreakpoint, withBreakpoint } from "@/utils/breakpoints";
import { Button } from "antd";
import { LeftOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";

interface AppBarPropType {
    user?: ReactNode
}

function AppBar(props: AppBarPropType) {
    const breakpoints = useBreakpoint()
    const navigator = useNavigate()
    const APP_NAME = breakpoints.width < 520 ? '导师匹配管理系统' : "信息与软件工程学院导师匹配管理系统"

    return (
        <div
            className="h-14 flex items-center justify-between bg-slate-50 mx-2"
        >
            <div className="flex items-center">
                <Button icon={<LeftOutlined />} shape="circle" className="mr-2" type="text" onClick={() => { navigator(-1) }} />
                <Logo />
                <div className="py-0 px-2 font-thin text-2xl">|</div>
                <div className="font-bold text-2xl">{APP_NAME}</div>
            </div>
            <div>{props?.user}</div>
        </div>
    )
}

export default withBreakpoint(AppBar)