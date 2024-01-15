import { Tabs } from "antd"
import { useMemo, useEffect } from "react"
import TeachMatchInfo from "./TeachMatchInfo"
import StuMatchInfo from "./StuMatchInfo"
import { useRecoilState } from "recoil"
import { serviceInfoState } from "@/store/service"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getWorkInfo } from "@/api/admin/service"
import PageLoading from "@/views/App/PageLoading"

export default function MSInfo() {
    const [serviceInfo, setServiceInfo] = useRecoilState(serviceInfoState)
    const { loading: workInfoLoading, run } = useRequest(useApi(getWorkInfo), {
        manual:true,
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
                label: '匹配详情', key: 'teacher-match-detail', children:
                    workInfoLoading ? <PageLoading /> : <TeachMatchInfo id={serviceInfo.id} />
            },
            {
                label: '学生信息', key: 'student-match-detail', children:
                    workInfoLoading ? <PageLoading /> : <StuMatchInfo id={serviceInfo.id} />
            },
        ]
    }, [workInfoLoading])

    return (
        <Tabs
            className="w-4/5 m-auto"
            tabBarGutter={100}
            defaultActiveKey="teacher-match-detail"
            centered
            items={menuItems}
        />
    )
}