import { Table, TableColumnsType, Tag } from "antd"
import { SearchStuMSRsultForm } from "../Components/Form/MS"
import { useEffect, useMemo, useState } from "react"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getMSInfo } from "@/api/admin/ms"
import { MSType } from "@/objects/ms"
import { MS_STATUS, MS_STATUS_COLOR } from "@/constants/ms"
import { MSParams } from "../Admin/TeachMatchInfo"

interface MSRsultPropType {
    workId: string
}

export default function MSRsult({ workId }: MSRsultPropType) {
    const { loading: MSInfoLoading, run: getMS, data: MSInfo } = useRequest(useApi(getMSInfo), { manual: true })
    const [params, setParams] = useState<MSParams>({ page: 1, size: 5 })
    useEffect(() => {
        !!workId && getMS({ workId, ...params })
    }, [workId, params])
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
            <SearchStuMSRsultForm
                setParams={(v) => setParams({ ...params, ...v })}
                refreshTable={() => setParams({ page: 1, size: 5 })}
            />
            <Table
                loading={MSInfoLoading} className="mt-2" columns={MSResultColumns}
                dataSource={MSInfo?.twsInfo}
                pagination={{
                    showSizeChanger: true,
                    total: MSInfo?.total,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: params?.size,
                    current: params?.page,
                    onChange: (page, size) => {
                        setParams({ ...params, page, size })
                    }
                }}
            />
        </>
    )
}