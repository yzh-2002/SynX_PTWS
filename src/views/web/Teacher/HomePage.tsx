import { useMemo, useEffect } from "react"
import { Tabs } from "antd"
import { useRecoilState } from "recoil"
import { serviceInfoState } from "@/store/service"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getWorkInfo } from "@/api/admin/service"
import PageLoading from "@/views/App/PageLoading"
import MSRound from "./MSRound"
import MSRsult from "./MSRsult"


export default function TeachHomePage() {
    // 获取workId（每年只有一个）
    const [serviceInfo, setServiceInfo] = useRecoilState(serviceInfoState)
    const { loading: workInfoLoading, run: GetWork } = useRequest(useApi(getWorkInfo), {
        manual: true,
        // 默认应用只有一个服务
        onSuccess: (data) => {
            console.log(data)
            setServiceInfo(data?.workInfo?.length && data.workInfo[0] ||
                { id: "", name: "", status: NaN, year: NaN })
        }
    })
    useEffect(() => {
        !serviceInfo?.id && GetWork({ page: 1, size: 10 })
    }, [])
    const menuItems = useMemo(() => {
        return [
            {
                label: '双选轮次', key: 'ms-round', children: (
                    workInfoLoading ? <PageLoading /> : <MSRound workId={serviceInfo?.id} />
                )
            },
            {
                label: '双选结果', key: 'ms-result', children: (
                    workInfoLoading ? <PageLoading /> : <MSRsult workId={serviceInfo?.id} />
                )
            },
        ]
    }, [serviceInfo?.id])

    return (
        <Tabs
            className="w-4/5 m-auto"
            tabBarGutter={100}
            defaultActiveKey="ms-round"
            centered
            items={menuItems}
        />
    )
}