import { Table, TableColumnsType, Tag } from "antd"
import { SearchMSRsultForm } from "../Components/Form/MS"
import { useEffect, useMemo } from "react"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getMSInfo } from "@/api/admin/ms"
import { MSType } from "@/objects/ms"
import { MS_STATUS, MS_STATUS_COLOR } from "@/constants/ms"

interface MSRsultPropType {
    workId: string
}

export default function MSRsult({ workId }: MSRsultPropType) {
    const { loading: MSInfoLoading, run: getMS, data: MSInfo } = useRequest(useApi(getMSInfo), { manual: true })

    useEffect(() => {
        !!workId && getMS({ workId, page: 1, size: 5 })
    }, [workId])
    const MSResultColumns = useMemo<TableColumnsType<MSType>>(() => {
        return [
            { title: '导师姓名', dataIndex: 'teaName' },
            { title: '手机号', dataIndex: 'teaPhone' },
            { title: '邮箱', dataIndex: 'teaMail' },
            { title: '职称', dataIndex: 'jobTitle' },
            { title: '研究方向', dataIndex: 'keywords' },
            { title: '导师团队', dataIndex: 'teamName' },
            { title: '双选轮次', dataIndex: 'twsRound' },
            { title: '第几志愿', dataIndex: 'choiceRank' },
            {
                title: '状态', dataIndex: 'status', render: (_, { status }) => {
                    return <Tag color={MS_STATUS_COLOR[status + 1]}>{MS_STATUS[status + 1]}</Tag>
                }
            }
        ]
    }, [])

    return (
        <>
            <SearchMSRsultForm />
            <Table
                loading={MSInfoLoading} className="mt-2" columns={MSResultColumns}
                dataSource={MSInfo?.twsInfo}
            />
        </>
    )
}