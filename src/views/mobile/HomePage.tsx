import { userInfoState } from "@/store/login"
import { useRecoilValue } from "recoil"
import { useNavigate } from "react-router-dom"
import { ReactNode, useMemo } from "react"
import { ManagerO } from "@react-vant/icons"

interface MenuItemType {
    title: string,
    icon: ReactNode,
    bgColor: string,
    onClick: () => void
}

export default function HomePage() {
    const navigator = useNavigate()
    const userInfo = useRecoilValue(userInfoState)
    const menuList = useMemo<MenuItemType[]>(() => {
        return [
            {
                title: '双选服务',
                icon: <ManagerO fontSize={'30px'} color="#349929" />,
                onClick: () => { navigator("/app/service") },
                bgColor: 'bg-[#dcf5d5]'
            }
        ]
    }, [])
    return (
        <div className="flex flex-col mt-4 ml-2">
            <div className="flex flex-col">
                <span className="font-bold text-lg">{userInfo?.name}</span>
                <span className="text-[#696969]">您好，欢迎使用导师匹配管理系统</span>
            </div>
            <div className="mt-2">
                <span className="font-bold">工作台</span>
                {menuList.map(item => {
                    return (
                        <div key={item.title} onClick={item.onClick}
                            className="flex flex-col justify-center w-12 mt-2 mr-2 cursor-pointer">
                            <div className={`flex justify-center items-center h-10 rounded-md ${item.bgColor}`}>{item.icon}</div>
                            <span className="text-xs text-[#696969]">{item.title}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}