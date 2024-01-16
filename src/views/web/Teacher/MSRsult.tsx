import { Table, Tag } from "antd"
import { SearchTeachMSRsultForm } from "../Components/Form/MS"
import { useEffect, useMemo, useState } from "react"
import { ColumnsType } from "antd/es/table"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getMSInfo } from "@/api/admin/ms"
import { MSType } from "@/objects/ms"
import { MS_STATUS, MS_STATUS_COLOR } from "@/constants/ms"
import { MSParams } from "../Admin/TeachMatchInfo"

export default function MSRsult({ workId }: { workId: string }) {
    const { loading: MSInfoLoading, data: MSInfo, run: getMS } = useRequest(useApi(getMSInfo), { manual: true })
    const [params, setParams] = useState<MSParams>({ page: 1, size: 5 })
    useEffect(() => { getMS({ workId, ...params }) }, [workId, params])

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
            <SearchTeachMSRsultForm
                setParams={(v) => setParams({ ...params, ...v })}
                refreshTable={() => setParams({ page: 1, size: 5 })}
            />
            <Table
                className="mt-2" columns={TeachMSColumns}
                loading={MSInfoLoading}
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