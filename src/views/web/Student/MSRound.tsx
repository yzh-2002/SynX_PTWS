import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getRoundList } from "@/api/admin/round"
import PageLoading from "@/views/App/PageLoading"
import { Button, Empty, Table, Tag } from "antd"
import { useRecoilState } from "recoil"
import { serviceInfoState } from "@/store/service"
import { getWorkInfo } from "@/api/admin/service"
import { useEffect, useMemo } from "react"
import { RoundReturnType } from "@/objects/round"
import CollapseCard, { CollapseCardPropType } from "../Components/CollapseCard"
import { ROUND_STATUS, ROUND_STATUS_COLOR } from "@/constants/round"
import { ColumnsType } from "antd/es/table"
import { useNavigate } from "react-router-dom"

interface TableItemType {
    taskName: string,
    startTime: string,
    endTime: string,
    status: boolean
}

function CardContent({ round }: { round: RoundReturnType }) {
    const navigator = useNavigate()
    const TableHeader = () => {
        return (
            <div className="flex justify-between">
                <span className="font-bold text-lg">任务详情</span>
                <Button type="primary" onClick={() => { navigator(`/app/stu-task?pid=${round?.id}`) }}>详情</Button>
            </div>
        )
    }
    const CardContentColumns = useMemo<ColumnsType<TableItemType>>(() => {
        return [
            { title: '任务名称', dataIndex: 'taskName' },
            { title: '开始时间', dataIndex: 'startTime' },
            { title: '截至时间', dataIndex: 'endTime' },
            {
                title: '状态', dataIndex: 'status', render: (_, { status }) => {
                    return <Tag color={status ? '#108ee9' : '#f50'}>{status ? '进行中' : '已结束'}</Tag>
                }
            }
        ]
    }, [])
    const tableData = useMemo<TableItemType[]>(() => {
        const duration = JSON.parse(round?.duration)
        return [
            {
                taskName: '提交简历',
                startTime: duration?.start_1,
                endTime: duration?.end_1,
                status: round?.stage === 'submit' && round?.isAtStage,
            },
            {
                taskName: '选择导师',
                startTime: duration?.start_1,
                endTime: duration?.end_1,
                status: round?.stage === 'submit' && round?.isAtStage,
            },
        ];
    }, [round])

    return (
        <Table title={TableHeader} bordered columns={CardContentColumns} dataSource={tableData} pagination={false} />
    )
}


export default function MSRound() {
    // 获取workId（每年只有一个）
    const [serviceInfo, setServiceInfo] = useRecoilState(serviceInfoState)
    const { loading: workInfoLoading, run: GetWork, refresh } = useRequest(useApi(getWorkInfo), {
        manual: true,
        // 默认应用只有一个服务
        onSuccess: (data) => {
            setServiceInfo(data?.workInfo?.length && data.workInfo[0] ||
                { id: "", name: "", status: NaN, year: NaN })
        }
    })
    useEffect(() => {
        !serviceInfo?.id && GetWork({ page: 1, size: 10 })
    }, [])
    const { loading: RoundListLoading, data: RoundList, runAsync: GetRound } = useRequest(useApi(getRoundList))
    useEffect(() => {
        // 请求报错可能是work被删除，此时需要重新获取workId（感觉这个场景发生概率极小...）
        !!serviceInfo.id && GetRound({ workId: serviceInfo.id }).catch(() => { refresh() })
    }, [serviceInfo.id])

    const GenerateCardConfig = (round: RoundReturnType, idx: number): CollapseCardPropType => {
        const duration = JSON.parse(round?.duration)
        return {
            content: {
                key: round.name + idx,
                label: round.name,
                children: <CardContent round={round} />
            },
            header: {
                title: round.name,
                tag: <Tag color={ROUND_STATUS_COLOR[round.status]}>{ROUND_STATUS[round.status]}</Tag>,
                appendix: `起止日期：${duration?.start_1}--${duration?.end_4}`
            }
        }
    }
    return (
        (RoundListLoading || workInfoLoading) ? <PageLoading /> :
            !RoundList?.length ? <Empty description={'导师匹配服务尚未发布，具体时间请咨询学院研究生科！'} />
                :
                // TODO:此时接口返回数据为全部轮次，实际应该返回学生双选结束及之前的轮次（之后的轮次不应返回）
                (RoundList?.map((round, idx) => {
                    return <CollapseCard key={round.id} {...GenerateCardConfig(round, idx)} />
                }))
    )
}