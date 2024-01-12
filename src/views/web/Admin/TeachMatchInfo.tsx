import { Table } from "antd"
import { SearchTeachMatchForm } from "../Components/Form/TeachMatch"
import { ColumnsType } from "antd/es/table"
import { useMemo } from "react"


export default function TeachMatchInfo() {
    const TeachMatchColumns = useMemo<ColumnsType<any>>(() => {
        return [
            { title: '学生姓名', dataIndex: 'stuName' },
            { title: '学生考号', dataIndex: 'stuCode' },
            { title: '导师姓名', dataIndex: 'teaName' },
            { title: '导师工号', dataIndex: 'teaCode' },
            { title: '导师职称', dataIndex: 'jobTitle' },
            { title: '导师团队', dataIndex: 'teamName' },
            { title: '申报轮次', dataIndex: 'twsRound' },
            { title: '申报志愿', dataIndex: 'choiceRank' },
            { title: '匹配状态', dataIndex: 'status' },
            { title: '审核时间', dataIndex: 'createdTime' },
        ]
    }, [])

    return (
        <>
            <SearchTeachMatchForm />
            <Table className="mt-2" columns={TeachMatchColumns} />
        </>
    )
}