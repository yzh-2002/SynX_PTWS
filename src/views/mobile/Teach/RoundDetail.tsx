import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { useMemo, useCallback, ReactNode, useState } from "react"
import PageLoading from "@/views/App/PageLoading"
import { getTeachTaskInfo, verifyStu } from "@/api/teacher/task"
import { ChineseNumbers, CLASS_ALIAS, CLASS_COLOR } from "@/views/web/Teacher/Task"
import { Tabs, Collapse, Flex, Empty, Tag, Pagination, Button, Dialog, Toast } from "react-vant"
import { StuInfoType } from "@/objects/task"
import { NewspaperO } from "@react-vant/icons"

function ResultCollapseCard({ stuInfo }: { stuInfo: StuInfoType & { type: number } }) {
    const Description = useCallback(({ label, value }: { label: string, value: string | number | ReactNode | undefined }) => {
        return (
            <div>
                <span className="text-[#909398] mr-2">{`${label}:`}</span>
                <span className=" text-black">{!!value && value != 0 ? value : '暂无信息'}</span>
            </div>
        )
    }, [])
    console.log(stuInfo?.name)
    return (
        <Collapse>
            <Collapse.Item title={stuInfo?.name}>
                <Flex wrap="wrap">
                    <Flex.Item span={12}>
                        <Description label="姓名" value={stuInfo?.name} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="简历" value={
                            <a href={stuInfo?.fileUrl} target="_blank">
                                <NewspaperO />
                                <span>点我预览</span>
                            </a>
                        } />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="考号" value={stuInfo?.code} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="手机号" value={stuInfo?.account} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="匹配类型" value={
                            <Tag color={CLASS_COLOR[stuInfo?.type]}>{CLASS_ALIAS[stuInfo?.type]}</Tag>
                        } />
                    </Flex.Item>
                </Flex>
            </Collapse.Item>
        </Collapse>
    )
}

function ResultList({ StuResultList }: { StuResultList: (StuInfoType & { type: number })[] }) {
    console.log(StuResultList)
    return (
        <div className="mt-2">
            {
                !!StuResultList?.length ? (
                    StuResultList?.map((stu) => {
                        return (
                            <ResultCollapseCard stuInfo={stu} />
                        )
                    })
                ) : <Empty description="暂无数据" />
            }
        </div>
    )
}

interface ChooseStuListPropType {
    stuList: StuInfoType[],
    oddQuotas: number,
    refresh: () => void
}

function ChooseStuList({ stuList, oddQuotas, refresh }: ChooseStuListPropType) {
    const [page, setPage] = useState(1)
    const params = new URLSearchParams(window.location.search)
    const { runAsync: Verify } = useRequest(useApi(verifyStu), { manual: true })

    const Description = useCallback(({ label, value }: { label: string, value: string | number | ReactNode | undefined }) => {
        return (
            <div>
                <span className="text-[#909398] mr-2">{`${label}:`}</span>
                <span className=" text-black">{!!value && value != 0 ? value : '暂无信息'}</span>
            </div>
        )
    }, [])

    return (
        <>
            <div className="bg-[#f5f5f7] my-2 h-2 flex justify-between items-center pl-4 text-[#909398]">
                <span>{`共${stuList?.length || 0}条数据`}</span>
                <span className="mr-4">{`剩余可选名额：${oddQuotas}`}</span>
            </div>
            {
                !!stuList?.length ? (
                    stuList?.map((stu) => (
                        <Collapse>
                            <Collapse.Item title={stu?.name}>
                                <Flex wrap="wrap">
                                    <Flex.Item span={12}>
                                        <Description label="姓名" value={stu?.name} />
                                    </Flex.Item>
                                    <Flex.Item span={12}>
                                        <Description label="简历" value={
                                            <a href={stu?.fileUrl} target="_blank">
                                                <NewspaperO />
                                                <span>点我预览</span>
                                            </a>
                                        } />
                                    </Flex.Item>
                                    <Flex.Item span={12}>
                                        <Description label="考号" value={stu?.code} />
                                    </Flex.Item>
                                    <Flex.Item span={12}>
                                        <Description label="手机号" value={stu?.account} />
                                    </Flex.Item>
                                </Flex>
                                <div className="flex justify-end">
                                    <Button type="primary" size="small" style={{ marginRight: '8px' }}
                                        onClick={() => {
                                            Dialog.show({
                                                title: '二次确认',
                                                message: `确定选择${stu?.name}考生？`,
                                                showCancelButton: true,
                                                onConfirm: () => {
                                                    return new Promise(r => {
                                                        Verify({ processId: params.get('rid')!, stuId: stu?.id, status: 0 }, { message: true }).then(() => {
                                                            r(true)
                                                            Toast.success('选择成功')
                                                            refresh()
                                                        })
                                                    })
                                                }
                                            })
                                        }}>选择</Button>
                                    <Button type="danger" size="small"
                                        onClick={() => {
                                            Dialog.show({
                                                title: '二次确认',
                                                message: `确定拒绝${stu?.name}考生？`,
                                                showCancelButton: true,
                                                onConfirm: () => {
                                                    return new Promise(r => {
                                                        Verify({ processId: params.get('rid')!, stuId: stu?.id, status: 1 }, { message: true }).then(() => {
                                                            r(true)
                                                            Toast.success('拒绝成功')
                                                            refresh()
                                                        })
                                                    })
                                                }
                                            })
                                        }}>拒绝</Button>
                                </div>
                            </Collapse.Item>
                        </Collapse>
                    ))
                ) : <Empty description={'暂无数据'} />
            }
            <Pagination totalItems={stuList?.length || 0} itemsPerPage={5} value={page} mode='simple'
                onChange={(page) => {
                    setPage(page)
                }}
            />
        </>
    )
}

export default function RoundDetail() {
    const params = new URLSearchParams(window.location.search)
    const { loading: TaskLoading, data: taskInfo, refresh } = useRequest(useApi(getTeachTaskInfo), {
        defaultParams: [{ id: params?.get('rid') || '', stage: parseInt(params.get('stage')!) }]
    })

    const TabContents = useMemo(() => {
        return [
            {
                key: 'choose-stu',
                title: `${ChineseNumbers[parseInt(params.get('stage')!)]}志愿审核`,
                children: (
                    TaskLoading ? <PageLoading /> :
                        <ChooseStuList
                            stuList={taskInfo?.stageMap?.notSelectStuInfo!}
                            oddQuotas={taskInfo?.quotaInfo?.oddQuotas!}
                            refresh={refresh}
                        />
                )
            },
            {
                key: 'result', title: '任务结果', children: (
                    TaskLoading ? <PageLoading /> : <ResultList
                        StuResultList={
                            [
                                ...((taskInfo?.adminStuInfo || [])?.map(item => ({ ...item, type: 1 }))),
                                ...((taskInfo?.stageMap?.passStuInfo || [])?.map(item => ({ ...item, type: 0 }))),
                                ...((taskInfo?.stageMap?.rejectStuInfo || [])?.map(item => ({ ...item, type: 2 })))
                            ]
                        }
                    />
                )
            }
        ]
    }, [TaskLoading, taskInfo])

    return (
        <div className="bg-[#f5f5f7] flex flex-col">
            <span className="font-bold text-lg p-2 mb-2 bg-white">{
                decodeURIComponent(params.get('rname') || '')
            }</span>
            <Tabs className="mb-2">
                {TabContents.map(item => (
                    <Tabs.TabPane key={item?.key} title={item?.title}>{item?.children}</Tabs.TabPane>
                ))}
            </Tabs>
        </div>
    )
}