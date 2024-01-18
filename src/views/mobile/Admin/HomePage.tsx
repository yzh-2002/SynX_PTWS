import { userInfoState } from "@/store/login"
import { useRecoilValue } from "recoil"
import { useNavigate } from "react-router-dom"
import { ReactNode, useMemo } from "react"
import { ManagerO } from "@react-vant/icons"

interface MenuItemType {
    title: string,
    tipInfo?: string,
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
                tipInfo: '轮次配置 | 师生导入 | 双选详情',
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
                            className=" w-4/5 p-2 my-2 flex"
                            style={{ boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px" }}
                        >
                            <div className={`flex justify-center items-center h-10 w-10 rounded-md ${item.bgColor}`}>{item.icon}</div>
                            <div className="ml-4 flex flex-col justify-between">
                                <span className="text-xs font-bold">{item.title}</span>
                                <span className="text-xs text-[#696969]">{item?.tipInfo}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}