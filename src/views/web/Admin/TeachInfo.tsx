import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { Button, Modal, Popconfirm, Table, TableColumnsType } from "antd"
import { useEffect, useMemo, useState } from "react"

import { TeacherReturnType } from "@/objects/teacher"
import { getTeacherList } from "@/api/admin/teacher"
import { SearchTeacherForm, TeacherForm } from "../Components/Form/Teacher"



export default function TeachInfo({ id }: { id: string }) {
    const { loading: TeachLoading, data: TeachList, run: getTeach, refresh } = useRequest(useApi(getTeacherList), { manual: true })
    useEffect(() => { getTeach({ id }) }, [])
    const [teachModalOpen, setTeachModalOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    // 所选中的待修改信息的导师
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
                            <Button type="link">指定学生</Button>
                            <Button type="link" onClick={() => {
                                setTeachInfo(record)
                                setIsEdit(true)
                                setTeachModalOpen(true)
                            }} >修改</Button>
                            <Popconfirm title={'确认删除该导师？'} okText={'确定'} cancelText={'取消'}
                                onConfirm={() => { }}
                            >
                                <Button type="link" danger>删除</Button>
                            </Popconfirm>
                        </>
                    )
                }
            },
        ]
    }, [])

    return (
        <div>
            <SearchTeacherForm
                id={id}
                refresh={refresh}
                addTeach={() => {
                    setIsEdit(false)
                    setTeachModalOpen(true)
                }}
            />
            <Table
                className="mt-4"
                loading={TeachLoading}
                columns={TeachColumns}
                dataSource={TeachList?.userInfo || []}
                pagination={{
                    total: TeachList?.total,
                    pageSize: 5
                }}
            />
            <Modal
                title={isEdit ? '修改信息' : '新增导师'}
                open={teachModalOpen}
                onCancel={() => setTeachModalOpen(false)}
                destroyOnClose
                footer={null}
            >
                <TeacherForm />
            </Modal>
        </div>
    )
}