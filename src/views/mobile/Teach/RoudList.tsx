import { Button, Input, Empty, Tag, Collapse, Flex } from "react-vant"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getRoundList } from "@/api/admin/round"
import { Search } from "@react-vant/icons"
import PageLoading from "@/views/App/PageLoading"
import { useNavigate } from "react-router-dom"
import { RoundReturnType } from "@/objects/round"
import { ROUND_STATUS, ROUND_STATUS_COLOR } from "@/constants/round"
import { useMemo, useCallback } from "react"
import { TEACH_TASK_STATUS, TEACH_TASK_STATUS_COLOR } from "@/views/web/Teacher/MSRound"
import { getTaskStatus } from "@/utils/task"

function RoundCard({ round, }: { round: RoundReturnType }) {
    const navigator = useNavigate()
    const duration = JSON.parse(round?.duration || "")

    const CollapseTitle = useMemo(() => {
        return (
            <div className="p-2 pl-4 mb-1 bg-white flex flex-col cursor-pointer">
                <div className="flex items-center">
                    <span className="text-lg font-bold mr-2">{round?.name}</span>
                    <Tag color={ROUND_STATUS_COLOR[round.status]}>{ROUND_STATUS[round.status]}</Tag>
                </div>
                <div className="text-xs text-[#909398]">
                    {`起止日期:${duration?.start_1}--${duration?.end_4}`}
                </div>
            </div>
        )
    }, [round])

    const CollapseContent = useCallback(({ title, status, tipInfo, stage }: { title: string, status: number, tipInfo: string, stage: number }) => {
        return (
            <div>
                <div className="flex justify-between">
                    <div className="flex items-center">
                        <span className="font-bold text-black text-md mr-2">{title}</span>
                        <Tag color={TEACH_TASK_STATUS_COLOR[status]}>{TEACH_TASK_STATUS[status]}</Tag>
                    </div>
                    <Button type="primary" size="small" disabled={status === 0} onClick={() => {
                        navigator(`/app/tutor-round-detail?rid=${round?.id}&rname=${encodeURIComponent(round?.name)}&stage=${stage}`)
                    }}>详情</Button>
                </div>
                <span>{tipInfo}</span>
            </div>
        )
    }, [])

    return (
        <Collapse>
            <Collapse.Item className="round_collapse" title={CollapseTitle}>
                <Flex wrap="wrap">
                    <Flex.Item>
                        <CollapseContent
                            title="一志愿选择"
                            status={getTaskStatus(round?.status, round?.isAtStage, round?.stage, 1)!}
                            tipInfo={`起止时间：${duration?.start_2}--${duration?.end_2}`}
                            stage={1}
                        />
                    </Flex.Item>
                    <Flex.Item>
                        <CollapseContent
                            title="二志愿选择"
                            status={getTaskStatus(round?.status, round?.isAtStage, round?.stage, 2)!}
                            tipInfo={`起止时间：${duration?.start_3}--${duration?.end_3}`}
                            stage={2}
                        />
                    </Flex.Item>
                    <Flex.Item>
                        <CollapseContent
                            title="三志愿选择"
                            status={getTaskStatus(round?.status, round?.isAtStage, round?.stage, 3)!}
                            tipInfo={`起止时间：${duration?.start_4}--${duration?.end_4}`}
                            stage={3}
                        />
                    </Flex.Item>
                </Flex>
            </Collapse.Item>
        </Collapse>
    )
}


export default function RoundList() {
    const params = new URLSearchParams(window.location.search)
    const { loading: RoundListLoading, data: RoundList } = useRequest(useApi(getRoundList), {
        defaultParams: [{ workId: params.get('wid')! }]
    })
    return (
        <div>
            <div className="flex flex-col mx-4 justify-center">
                <div className="font-bold">全部</div>
                <Input className="bg-[#f5f5f7] mt-4 h-8 pl-2"
                    prefix={<Search color="#909398" />} placeholder="按展示名称搜索" />
            </div>
            <div className="bg-[#f5f5f7] mt-2 h-8 flex items-center pl-4 text-[#909398]">{`共${RoundList?.length || 0}条数据`}</div>
            <div className="bg-[#f5f5f7]">
                {
                    RoundListLoading ? <PageLoading /> :
                        (
                            !!RoundList?.length ?
                                RoundList.map((round) =>
                                    <RoundCard key={round?.id} round={round} />) :
                                <Empty description={'暂无数据'} />
                        )
                }
            </div>
        </div>
    )
}