import { ColumnsType } from "antd/es/table"
import { SelectedTutorType, StuChooseTeachType } from "@/objects/task"
import { SearchOutlined, RedoOutlined } from "@ant-design/icons"
import { Form, Row, Col, Input, Button, Popconfirm, Table, Select } from "antd"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getChooseTeachList } from "@/api/student/task"
import { useEffect, useState, useMemo } from "react"
import { jobTitleOption } from "../Components/Form/TeachInfo"


interface ChooseTeachContentPropType {
    id: string,
    selectedTutorList: {
        tutorId1: SelectedTutorType,
        tutorId2: SelectedTutorType,
        tutorId3: SelectedTutorType
    },
    taskStatus: number,
    tutorList: SelectedTutorType[],
    setTutorList: (v: SelectedTutorType[]) => void
}

export const MAX_SELECT_TUTOR = 3

export function ChooseTeachContent({ id, selectedTutorList, taskStatus, tutorList, setTutorList
}: ChooseTeachContentPropType) {
    const { loading: TeachListLoading, data: TeachList, run: getTeach } = useRequest(useApi(getChooseTeachList), { manual: true })
    const [params, setParams] = useState({ page: 1, size: 5 })
    useEffect(() => { getTeach({ id, ...params }) }, [params])
    useEffect(() => {
        // 初始化志愿老师信息
        // FIXME:React会把多次setState合并一次处理....
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
    }, [selectedTutorList])
    const chooseTeachHeader = () => {
        const [form] = Form.useForm()
        return (
            <>
                <div className="flex items-center">
                    <span className="font-bold text-lg mr-2">申请导师</span>
                    <span className="text-[#909398] text-md">
                        {`可选导师数量：${MAX_SELECT_TUTOR - tutorList?.length}`}
                    </span>
                </div>
                <Form layout="inline" form={form}>
                    <Row gutter={[, 8]}>
                        <Col span={11}>
                            <Form.Item label="导师姓名" name={'teaName'}>
                                <Input placeholder="请输入导师姓名" />
                            </Form.Item>
                        </Col>
                        <Col span={11}>
                            <Form.Item label="研究方向" name={'keywords'}>
                                <Input placeholder="请输入研究方向" />
                            </Form.Item>
                        </Col>
                        <Col span={11}>
                            <Form.Item label="导师团队" name={'teamName'}>
                                <Input placeholder="请输入导师团队" />
                            </Form.Item>
                        </Col>
                        <Col span={11}>
                            <Form.Item label="导师职称" name={'jobTitle'}>
                                <Select dropdownStyle={{ width: "150px" }} allowClear placeholder={'请选择职称'} options={jobTitleOption} />
                            </Form.Item>
                        </Col>
                        <Col span={2}>
                            <div className="flex">
                                <Form.Item>
                                    <Button type="primary" shape="circle" icon={<SearchOutlined />}
                                        onClick={() => {
                                            setParams({ ...params, ...form.getFieldsValue(true) })
                                        }}
                                    />
                                </Form.Item>
                                <Button className="ml-2" type="primary" shape="circle" icon={<RedoOutlined />}
                                    onClick={() => {
                                        setParams({ page: 1, size: 5 })
                                    }}
                                ></Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </>
        )
    }
    const chooseTeachColumns = useMemo<ColumnsType<StuChooseTeachType>>(() => {
        return [
            { title: '姓名', dataIndex: 'name', key: 'name' },
            { title: '团队', dataIndex: 'teamName', key: 'teamName' },
            { title: '职称', dataIndex: 'jobTitle', key: 'jobTitle' },
            { title: '研究方向', dataIndex: 'keywords', key: 'keywords' },
            { title: '邮箱', dataIndex: 'mail', key: 'mail' },
            { title: '剩余名额', dataIndex: 'oddQuotas', key: 'oddQuotas' },
            {
                title: '操作', key: 'action', render: (_, { name, oddQuotas, id }) => {
                    return (
                        <Popconfirm title={`确认选择${name}老师？`} okText={'确认'}
                            cancelText='取消' onConfirm={() => {
                                let tempList = [...tutorList]
                                tempList.push(_)
                                setTutorList(tempList)
                            }}
                        >
                            <Button type="link"
                                disabled={
                                    !!taskStatus || tutorList?.length === MAX_SELECT_TUTOR || !oddQuotas
                                    || tutorList?.some(tutor => tutor?.id === id)
                                }
                            >选择</Button>
                        </Popconfirm>
                    )
                }
            },
        ]
    }, [taskStatus, tutorList])
    const resultColumns = useMemo<ColumnsType<SelectedTutorType & { idx: number }>>(() => {
        return [
            { title: '名称', dataIndex: 'name', key: 'name' },
            { title: '志愿顺序', dataIndex: 'idx', key: 'idx' },
            {
                title: '操作', key: 'action', render: (_, { name, idx }) => {
                    return (
                        <Popconfirm title={`确认撤销选择${name}`} okText={'确认'}
                            cancelText='取消' onConfirm={() => {
                                let tempList = [...tutorList]
                                tempList.splice(idx - 1, 1)
                                setTutorList(tempList)
                            }}>
                            <Button type="link" disabled={!!taskStatus}>撤销</Button>
                        </Popconfirm>
                    )
                }
            }
        ]
    }, [tutorList, taskStatus])

    return (
        <>
            <Table
                title={chooseTeachHeader} bordered
                loading={TeachListLoading}
                columns={chooseTeachColumns}
                dataSource={TeachList?.userMaps}
                pagination={{
                    showSizeChanger: true,
                    total: TeachList?.total,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: params?.size,
                    current: params?.page,
                    onChange: (page, size) => {
                        setParams({ ...params, page, size })
                    }
                }}
            />
            <Table
                title={() => (<span className="text-lg font-bold">申请志愿</span>)}
                dataSource={tutorList?.map((tutor, idx) => ({
                    ...tutor,
                    idx: idx + 1
                }))}
                columns={resultColumns} bordered className="mt-2"
                pagination={false}
            />
        </>
    )
}