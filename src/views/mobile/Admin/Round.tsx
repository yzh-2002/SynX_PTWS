import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getRoundList, updateRoundStatus, delRound } from "@/api/admin/round"
import PageLoading from "@/views/App/PageLoading"
import { Button, Input, Empty, Tag, Dialog, Toast, Collapse, Flex } from "react-vant"
import { Search } from "@react-vant/icons"
import { useNavigate } from "react-router-dom"
import { RoundReturnType } from "@/objects/round"
import { ROUND_STATUS, ROUND_STATUS_COLOR } from "@/constants/round"
import { useMemo, useCallback } from "react"

interface RoundCardPropType {
    round: RoundReturnType,
    refresh: () => void,
    id: string //workId
}

function RoundCard({ round, refresh, id }: RoundCardPropType) {
    const navigator = useNavigate()
    const duration = JSON.parse(round?.duration || "")
    const { runAsync: updateStatus } = useRequest(useApi(updateRoundStatus), { manual: true })
    const { runAsync: delRoundFun } = useRequest(useApi(delRound), { manual: true })

    const CollapseTitle = useMemo(() => {
        return (
            <div className="p-2 pl-4 mb-0.5 bg-white flex flex-col cursor-pointer">
                <div className="flex items-center">
                    <span className="text-lg font-bold mr-2">{round?.name}</span>
                    <Tag color={ROUND_STATUS_COLOR[round.status]}>{ROUND_STATUS[round.status]}</Tag>
                </div>
                <div className="flex justify-end">
                    {round.status !== 'end' &&
                        <Button size="small" type="primary" onClick={() => {
                            Dialog.show({
                                title: '二次确认',
                                message: `确定要变更工作状态至${round.status === 'notStart' ? '已发布' : '未发布'}？`,
                                showCancelButton: true,
                                onConfirm: () => {
                                    return new Promise(r => {
                                        updateStatus({ id: round.id }, { message: true }).then(() => {
                                            r(true)
                                            Toast.success(`${round.status === 'notStart' ? '发布' : '撤回'}轮次成功`)
                                            refresh()
                                        })
                                    })
                                }
                            })
                        }}>{round.status === 'notStart' ? '发布' : '撤回'}</Button>
                    }
                    {round.status !== 'onGoing' &&
                        <>
                            <Button style={{ margin: '0 8px' }} size="small" type="primary" onClick={(e) => {
                                e.stopPropagation()
                                navigator(`/app/create-round?wid=${id}&rid=${round?.id}`)
                            }}>编辑</Button>
                            <Button size="small" type="danger" onClick={() => {
                                Dialog.show({
                                    title: '二次确认',
                                    message: '确认要删除该轮次？一旦删除，将无法恢复，请确定删除！',
                                    showCancelButton: true,
                                    onConfirm: () => {
                                        return new Promise(r => {
                                            delRoundFun({ ids: [round.id] }, { message: true }).then(() => {
                                                r(true)
                                                Toast.success('删除轮次成功')
                                                refresh()
                                            })
                                        })
                                    }
                                })
                            }}>删除</Button>
                        </>
                    }
                </div>
            </div>
        )
    }, [round, id])
    const Description = useCallback(({ label, value }: { label: string, value: string | number | undefined }) => {
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
                        <Description label="轮次名称" value={round?.name} />
                    </Flex.Item>
                    <Flex.Item span={24}>
                        <Description label="简历最大内存(MB)" value={round?.fileMaxSize / 1024 / 1024} />
                    </Flex.Item>
                    <Flex.Item span={24}>
                        <Description label="学生选择意向导师起止时间"
                            value={`${duration?.start_1}--${duration?.end_1}`} />
                    </Flex.Item>
                    <Flex.Item span={24}>
                        <Description label="教师审核第一志愿起止时间"
                            value={`${duration?.start_2}--${duration?.end_2}`} />
                    </Flex.Item>
                    <Flex.Item span={24}>
                        <Description label="教师审核第二志愿起止时间"
                            value={`${duration?.start_3}--${duration?.end_3}`} />
                    </Flex.Item>
                    <Flex.Item span={24}>
                        <Description label="教师审核第三志愿起止时间"
                            value={`${duration?.start_4}--${duration?.end_4}`} />
                    </Flex.Item>
                </Flex>
            </Collapse.Item>
        </Collapse>
    )
}


export default function Round({ id }: { id: string }) {
    const navigator = useNavigate()

    const { loading: RoundLoading, data: RoundList, refresh } = useRequest(useApi(getRoundList))

    return (
        RoundLoading ? <PageLoading /> :
            <div className="bg-white">
                <div className="flex flex-col mx-4 justify-center">
                    <div className="flex justify-between items-center">
                        <span className="font-bold">全部</span>
                        <span className="text-lg" onClick={() => navigator(`/app/create-round?wid=${id}`)}>
                            <Button type="primary" size="small">创建导师匹配轮次</Button>
                        </span>
                    </div>
                    <Input className="bg-[#f5f5f7] mt-4 h-8 pl-2"
                        prefix={<Search color="#909398" />} placeholder="按展示名称搜索" />
                </div>
                <div className="bg-[#f5f5f7] mt-2 h-8 flex items-center pl-4 text-[#909398]">{`共${RoundList?.length || 0}条数据`}</div>
                <div className="bg-[#f5f5f7]">
                    {
                        !!RoundList?.length ?
                            RoundList.map((round) =>
                                <RoundCard round={round} refresh={refresh} id={id} />) :
                            <Empty description={'暂无数据'} />
                    }
                </div>
            </div>
    )
}