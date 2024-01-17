import { serviceInfoState } from "@/store/service"
import { useRecoilState } from "recoil"
import { Tabs } from "react-vant"
import { useEffect, useMemo } from "react"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getWorkInfo } from "@/api/admin/service"

import TeachStuInfo from "./TeachStuInfo"
import PageLoading from "@/views/App/PageLoading"

export default function ServiceDetail() {
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
    const TabContents = useMemo(() => {
        return [
            { key: 'round', title: '轮次配置', children: <></> },
            {
                key: 'teach-stu', title: '师生导入', children: (
                    workInfoLoading ? <PageLoading /> : <TeachStuInfo id={serviceInfo.id} />
                )
            },
            { key: 'ms-info', title: '双选详情', children: <></> },
        ]
    }, [workInfoLoading])
    return (
        <div className="bg-[#f5f5f7] flex flex-col">
            <span className="font-bold text-lg p-2 mb-2 bg-white">{serviceInfo?.name}</span>
            <Tabs className="mb-2">
                {TabContents.map(item => (
                    <Tabs.TabPane key={item?.key} title={item?.title}>{item?.children}</Tabs.TabPane>
                ))}
            </Tabs>
        </div>
    )
}