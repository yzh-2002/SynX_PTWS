import { useMemo } from "react"
import { Tabs } from "react-vant"
import TeachMSInfo from "./TeachMSInfo"
import StuMSInfo from "./StuMSInfo"

export default function MSInfo({ id }: { id: string }) {
    const TabContents = useMemo(() => {
        return [
            { key: 'teach', title: '匹配详情', children: <TeachMSInfo id={id} /> },
            { key: 'stu', title: '学生信息', children: <StuMSInfo id={id} /> },
        ]
    }, [])

    return (
        <div className="bg-[#f5f5f7] flex flex-col mt-2">
            <span className="font-bold p-2 bg-white">双选详情</span>
            <Tabs>
                {TabContents.map(item => (
                    <Tabs.TabPane key={item?.key} title={item?.title}>{item?.children}</Tabs.TabPane>
                ))}
            </Tabs>
        </div>
    )
}