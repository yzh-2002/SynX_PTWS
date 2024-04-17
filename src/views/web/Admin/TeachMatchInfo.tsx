import { Table, Tag } from "antd"
import { SearchTeachMatchForm } from "../Components/Form/TeachMatch"
import { ColumnsType } from "antd/es/table"
import { useEffect, useMemo, useState } from "react"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getMSInfo } from "@/api/admin/ms"
import { SearchMSParams, MSType } from "@/objects/ms"
import { MS_STATUS, MS_STATUS_COLOR } from "@/constants/ms"
import dayjs from "dayjs"

export type MSParams = Omit<SearchMSParams, 'workId'>

export default function TeachMatchInfo({ id }: { id: string }) {
    const { loading: MSLoading, data: MSInfo, run: getMS } = useRequest(useApi(getMSInfo), { manual: true })
    const [params, setParams] = useState<MSParams>({ page: 1, size: 5 })
    useEffect(() => { getMS({ ...params, workId: id }) }, [params])

    const TeachMatchColumns = useMemo<ColumnsType<MSType>>(() => {
        return [
            { title: '学生姓名', dataIndex: 'stuName' },
            { title: '学生考号', dataIndex: 'stuCode' },
            { title: '导师姓名', dataIndex: 'teaName' },
            { title: '导师工号', dataIndex: 'teaCode' },
            { title: '导师职称', dataIndex: 'jobTitle' },
            { title: '导师团队', dataIndex: 'teamName' },
            { title: '申报轮次', dataIndex: 'twsRound' },
            { title: '申报志愿', dataIndex: 'choiceRank' },
            {
                title: '匹配状态', dataIndex: 'status', render: (_, record) => {
                    return <Tag color={MS_STATUS_COLOR[record?.status! + 1]}>{MS_STATUS[record?.status! + 1]}</Tag>
                }
            },
            {
                title: '审核时间', dataIndex: 'createdTime', render: (_, record) => {
                    return dayjs(record?.createdTime).format("YYYY-MM-DD HH:mm")
                }
            },
        ]
    }, [])

    return (
        <>
            <SearchTeachMatchForm
                id={id} params={params}
                setParams={(v) => setParams({ ...params, ...v })}
                refreshTable={() => setParams({ page: 1, size: params.size })}
            />
            <Table
                className="mt-2"
                columns={TeachMatchColumns}
                loading={MSLoading}
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