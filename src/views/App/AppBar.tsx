import Logo from "./Logo";

function AppBar() {
    const APP_NAME = "信息与软件工程学院导师匹配管理系统"

    return (
        <div
            className="h-[56] flex items-center"
        >
            <Logo />
            <div className="py-0 px-2 font-thin text-2xl">|</div>
            <div className="font-bold text-2xl">{APP_NAME}</div>
        </div>
    )
}

export default AppBar