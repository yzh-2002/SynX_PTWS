import { ArrowLeft, Cross } from "@react-vant/icons"
import { useMatch, useLocation } from "react-router-dom"
import { useBreakpoint } from "@/utils/breakpoints"

function MobileBar() {
    const location = useLocation()
    const match = useMatch(location.pathname)
    const breakpoint = useBreakpoint()
    // 利用匹配的route去获取移动端展示标题...
    console.log(match, breakpoint)
    return (
        <div className="flex items-center justify-between h-14 px-1">
            <ArrowLeft />
            <span>{`导师匹配管理系统`}</span>
            <Cross />
        </div>
    )
}

export default MobileBar