import { Button, Input, Empty, Tag, Collapse, Flex } from "react-vant"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getRoundList } from "@/api/admin/round"
import { Search } from "@react-vant/icons"
import PageLoading from "@/views/App/PageLoading"
import { useNavigate } from "react-router-dom"
import { RoundReturnType } from "@/objects/round"
import { ROUND_STATUS, ROUND_STATUS_COLOR } from "@/constants/round"
import { useMemo, useCallback, ReactNode } from "react"


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
    const Description = useCallback(({ label, value }: { label: string, value: string | number | ReactNode | undefined }) => {
        return (
            <div>
                <span className="text-[#909398] mr-2">{`${label}:`}</span>
                <span className=" text-black">{!!value && value != 0 ? value : '暂无信息'}</span>
            </div>
        )
    }, [])

    return (
        <Collapse>
            <Collapse.Item className="round_collapse" title={CollapseTitle}>
                <Flex wrap="wrap">
                    <Flex.Item span={24}>
                        <Description label="提交简历起止时间" value={`${duration?.start_1}--${duration?.end_1}`} />
                    </Flex.Item>
                    <Flex.Item span={24}>
                        <Description label="选择导师起止时间" value={`${duration?.start_1}--${duration?.end_1}`} />
                    </Flex.Item>
                    <Flex.Item span={24}>
                        <Description label="状态" value={
                            <Tag color={(round?.stage === 'submit' && round?.isAtStage) ? '#108ee9' : '#f50'}>
                                {(round?.stage === 'submit' && round?.isAtStage) ? '进行中' : '已结束'}
                            </Tag>
                        } />
                    </Flex.Item>
                </Flex>
                <div className="w-full flex justify-end">
                    <Button type="primary" size="small"
                        disabled={!(round?.stage === 'submit' && round?.isAtStage)}
                        onClick={() => {
                            navigator(`/app/stu-round-detail?rid=${round?.id}&rname=${encodeURIComponent(round?.name)}`)
                        }}>详情</Button>
                </div>
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