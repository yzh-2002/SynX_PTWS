import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getTeachTaskInfo, verifyStu } from "@/api/teacher/task"
import PageLoading from "@/views/App/PageLoading"
import CollapseCard, { CollapseCardPropType } from "../Components/CollapseCard"
import { useMemo } from "react"
import { Button, Popconfirm, Table, Tag } from "antd"
import { StuInfoType } from "@/objects/task"
import { ColumnsType } from "antd/es/table"
import { FilePdfOutlined } from "@ant-design/icons"

const ChineseNumbers = ['零', '一', '二', '三']

interface TeachTaskContentPropType {
    stuList: StuInfoType[],
    oddQuotas: number,
    processId: string,
    refresh: () => void
}

function TeachTaskContent({ stuList, oddQuotas, processId, refresh }: TeachTaskContentPropType) {
    const { loading: VerifyLoading, runAsync: Verify } = useRequest(useApi(verifyStu), { manual: true })

    const TeachTaskColumns = useMemo<ColumnsType<StuInfoType>>(() => {
        return [
            { title: '姓名', dataIndex: 'name', key: 'name' },
            {
                title: '简历', dataIndex: 'fileUrl', key: 'fileUrl', render: (_, { fileUrl }) => {
                    return <a href={fileUrl} target="_blank">
                        <FilePdfOutlined />
                        <span>点我预览</span>
                    </a>
                }
            },
            { title: '考号', dataIndex: 'code', key: 'code' },
            { title: '手机号', dataIndex: 'account', key: 'account' },
            {
                title: '操作', key: 'action', render: (_, { id, name }) => {
                    return (
                        <>
                            <Popconfirm title={`确认选择${name}考生？`} okText={'确定'} cancelText={'取消'}
                                onConfirm={() => {
                                    Verify({ processId, stuId: id, status: 0 }, { message: true, success: '选择成功' }).then(() => {
                                        refresh()
                                    })
                                }}
                            >
                                <Button type="link" loading={VerifyLoading}>选择</Button>
                            </Popconfirm>
                            <Popconfirm title={`确认拒绝${name}考生？`} okText={'确定'} cancelText={'取消'}
                                onConfirm={() => {
                                    Verify({ processId, stuId: id, status: 1 }, { message: true, success: '选择成功' }).then(() => {
                                        refresh()
                                    })
                                }}
                            >
                                <Button type="link" loading={VerifyLoading}>拒绝</Button>
                            </Popconfirm>
                        </>
                    )
                }
            }
        ]
    }, [])

    return (
        <Table
            title={() => (
                <>
                    <span className="font-bold text-lg mr-2">选择学生</span>
                    <span>{`剩余可选名额：${oddQuotas}`}</span>
                </>
            )}
            columns={TeachTaskColumns} bordered
            dataSource={stuList}
        />
    )
}

const CLASS_ALIAS = ['成功匹配', '管理匹配', '拒绝匹配']
const CLASS_COLOR = ['#1ee30a', '#108ee9', '#f50']
// class表示类型，0->成功匹配 1->管理匹配 2->拒绝匹配
function TeachTaskResult({ stuList }: { stuList: (StuInfoType & { type: number })[] }) {
    const TeachTaskResultColumns = useMemo<ColumnsType<StuInfoType & { type: number }>>(() => {
        return [
            { title: '姓名', dataIndex: 'name', key: 'name' },
            {
                title: '简历', dataIndex: 'fileUrl', key: 'fileUrl', render: (_, { fileUrl }) => {
                    return <a href={fileUrl} target="_blank">
                        <FilePdfOutlined />
                        <span>点我预览</span>
                    </a>
                }
            },
            { title: '考号', dataIndex: 'code', key: 'code' },
            { title: '手机号', dataIndex: 'account', key: 'account' },
            {
                title: '匹配类型', dataIndex: 'class', key: 'class', render: (_, { type }) => {
                    return <Tag color={CLASS_COLOR[type]}>{CLASS_ALIAS[type]}</Tag>
                }
            }
        ]
    }, [])
    return <Table
        columns={TeachTaskResultColumns}
        dataSource={stuList}
        pagination={false}
    />
}

export default function TeachTask() {
    const params = new URLSearchParams(window.location.search)
    const { loading: TaskInfoLoading, data: TaskInfo, refresh } = useRequest(useApi(getTeachTaskInfo), {
        defaultParams: [{ id: params.get('pid') || '', stage: parseInt(params.get('stage') || '') }]
    })
    const TaskInfoCardConfig = useMemo<CollapseCardPropType>(() => {
        const stage = parseInt(params.get('stage') || '')
        const duration = !!TaskInfo?.processInfo?.duration ? JSON.parse(TaskInfo?.processInfo?.duration) : null
        return {
            content: {
                key: 'task-card',
                label: `${ChineseNumbers?.[stage]}志愿审核`,
                children: <TeachTaskContent
                    stuList={TaskInfo?.stageMap?.notSelectStuInfo!}
                    oddQuotas={TaskInfo?.quotaInfo?.oddQuotas!}
                    processId={TaskInfo?.processInfo?.id!}
                    refresh={refresh}
                />
            },
            activeKey: 'task-card',
            header: {
                title: `${ChineseNumbers?.[stage]}志愿审核`,
                appendix: `起止日期：${duration?.[`start_${stage + 1}`]}--${duration?.[`end_${stage + 1}`]}`
            }
        }
    }, [TaskInfo?.processInfo?.duration, TaskInfo?.stageMap?.notSelectStuInfo,
    TaskInfo?.quotaInfo?.oddQuotas, TaskInfo?.processInfo?.id])

    const TaskResultCardConfig = useMemo<CollapseCardPropType>(() => {
        return {
            content: {
                label: '任务结果',
                children: <TeachTaskResult stuList={[
                    ...((TaskInfo?.adminStuInfo || [])?.map(item => ({ ...item, type: 1 }))),
                    ...((TaskInfo?.stageMap?.passStuInfo || [])?.map(item => ({ ...item, type: 0 }))),
                    ...((TaskInfo?.stageMap?.rejectStuInfo || [])?.map(item => ({ ...item, type: 2 })))
                ]} />
            },
            header: { title: '任务结果', }
        }
    }, [TaskInfo?.adminStuInfo, TaskInfo?.stageMap])
    return (
        TaskInfoLoading ? <PageLoading /> :
            <>
                <CollapseCard {...TaskInfoCardConfig} />
                <CollapseCard {...TaskResultCardConfig} />
            </>
    )
}