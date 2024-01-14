import { serviceInfoAsync } from "@/store/service"
import { useRecoilValue } from "recoil"
import CollapseCard, { CollapseCardPropType } from "../Components/CollapseCard"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getRoundList, updateRoundStatus } from "@/api/admin/round"
import PageLoading from "@/views/App/PageLoading"
import { Button, Empty, Modal, Popconfirm, Table, Tag } from "antd"
import { RoundReturnType } from "@/objects/round"
import { ROUND_STATUS, ROUND_STATUS_COLOR } from "@/constants/round"
import { ColumnsType } from "antd/es/table"
import { convert_to_table, convert_to_form, RoundTableItemType } from "@/utils/roundForm"
import RoundForm from "../Components/Form/Round"
import { useState } from "react"

function RoundConfigTable({ round }: { round: RoundReturnType }) {
    const columns: ColumnsType<RoundTableItemType> = [
        { title: '任务名称', dataIndex: 'taskName', key: 'taskName' },
        { title: '任务顺序', dataIndex: 'taskOrder', key: 'taskOrder' },
        { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
        { title: '结束时间', dataIndex: 'endTime', key: 'endTime' },
        { title: '扩展字段', dataIndex: 'extension', key: 'extension' },
    ]
    return <Table columns={columns} dataSource={convert_to_table(round)} pagination={false} />
}


export default function RoundInfo() {
    const service = useRecoilValue(serviceInfoAsync)
    const { loading: RoundLoading, data: RoundList, refresh } = useRequest(useApi(getRoundList))
    const { loading: UpdateStatusLoading, runAsync: updateStatus } = useRequest(useApi(updateRoundStatus), { manual: true })
    const GenerateCardConfig = (round: RoundReturnType, idx: number): CollapseCardPropType => {
        return {
            content: {
                key: round.name + idx,
                label: round.name,
                children: <RoundConfigTable round={round} />
            },
            header: {
                title: round.name,
                tag: <Tag color={ROUND_STATUS_COLOR[round.status]}>{ROUND_STATUS[round.status]}</Tag>,
                action: (
                    /**
                     * notStart:发布，编辑，删除
                     * noGoing:撤回
                     * end:编辑，删除
                     */
                    <div>
                        {round.status !== 'end' &&
                            <Popconfirm title={`确定要变更工作状态至${round.status === 'notStart' ? '已发布' : '未发布'}？`}
                                okText={'确定'} cancelText={'取消'} onConfirm={() => {
                                    updateStatus({ id: round.id }, { message: true, success: `${round.status === 'notStart' ? '发布' : '撤回'}轮次成功` }).then(() => {
                                        refresh()
                                    })
                                }}
                            >
                                <Button className="mr-2" type="primary" loading={UpdateStatusLoading}>{round.status === 'notStart' ? '发布' : '撤回'}</Button>
                            </Popconfirm>
                        }
                        {round.status !== 'onGoing' &&
                            <>
                                <Button className="mr-2" type="primary" onClick={() => {
                                    setIsEdit(true)
                                    setRound(round)
                                    setModalOpen(true)
                                }}>编辑</Button>
                                <Button danger>删除</Button>
                            </>
                        }
                    </div>
                )
            }
        }
    }
    const [modalOpen, setModalOpen] = useState(false)
    const [round, setRound] = useState<RoundReturnType>()
    const [isEdit, setIsEdit] = useState(false)

    return (
        <div className="w-4/5 m-auto mt-2 flex flex-col items-center">
            <span className=" text-lg font-bold">{service.name}</span>
            {
                RoundLoading ? <PageLoading /> : (
                    !!RoundList?.length ? (
                        RoundList.map((round, idx) => <CollapseCard key={round.id} {...GenerateCardConfig(round, idx)} />)
                    ) : <Empty description="暂无数据" />
                )
            }
            <Button type="primary" className="mt-2" onClick={() => {
                setIsEdit(false)
                setModalOpen(true)
            }}>创建导师匹配轮次</Button>
            <Modal width={850} title={isEdit ? '修改信息' : '创建轮次'} open={modalOpen}
                onCancel={() => setModalOpen(false)} destroyOnClose footer={null}
            >
                <RoundForm workId={service.id} RoundId={round?.id!}
                    isEdit={isEdit} roundInfo={round && convert_to_form(round)}
                    callback={() => {
                        setModalOpen(false)
                        refresh()
                    }}
                />
            </Modal>
        </div >
    )
}