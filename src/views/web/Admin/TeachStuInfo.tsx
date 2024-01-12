import { Tabs } from "antd"
import { useMemo } from "react"
import TeachInfo from "./TeachInfo"
import StuInfo from "./StuInfo"
import { useRecoilValue } from "recoil"
import { serviceInfoAsync } from "@/store/service"

export default function TeachStuInfo() {
    const service = useRecoilValue(serviceInfoAsync)
    const menuItems = useMemo(() => {
        return [
            { label: '导师详情', key: 'teacher-detail', children: <TeachInfo id={service.id} /> },
            { label: '学生详情', key: 'student-detail', children: <StuInfo id={service.id} /> },
        ]
    }, [])

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