import { userInfoState } from "@/store/login"
import { useRecoilValue } from "recoil"
import { useNavigate } from "react-router-dom"
import { useMemo } from "react"
import { ManagerO, NotesO } from "@react-vant/icons"
import { MenuItemType } from "../Admin/HomePage"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { useRecoilState } from "recoil"
import { serviceInfoState } from "@/store/service"
import { getWorkInfo } from "@/api/admin/service"
import PageLoading from "@/views/App/PageLoading"

export default function HomePage() {
    const navigator = useNavigate()
    const userInfo = useRecoilValue(userInfoState)
    const [serviceInfo, setServiceInfo] = useRecoilState(serviceInfoState)
    const { loading: WorkInfoLoading } = useRequest(useApi(getWorkInfo), {
        defaultParams: [{ page: 1, size: 5 }],
        // 默认应用只有一个服务
        onSuccess: (data) => {
            setServiceInfo(data?.workInfo?.length && data.workInfo[0] ||
                { id: "", name: "", status: NaN, year: NaN })
        }
    })
    const menuList = useMemo<MenuItemType[]>(() => {
        return [
            {
                title: '双选服务',
                tipInfo: '双选轮次> 上传简历 | 申请导师',
                icon: <ManagerO fontSize={'30px'} color="#349929" />,
                onClick: () => { navigator(`/app/stu-round-list?wid=${serviceInfo?.id}`) },
                bgColor: 'bg-[#dcf5d5]'
            },
            {
                title: '双选结果',
                tipInfo: '双选结果',
                icon: <NotesO fontSize={'30px'} color="#d6790a" />,
                onClick: () => { navigator(`/app/stu-round-result?wid=${serviceInfo?.id}`) },
                bgColor: 'bg-[#fdebd3]'
            }
        ]
    }, [serviceInfo?.id])
    return (
        <div className="flex flex-col mt-4 ml-2">
            <div className="flex flex-col">
                <span className="font-bold text-lg">{userInfo?.name}</span>
                <span className="text-[#696969]">您好，欢迎使用导师匹配管理系统</span>
            </div>
            <div className="mt-2">
                <span className="font-bold">工作台</span>
                {
                    WorkInfoLoading ? <PageLoading /> :
                        menuList.map(item => {
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
                        })
                }
            </div>
        </div>
    )
}