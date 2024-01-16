import { Tabs } from "antd"
import { useMemo, useEffect } from "react"
import TeachInfo from "./TeachInfo"
import StuInfo from "./StuInfo"
import { useRecoilState } from "recoil"
import { serviceInfoState } from "@/store/service"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getWorkInfo } from "@/api/admin/service"
import PageLoading from "@/views/App/PageLoading"

export default function TeachStuInfo() {
    const [serviceInfo, setServiceInfo] = useRecoilState(serviceInfoState)
    const { loading: workInfoLoading, run } = useRequest(useApi(getWorkInfo), {
        manual: true,
        // 默认应用只有一个服务
        onSuccess: (data) => {
            setServiceInfo(data?.workInfo?.length && data.workInfo[0] ||
                { id: "", name: "", status: NaN, year: NaN })
        }
    })
    useEffect(() => {
        !serviceInfo?.id && run({ page: 1, size: 10 })
    }, [])
    const menuItems = useMemo(() => {
        return [
            {
                label: '导师详情', key: 'teacher-detail', children:
                    workInfoLoading ? <PageLoading /> : <TeachInfo id={serviceInfo?.id} />
            },
            {
                label: '学生详情', key: 'student-detail', children:
                    workInfoLoading ? <PageLoading /> : <StuInfo id={serviceInfo?.id} />
            },
        ]
    }, [workInfoLoading])

    return (
        <Tabs
            className="w-4/5 m-auto"
            tabBarGutter={100}
            defaultActiveKey="teacher-detail"
            centered
            items={menuItems}
        />
    )
}