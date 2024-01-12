import { Tabs } from "antd"
import { useMemo } from "react"
import TeachMatchInfo from "./TeachMatchInfo"
import StuMatchInfo from "./StuMatchInfo"

export default function MSInfo() {
    const menuItems = useMemo(() => {
        return [
            { label: '匹配详情', key: 'teacher-match-detail', children: <TeachMatchInfo /> },
            { label: '学生信息', key: 'student-match-detail', children: <StuMatchInfo /> },
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