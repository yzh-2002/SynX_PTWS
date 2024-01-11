import { Tabs } from "antd"
import { useMemo } from "react"
import TeachInfo from "./TeachInfo"
import StuInfo from "./StuInfo"

export default function TeachStuInfo() {
    const params = new URLSearchParams(location.search)
    const menuItems = useMemo(() => {
        return [
            { label: '导师详情', key: 'teacher-detail', children: <TeachInfo id={params.get("workId") || ''} /> },
            { label: '学生详情', key: 'student-detail', children: <StuInfo id={params.get("workId") || ''} /> },
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