import { Table, Tag } from "antd"
import { SearchTeachMSRsultForm } from "../Components/Form/MS"
import { useEffect, useMemo } from "react"
import { ColumnsType } from "antd/es/table"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getMSInfo } from "@/api/admin/ms"
import { MSType } from "@/objects/ms"
import { MS_STATUS, MS_STATUS_COLOR } from "@/constants/ms"

export default function MSRsult({ workId }: { workId: string }) {
    const { loading: MSInfoLoading, data: MSInfo, run: getMS } = useRequest(useApi(getMSInfo), { manual: true })
    useEffect(() => { getMS({ workId, page: 1, size: 5 }) }, [workId])

    const TeachMSColumns = useMemo<ColumnsType<MSType>>(() => {
        return [
            { title: '学生姓名', dataIndex: 'stuName' },
            { title: '学生考号', dataIndex: 'stuCode' },
            { title: '手机号', dataIndex: 'stuPhone' },
            { title: '双选轮次', dataIndex: 'twsRound' },
            { title: '第几志愿', dataIndex: 'choiceRank' },
            {
                title: '状态', dataIndex: 'status', render: (_, { status }) => {
                    return <Tag color={MS_STATUS_COLOR[status + 1]}>{MS_STATUS[status + 1]}</Tag>
                }
            },
        ]
    }, [])

    return (
        <>
            <SearchTeachMSRsultForm />
            <Table
                className="mt-2" columns={TeachMSColumns}
                loading={MSInfoLoading}
                dataSource={MSInfo?.twsInfo}
            />
        </>
    )
}