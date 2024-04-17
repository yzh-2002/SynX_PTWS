import { Table, Tag } from "antd"
import { SearchStuMatchForm } from "../Components/Form/StuMatch"
import { useEffect, useMemo, useState } from "react"
import { ColumnsType } from "antd/es/table"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getStuMSInfo } from "@/api/admin/ms"
import { SearchStuMSParams, StuMSType } from "@/objects/ms"
import { MS_STATUS, MS_STATUS_COLOR } from "@/constants/ms"

export type StuMSParams = Omit<SearchStuMSParams, 'workId'>

export default function StuMatchInfo({ id }: { id: string }) {
    const { loading: StuMSInfoLoading, data: StuMSInfo, run: getStuMS } = useRequest(useApi(getStuMSInfo), { manual: true })
    const [params, setParams] = useState<StuMSParams>({ page: 1, size: 5 })
    useEffect(() => { getStuMS({ ...params, workId: id }) }, [params])

    const StuMatchColumns = useMemo<ColumnsType<StuMSType>>(() => {
        return [
            { title: '学生姓名', dataIndex: 'stuName' },
            { title: '学生考号', dataIndex: 'stuCode' },
            { title: '电话号码', dataIndex: 'stuPhone' },
            {
                title: '匹配状态', dataIndex: 'status', render: (_, record) => {
                    return <Tag color={MS_STATUS_COLOR[record?.status! + 1]}>{MS_STATUS[record?.status! + 1]}</Tag>
                }
            },
            { title: '对应轮次', dataIndex: 'twsRound' },
            { title: '对应志愿', dataIndex: 'choiceRank' },
            { title: '导师姓名', dataIndex: 'teaName' },
            { title: '导师工号', dataIndex: 'teaCode' },
        ]
    }, [])

    return (
        <>
            <SearchStuMatchForm
                id={id} params={params}
                setParams={(v) => setParams({ ...params, ...v })}
                refreshTable={() => setParams({ page: 1, size: params.size })}
            />
            <Table
                className="mt-2" columns={StuMatchColumns}
                loading={StuMSInfoLoading} dataSource={StuMSInfo?.userInfo}
                pagination={{
                    showSizeChanger: true,
                    total: StuMSInfo?.total,
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