import { serviceInfoAsync } from "@/store/service"
import { useRecoilValue } from "recoil"
import { Tabs } from "react-vant"
import { useMemo } from "react"

import TeachStuInfo from "./TeachStuInfo"

export default function ServiceDetail() {
    const service = useRecoilValue(serviceInfoAsync)
    const TabContents = useMemo(() => {
        return [
            { key: 'round', title: '轮次配置', children: <></> },
            { key: 'teach-stu', title: '师生导入', children: <TeachStuInfo id={service.id} /> },
            { key: 'ms-info', title: '双选详情', children: <></> },
        ]
    }, [])
    return (
        <div className="bg-[#f5f5f7] flex flex-col">
            <span className="font-bold text-lg p-2 mb-2 bg-white">{service?.name}</span>
            <Tabs className="mb-2">
                {TabContents.map(item => (
                    <Tabs.TabPane key={item?.key} title={item?.title}>{item?.children}</Tabs.TabPane>
                ))}
            </Tabs>
        </div>
    )
}