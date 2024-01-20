import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { Button, Modal, Popconfirm, Table, TableColumnsType } from "antd"
import { useEffect, useMemo, useState } from "react"

import { TeacherReturnType, SearchTeacherParams } from "@/objects/teacher"
import { getTeacherList, delTeacher, getNotSelectStuList, specifyStu } from "@/api/admin/teachInfo"
import { SearchTeacherForm, TeacherForm } from "../Components/Form/TeachInfo"
import { SearchSpecifyStuForm } from "../Components/Form/StuInfo"
import { StudentReturnType } from "@/objects/student"



export default function TeachInfoList({ id }: { id: string }) {
    const { loading: TeachLoading, data: TeachList, run: getTeach, refresh } = useRequest(useApi(getTeacherList), { manual: true })
    const { loading: DelLoading, runAsync: delTeach } = useRequest(useApi(delTeacher), { manual: true })
    // 获取未双选学生信息列表 & 管理员为教师指定学生
    const { loading: NotSelectedLoading, data: NotSelectedStu, run: getNoSelected, refresh: refreshNotSelected } = useRequest(useApi(getNotSelectStuList), {
        manual: true
    })
    const { loading: SpecifyLoading, runAsync: Specify } = useRequest(useApi(specifyStu), { manual: true })
    // 教师列表搜索参数
    const [params, setParams] = useState<SearchTeacherParams>({ page: 1, size: 5 })
    // 未选择导师列表搜索参数
    const [noSelectParams, setNoSelectParams] = useState({ page: 1, size: 5 })
    useEffect(() => { getTeach({ id, ...params }) }, [params])
    useEffect(() => { getNoSelected({ workId: id, ...noSelectParams }) }, [noSelectParams])
    const [teachModalOpen, setTeachModalOpen] = useState(false)
    // 指定学生Modal
    const [specifyStuModalOpen, setSpecifyStuModalOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    // 所选中的待修改信息的导师 & 同时也用于指定学生时获取所指老师id
    const [teachInfo, setTeachInfo] = useState<TeacherReturnType>()
    const TeachColumns = useMemo<TableColumnsType<TeacherReturnType>>(() => {
        return [
            {
                title: '姓名', dataIndex: 'name', key: 'name',
                render: (_, { name, details }) => {
                    return !!details && <a href={details} target="_blank">{name}</a> || name
                }
            },
            { title: '工号', dataIndex: 'code', key: 'code' },
            { title: '团队', dataIndex: 'teamName', key: 'teamName' },
            { title: '职称', dataIndex: 'jobTitle', key: 'jobTitle' },
            { title: '研究方向', dataIndex: 'keywords', key: 'keywords' },
            { title: '邮箱', dataIndex: 'mail', key: 'mail' },
            { title: '手机号', dataIndex: 'account', key: 'account' },
            { title: '全部名额', dataIndex: 'allQuotas', key: 'allQuotas' },
            { title: '剩余名额', dataIndex: 'oddQuotas', key: 'oddQuotas' },
            {
                title: '操作', key: 'action',
                render: (_, record) => {
                    return (
                        <>
                            <Button type="link" onClick={() => {
                                setTeachInfo(record)
                                setSpecifyStuModalOpen(true)
                            }}>指定学生</Button>
                            <Button type="link" onClick={() => {
                                setTeachInfo(record)
                                setIsEdit(true)
                                setTeachModalOpen(true)
                            }} >修改</Button>
                            <Popconfirm title={'确认删除该导师？'} okText={'确定'} cancelText={'取消'}
                                onConfirm={() => {
                                    delTeach({ id, ids: [record.id] }, { message: true, success: '删除导师成功' }).then(() => refresh())
                                }}
                            >
                                <Button loading={DelLoading} type="link" danger>删除</Button>
                            </Popconfirm>
                        </>
                    )
                }
            },
        ]
    }, [])
    const SpecifyStuColumns = useMemo<TableColumnsType<StudentReturnType>>(() => {
        return [
            { title: '姓名', dataIndex: 'name', key: 'name' },
            { title: '考号', dataIndex: 'code', key: 'code' },
            { title: '手机号', dataIndex: 'account', key: 'phone' },
            {
                title: '操作', key: 'action', render: (_, stu) => {
                    return (
                        <Popconfirm title={`确定要指定${stu?.name}？一旦选择，将无法撤销，请确定选择！`}
                            okText={'确定'} cancelText={'取消'} onConfirm={() => {
                                Specify({ teaId: teachInfo?.id!, stuId: stu?.id, workId: id }, {
                                    message: true, success: '指定成功'
                                }).then(() => {
                                    setSpecifyStuModalOpen(false)
                                    refreshNotSelected()
                                    refresh()
                                })
                            }}
                        >
                            <Button type="link" loading={SpecifyLoading}>选择</Button>
                        </Popconfirm>
                    )
                }
            }
        ]
    }, [teachInfo])
    return (
        <div>
            <SearchTeacherForm
                id={id}
                refresh={refresh}
                setParams={(v) => setParams({ ...params, ...v })}
                addTeach={() => {
                    setIsEdit(false)
                    setTeachModalOpen(true)
                }}
                refreshTable={() => setParams({ page: 1, size: 5 })}
            />
            <Table
                className="mt-4"
                loading={TeachLoading}
                columns={TeachColumns}
                dataSource={TeachList?.userInfo || []}
                pagination={{
                    hideOnSinglePage: true,
                    total: TeachList?.total,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: params?.size,
                    current: params?.page,
                    onChange: (page, size) => {
                        setParams({ ...params, page, size })
                    }
                }}
            />
            <Modal
                title={isEdit ? '修改信息' : '新增导师'}
                open={teachModalOpen}
                onCancel={() => setTeachModalOpen(false)}
                destroyOnClose
                footer={null}
            >
                <TeacherForm isEdit={isEdit} teachInfo={teachInfo} id={id} callback={() => {
                    setTeachModalOpen(false)
                    refresh()
                }} />
            </Modal>
            <Modal
                width={'80%'}
                title='指定学生' open={specifyStuModalOpen}
                onCancel={() => setSpecifyStuModalOpen(false)}
                destroyOnClose footer={null}
            >
                <SearchSpecifyStuForm
                    setParams={(v) => setNoSelectParams({ ...noSelectParams, ...v })}
                    refreshTable={() => setNoSelectParams({ page: 1, size: 5 })}
                />
                <Table
                    loading={NotSelectedLoading}
                    columns={SpecifyStuColumns}
                    dataSource={NotSelectedStu?.users}
                    pagination={{
                        hideOnSinglePage: true,
                        total: NotSelectedStu?.total,
                        pageSizeOptions: [5, 10, 20, 50, 100],
                        pageSize: noSelectParams?.size,
                        current: noSelectParams?.page,
                        onChange: (page, size) => {
                            setNoSelectParams({ ...noSelectParams, page, size })
                        }
                    }}
                />
            </Modal>
        </div>
    )
}