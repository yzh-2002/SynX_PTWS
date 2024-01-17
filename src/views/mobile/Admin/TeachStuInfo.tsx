import { useMemo } from "react"
import { Tabs } from "react-vant"
import TeachInfo from "./TeachInfo"
import StuInfo from "./StuInfo"

export default function TeachStuInfo({ id }: { id: string }) {
    const TabContents = useMemo(() => {
        return [
            { key: 'teach', title: '导师详情', children: <TeachInfo id={id} /> },
            { key: 'stu', title: '学生详情', children: <StuInfo id={id} /> },
        ]
    }, [])

    return (
        <div className="bg-[#f5f5f7] flex flex-col mt-2">
            <span className="font-bold p-2 mb-2 bg-white">师生导入</span>
            <Tabs>
                {TabContents.map(item => (
                    <Tabs.TabPane key={item?.key} title={item?.title}>{item?.children}</Tabs.TabPane>
                ))}
            </Tabs>
        </div>
    )
}