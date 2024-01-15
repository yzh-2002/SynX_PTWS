import { Table, TableColumnsType } from "antd"
import { SearchMSRsultForm } from "../Components/Form/MS"
import { useMemo } from "react"

export default function MSRsult() {
    const MSResultColumns = useMemo<TableColumnsType<any>>(() => {
        return [
            { title: '导师姓名', dataIndex: 'teaName' },
            { title: '手机号', dataIndex: 'teaPhone' },
            { title: '邮箱', dataIndex: 'teaMail' },
            { title: '职称', dataIndex: 'jobTitle' },
            { title: '研究方向', dataIndex: 'keywords' },
            { title: '导师团队', dataIndex: 'teamName' },
            { title: '双选轮次', dataIndex: 'twsRound' },
            { title: '第几志愿', dataIndex: 'choiceRank' },
            { title: '状态', dataIndex: 'status' }
        ]
    }, [])

    return (
        <>
            <SearchMSRsultForm />
            <Table className="mt-2" columns={MSResultColumns} />
        </>
    )
}