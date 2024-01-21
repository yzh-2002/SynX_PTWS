import { Collapse, Tabs, Picker, Input, Pagination, Button, Empty, Flex, Tag, Dialog, Toast } from "react-vant"
import { Search, Replay } from "@react-vant/icons"
import { useMemo, useState, useCallback, useEffect } from "react"
import PageLoading from "@/views/App/PageLoading"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getChooseTeachList, applyTutor, submitTask } from "@/api/student/task"
import { StuChooseTeachType, SelectedTutorType, StuTaskReturnType } from "@/objects/task"
import { MAX_SELECT_TUTOR } from "@/views/web/Student/TaskContent"

const SearchFields = [
    { text: '导师姓名', value: 'teaName' },
    { text: '导师团队', value: 'teamName' },
    { text: '研究方向', value: 'keywords' },
    { text: '导师职称', value: 'jobTitle' },
]

interface TeachCollapseCardPropType {
    teachInfo: StuChooseTeachType,
    tutorList: SelectedTutorType[],
    setTutorList: (v: SelectedTutorType[]) => void,
    taskStatus: number
}

function TeachCollapseCard({ teachInfo, tutorList, setTutorList, taskStatus }: TeachCollapseCardPropType) {
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
            <Collapse.Item title={teachInfo?.name}>
                <Flex wrap="wrap">
                    <Flex.Item span={12}>
                        <Description label="姓名" value={teachInfo?.name} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="团队" value={teachInfo?.teamName} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="职称" value={teachInfo?.jobTitle} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="研究方向" value={teachInfo?.keywords} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="邮箱" value={teachInfo?.mail} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="剩余名额" value={teachInfo?.oddQuotas} />
                    </Flex.Item>
                </Flex>
                <div className="flex justify-end">
                    <Button type="primary" size="small"
                        disabled={
                            !!taskStatus || tutorList?.length === MAX_SELECT_TUTOR || !teachInfo?.oddQuotas
                            || tutorList?.some(tutor => tutor?.id === teachInfo?.id)
                        }
                        onClick={() => {
                            let tempList = [...tutorList]
                            tempList.push(teachInfo as unknown as SelectedTutorType)
                            setTutorList(tempList)
                        }}>选择</Button>
                </div>
            </Collapse.Item>
        </Collapse>
    )
}

interface ChooseTeachListPropType {
    // ChooseTeachList不使用以下三个属性，仅为将其传给TeachCollapseCard（TODO：考虑使用Context？？）
    tutorList: SelectedTutorType[],
    setTutorList: (v: SelectedTutorType[]) => void
    taskStatus: number
}

function ChooseTeachList({ tutorList, setTutorList, taskStatus }: ChooseTeachListPropType) {
    const [searchField, setSearchField] = useState('teaName')
    const [searchValue, setSearchValue] = useState('')
    const [page, setPage] = useState(1)
    const params = new URLSearchParams(window.location.search)
    const { loading: TeachListLoading, data: TeachList, run: getTeach } = useRequest(useApi(getChooseTeachList), {
        defaultParams: [{ id: params.get('rid')!, page, size: 5 }]
    })
    return (
        <>
            <div className="flex items-center p-2 mt-2 bg-white">
                <Picker popup={{ round: true }} columns={SearchFields} value={searchField}
                    onConfirm={(v: string) => {
                        setSearchField(v)
                        setSearchValue('')
                    }}
                >
                    {(val: string | string[], _, actions) => {
                        return <Input
                            className="h-8 bg-[#f5f5f7]" style={{ width: '240px' }}
                            placeholder="请选择搜索字段" onClick={() => actions.open()}
                            value={!!val ? SearchFields.find(v => v.value === val)?.text : ''}
                        />
                    }}
                </Picker>
                <Input className="h-8 bg-[#f5f5f7] mr-2" style={{ marginLeft: '4px' }}
                    value={searchValue} onChange={(v) => { setSearchValue(v) }}
                />
                <Button size="mini" type="primary" icon={<Search />} round onClick={() => {
                    getTeach({ id: params.get('rid')!, [searchField]: searchValue, page, size: 5 })
                }} />
                <Button size="mini" type="primary" icon={<Replay />} round onClick={() => {
                    setSearchField('')
                    setSearchValue('')
                    setPage(1)
                    getTeach({ id: params.get('rid')!, page: 1, size: 5 })
                }} />
            </div>
            <div className="bg-[#f5f5f7] my-2 h-2 flex items-center pl-4 text-[#909398]">{`共${TeachList?.total || 0}条数据`}</div>
            {
                TeachListLoading ? <PageLoading /> : (
                    !!TeachList?.total ? (
                        TeachList?.userMaps?.map((teach) =>
                            <TeachCollapseCard
                                teachInfo={teach}
                                tutorList={tutorList}
                                setTutorList={setTutorList}
                                taskStatus={taskStatus}
                            />)
                    ) : <Empty description={'暂无数据'} />
                )
            }
            <Pagination totalItems={TeachList?.total || 0} itemsPerPage={5} value={page} mode='simple'
                onChange={(page) => {
                    setPage(page)
                    getTeach({ id: params.get('rid')!, [searchField]: searchValue, page, size: 5 })
                }}
            />
        </>
    )
}

interface WishTeachListPropType {
    tutorList: SelectedTutorType[],
    setTutorList: (v: SelectedTutorType[]) => void
    taskStatus: number,
    rid: string,
    refresh: () => void
}

function WishTeachList({ tutorList, setTutorList, taskStatus, rid, refresh }: WishTeachListPropType) {
    const { loading: ApplyLoading, runAsync: apply } = useRequest(useApi(applyTutor), { manual: true })
    const { loading: SubmitLoading, runAsync: submit } = useRequest(useApi(submitTask), { manual: true })
    return (
        !!tutorList?.length ? (
            <div>
                {
                    tutorList?.map((tutor, idx) => (
                        <div className="flex justify-between my-2 bg-white p-2">
                            <div className="flex items-center">
                                <span className="mr-2">{tutor?.name}</span>
                                <Tag color="#f50">{`${idx + 1}志愿`}</Tag>
                            </div>
                            <Button type="primary" size="small"
                                disabled={!!taskStatus}
                                onClick={() => {
                                    let tempList = [...tutorList]
                                    tempList.splice(idx - 1, 1)
                                    setTutorList(tempList)
                                }}>撤销</Button>
                        </div>
                    ))
                }
                <div className="flex justify-center">
                    <Button type="primary" size="small" className="w-1/3"
                        style={{ marginRight: '8px' }} disabled={!!taskStatus || !tutorList?.length}
                        loading={ApplyLoading}
                        onClick={() => {
                            Dialog.show({
                                title: '提示',
                                message: '将导师志愿选择保存至云端，等待提交确认',
                                showCancelButton: true,
                                onConfirm: () => {
                                    return new Promise(r => {
                                        apply({
                                            id: rid,
                                            tutorId1: tutorList[0]?.id,
                                            tutorId2: tutorList[1]?.id,
                                            tutorId3: tutorList[2]?.id
                                        }, { message: true }).then(() => {
                                            r(true)
                                            Toast.success('保存志愿成功')
                                            refresh()
                                        })
                                    })
                                }
                            })
                        }}
                    >保存导师意向</Button>
                    <Button type="primary" size="small" className="w-1/3" disabled={!!taskStatus}
                        loading={SubmitLoading}
                        onClick={() => {
                            Dialog.show({
                                title: '二次确认',
                                message: '确认提交任务？一旦提交，将无法修改申请信息，请确定提交！',
                                showCancelButton: true,
                                onConfirm: () => {
                                    return new Promise(r => {
                                        submit({ id: rid }, { message: true }).then(() => {
                                            r(true)
                                            Toast.success('提交任务成功')
                                            refresh()
                                        })
                                    })
                                }
                            })
                        }}
                    >提交申请</Button>
                </div>
            </div>
        ) : <Empty description="暂无志愿" />
    )
}

interface ChooseTeachPropType {
    task: StuTaskReturnType
    refresh: () => void //刷新当前轮次学生任务信息
}

export default function ChooseTeach({ task, refresh }: ChooseTeachPropType) {
    // 当前学生选择的志愿老师，注意其在数组中的顺序即为志愿顺序
    const [tutorList, setTutorList] = useState<SelectedTutorType[]>([])
    useEffect(() => {
        const selectedTutorList = task?.currentSelectedTutor
        if (!!selectedTutorList) {
            let tempList = []
            for (let i = 1; i <= MAX_SELECT_TUTOR; i++) {
                const tutor = selectedTutorList[`tutorId${i}` as (keyof typeof selectedTutorList)]
                if (!!tutor) {
                    tempList.push(tutor)
                }
            }
            setTutorList(tempList)
        }
    }, [task?.currentSelectedTutor])

    const TabContents = useMemo(() => {
        return [
            { key: 'teach', title: '申请导师', children: <ChooseTeachList tutorList={tutorList} setTutorList={setTutorList} taskStatus={task?.status} /> },
            {
                key: 'wish', title: '申请志愿', children: (
                    <WishTeachList
                        tutorList={tutorList} setTutorList={setTutorList}
                        taskStatus={task?.status}
                        rid={task?.processInfo?.id}
                        refresh={refresh}
                    />)
            }
        ]
    }, [tutorList, task?.status, task?.processInfo?.id])

    return (
        <div className="bg-[#f5f5f7] flex flex-col">
            <div className="bg-white mt-2">
                <Collapse>
                    <Collapse.Item title={
                        <span className="font-bold text-lg p-2 mb-2 bg-white">申请导师</span>
                    }>
                        <div>
                            <div>请考生填报3名志愿导师，并根据一志愿、二志愿、三志愿进行排序（排序显示在页面下部）。</div>
                            <div>本轮填报时间：{`${''}--${''}`}</div>
                            <div>点击“保存导师志愿”，将导师志愿信息暂存云端，提交申请前需要先保存导师志愿信息，提交申请后不允许再修改简历PDF和导师志愿信息。</div>
                            <div>填报结束后，请务必点击"提交申请"。</div>
                        </div>
                    </Collapse.Item>
                </Collapse>
            </div>
            <Tabs className="mb-2">
                {TabContents.map(item => (
                    <Tabs.TabPane key={item?.key} title={item?.title}>{item?.children}</Tabs.TabPane>
                ))}
            </Tabs>
        </div>
    )
}