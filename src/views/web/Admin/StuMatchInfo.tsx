import { Table } from "antd"
import { SearchStuMatchForm } from "../Components/Form/StuMatch"
import { useMemo } from "react"
import { ColumnsType } from "antd/es/table"

export default function StuMatchInfo() {
    const StuMatchColumns = useMemo<ColumnsType<any>>(() => {
        return [
            { title: '学生姓名', dataIndex: 'stuName' },
            { title: '学生考号', dataIndex: 'stuCode' },
            { title: '电话号码', dataIndex: 'stuPhone' },
            { title: '匹配状态', dataIndex: 'status' },
            { title: '对应轮次', dataIndex: 'twsRound' },
            { title: '对应志愿', dataIndex: 'choiceRank' },
            { title: '导师姓名', dataIndex: 'teaName' },
            { title: '导师工号', dataIndex: 'teaCode' },
        ]
    }, [])

    return (
        <>
            <SearchStuMatchForm />
            <Table className="mt-2" columns={StuMatchColumns} />
        </>
    )
}