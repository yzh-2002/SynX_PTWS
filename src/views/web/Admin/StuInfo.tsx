import { Button, Modal, Table, TableColumnsType, Popconfirm } from "antd"
import { SearchStuInfoForm, StuInfoForm } from "../Components/Form/StuInfo"
import { useEffect, useMemo, useState } from "react"
import { getStuList, delStu } from "@/api/admin/stuInfo"
import { SearchStudentParams, StudentReturnType } from "@/objects/student"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"


export default function StuInfo({ id }: { id: string }) {
    const { loading: StuLoading, data: StuList, run: getStu, refresh } = useRequest(useApi(getStuList), { manual: true })
    const { loading: DelLoading, runAsync: delStuInfo } = useRequest(useApi(delStu), { manual: true })
    const [params, setParams] = useState<SearchStudentParams>({ page: 1, size: 5 })
    useEffect(() => { getStu({ id, ...params }) }, [params])
    const [stuModalOpen, setStuModalOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    // 所选中的待修改信息的学生
    const [stuInfo, setStuInfo] = useState<StudentReturnType>()
    const StuInfoColumns = useMemo<TableColumnsType<StudentReturnType>>(() => {
        return [
            { title: '考号', dataIndex: 'code', key: 'code' },
            { title: '姓名', dataIndex: 'name', key: 'name' },
            { title: '手机号', dataIndex: 'account', key: 'phone' },
            {
                title: '操作', key: 'action', render: (_, record) => {
                    return (
                        <>
                            <Button type="link" onClick={() => {
                                setIsEdit(true)
                                setStuInfo(record)
                                setStuModalOpen(true)
                            }}>修改</Button>
                            <Popconfirm title={'确认删除该学生？'} okText={'确定'} cancelText={'取消'}
                                onConfirm={() => {
                                    // TODO：强制删除功能是否要实现？？
                                    delStuInfo({ id, ids: [record.id], force: 0 }, { message: true, success: '删除学生成功' }).then(() => refresh())
                                }}
                            >
                                <Button loading={DelLoading} type="link" danger>删除</Button>
                            </Popconfirm>
                        </>
                    )
                }
            }
        ]
    }, [])

    return (
        <div>
            <SearchStuInfoForm
                id={id}
                refresh={refresh}
                addStu={() => {
                    setIsEdit(false)
                    setStuModalOpen(true)
                }}
                setParams={(v) => setParams({ ...params, ...v })}
                refreshTable={() => setParams({ page: 1, size: params.size })}
            />
            <Table
                className="mt-2"
                columns={StuInfoColumns}
                loading={StuLoading}
                dataSource={StuList?.userInfo}
                pagination={{
                    showSizeChanger: true,
                    total: StuList?.total,
                    pageSizeOptions: [5, 10, 20, 50, 100],
                    pageSize: params?.size,
                    current: params?.page,
                    onChange: (page, size) => {
                        setParams({ ...params, page, size })
                    }
                }}
            />
            <Modal title={isEdit ? '修改信息' : '新增导师'}
                open={stuModalOpen}
                onCancel={() => setStuModalOpen(false)}
                destroyOnClose
                footer={null}
            >
                <StuInfoForm isEdit={isEdit} stuInfo={stuInfo} id={id} callback={() => {
                    setStuModalOpen(false)
                    refresh()
                }}
                />
            </Modal>
        </div>
    )
}