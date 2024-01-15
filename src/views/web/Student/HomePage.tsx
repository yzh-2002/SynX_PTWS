import { useMemo } from "react"
import { Tabs } from "antd"
import MSRound from "./MSRound"
import MSRsult from "./MSRsult"


export default function StuHomePage() {
    const menuItems = useMemo(() => {
        return [
            { label: '双选轮次', key: 'ms-round', children: <MSRound /> },
            { label: '双选结果', key: 'ms-result', children: <MSRsult /> },
        ]
    }, [])

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