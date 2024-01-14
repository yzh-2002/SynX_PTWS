import { Tabs } from "antd"
import { useMemo } from "react"
import TeachMatchInfo from "./TeachMatchInfo"
import StuMatchInfo from "./StuMatchInfo"
import { useRecoilValue } from "recoil"
import { serviceInfoAsync } from "@/store/service"

export default function MSInfo() {
    const service = useRecoilValue(serviceInfoAsync)
    const menuItems = useMemo(() => {
        return [
            { label: '匹配详情', key: 'teacher-match-detail', children: <TeachMatchInfo id={service.id} /> },
            { label: '学生信息', key: 'student-match-detail', children: <StuMatchInfo id={service.id} /> },
        ]
    }, [])

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