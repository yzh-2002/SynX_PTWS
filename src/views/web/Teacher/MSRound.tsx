import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getRoundList } from "@/api/admin/round"
import PageLoading from "@/views/App/PageLoading"
import { Button, Empty, Table, Tag } from "antd"
import { useEffect, useMemo } from "react"
import { RoundReturnType } from "@/objects/round"
import CollapseCard, { CollapseCardPropType } from "../Components/CollapseCard"
import { ROUND_STATUS, ROUND_STATUS_COLOR } from "@/constants/round"
import { ColumnsType } from "antd/es/table"
import { useNavigate } from "react-router-dom"
import { getTaskStatus } from "@/utils/task"

interface TableItemType {
    taskName: string,
    startTime: string,
    endTime: string,
    status: number,
    stage: number
}
export const TEACH_TASK_STATUS = ['未开始', '进行中', '已结束']
export const TEACH_TASK_STATUS_COLOR = ['#108ee9', '#1ee30a', '#f50']


function CardContent({ round }: { round: RoundReturnType }) {
    const navigator = useNavigate()
    const TableHeader = () => {
        return (
            <div className="flex">
                <span className="font-bold text-lg">任务详情</span>
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
                    return <Tag color={TEACH_TASK_STATUS_COLOR[status]}>{TEACH_TASK_STATUS[status]}</Tag>
                }
            },
            {
                title: '操作', render: (_, { status, stage }) => {
                    return <Button type="link" disabled={status === 0}
                        onClick={() => {
                            navigator(`/app/teach-task?pid=${round?.id}&stage=${stage}`)
                        }}>详情</Button>
                }
            }
        ]
    }, [])
    const tableData = useMemo<TableItemType[]>(() => {
        const duration = JSON.parse(round?.duration)
        return [
            {
                taskName: '一志愿选择',
                startTime: duration?.start_2,
                endTime: duration?.end_2,
                status: getTaskStatus(round?.status, round?.isAtStage, round?.stage, 1)!,
                stage: 1
            },
            {
                taskName: '二志愿选择',
                startTime: duration?.start_3,
                endTime: duration?.end_3,
                status: getTaskStatus(round?.status, round?.isAtStage, round?.stage, 2)!,
                stage: 2
            },
            {
                taskName: '三志愿选择',
                startTime: duration?.start_4,
                endTime: duration?.end_4,
                status: getTaskStatus(round?.status, round?.isAtStage, round?.stage, 3)!,
                stage: 3
            },
        ];
    }, [round])

    return (
        <Table title={TableHeader} bordered columns={CardContentColumns} dataSource={tableData} pagination={false} />
    )
}

interface MSRoundPropType {
    workId: string
}

export default function MSRound({ workId }: MSRoundPropType) {
    const { loading: RoundListLoading, data: RoundList, runAsync: GetRound } = useRequest(useApi(getRoundList), { manual: true })
    useEffect(() => {
        !!workId && GetRound({ workId })
    }, [workId])

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
        RoundListLoading ? <PageLoading /> :
            !RoundList?.length ? <Empty description={'导师匹配服务尚未发布，具体时间请咨询学院研究生科！'} />
                :
                // TODO:此时接口返回数据为全部轮次，实际应该返回学生双选结束及之前的轮次（之后的轮次不应返回）
                (RoundList?.map((round, idx) => {
                    return <CollapseCard key={round.id} {...GenerateCardConfig(round, idx)} />
                }))
    )
}