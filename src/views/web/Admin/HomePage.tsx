import { useRequest } from "ahooks"
import { getWorkInfo } from "@/api/admin/service"
import { useApi } from "@/api/request"
import { Button, Empty, Modal, Table, Tag, Popconfirm } from "antd"
import PageLoading from "@/views/App/PageLoading"
import { Fragment, useState } from "react"
import ServiceForm from "../Components/Form/Service"
import { ServiceReturnType } from "@/objects/service"
import CollapseCard, { CollapseCardPropType } from "../Components/CollapseCard"
import { ServiceStatus, ServiceStatusColor } from "@/constants/service"
import { ColumnsType } from "antd/es/table"
import { useNavigate } from "react-router-dom"
import { delWork, updateWorkStatus } from "@/api/admin/service"
import { serviceInfoState } from "@/store/service"
import { useRecoilState } from "recoil"

function ServiceConfigTable({ workInfo }: { workInfo: ServiceReturnType }) {
    const navigator = useNavigate()
    const data = [{ title: '轮次配置', }, { title: '师生导入', }, { title: "双选详情" }]
    const columns: ColumnsType<typeof data[0]> = [
        {
            title: '工作详情',
            dataIndex: 'title'
        },
        {
            title: '操作',
            dataIndex: 'action',
            render: (_, { title }) => {
                return <Button
                    type="link"
                    onClick={() => {
                        switch (title) {
                            case '轮次配置':
                                navigator(`/app/round-info`)
                                break;
                            case "师生导入":
                                navigator(`/app/teach-stu-info`)
                                break;
                            case "双选详情":
                                navigator("/app/ms-info")
                                break
                            default:
                                break;
                        }
                    }}
                >查看详情</Button>
            }
        }
    ]
    return <Table dataSource={data} columns={columns} pagination={false} />
}

export default function HomePage() {
    const [, setServiceInfo] = useRecoilState(serviceInfoState)
    // 获取导师匹配服务
    const { data: workInfo, loading: workInfoLoading, refresh } = useRequest(useApi(getWorkInfo), {
        defaultParams: [{ page: 1, size: 10 }],
        // 默认应用只有一个服务
        onSuccess: (data) => {
            setServiceInfo(data?.workInfo?.length && data.workInfo[0] ||
                { id: "", name: "", status: NaN, year: NaN })
        }
    })
    const { loading: delLoading, runAsync: del } = useRequest(useApi(delWork), { manual: true })
    const { loading: updateStatusLoading, runAsync: updateStatus } = useRequest(useApi(updateWorkStatus), { manual: true })
    // 当前被选中的work
    const [work, setWork] = useState<ServiceReturnType>()
    const [modalOpen, setModalOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false) //是否编辑 or 创建
    // 删除按钮二次确认框
    const [delModalOpen, setDelModalOpen] = useState(false)
    const GenerateCradConfig = (work: ServiceReturnType, idx: number): CollapseCardPropType => {
        return {
            content: {
                key: work.name + idx,
                label: work.name,
                showArrow: false,
                children: <ServiceConfigTable workInfo={work} />
            },
            // work卡片默认展开，且不可关闭
            activeKey: work.name + idx,
            collapsible: "disabled",
            header: {
                title: work.name,
                tag: <Tag color={ServiceStatusColor[work.status]}>{ServiceStatus[work.status]}</Tag>,
                action: (
                    !work.status ?
                        <Popconfirm placement="bottom" title={'确定要变更工作状态至未发布？'}
                            okText="确定" cancelText="取消" onConfirm={() => {
                                updateStatus({ id: work.id }, { message: true, success: '导师匹配服务撤回成功' }).then(() => refresh())
                            }}
                        >
                            <Button type="primary" loading={updateStatusLoading}>撤回</Button>
                        </Popconfirm> :
                        <div>
                            <Popconfirm placement="bottom" title={'确定要变更工作状态至已发布？'}
                                okText="确定" cancelText="取消" onConfirm={() => {
                                    updateStatus({ id: work.id }, { message: true, success: '导师匹配服务发布成功' }).then(() => refresh())
                                }}
                            >
                                <Button type="primary" className="mr-1" loading={updateStatusLoading}>发布</Button>
                            </Popconfirm>
                            <Button type="primary" className="mr-1"
                                onClick={() => {
                                    setWork(work)
                                    setModalOpen(true)
                                    setIsEdit(true)
                                }}
                            >编辑</Button>
                            <Popconfirm placement="bottom" title={'即将删除导师匹配服务全部数据，不可恢复！请确认删除？'}
                                okText="确定" cancelText="取消" onConfirm={() => { setDelModalOpen(true) }}
                            >
                                <Button danger>删除</Button>
                            </Popconfirm>
                            <Modal title="确认删除？" open={delModalOpen} onCancel={() => { setDelModalOpen(false) }}
                                confirmLoading={delLoading} cancelText={'取消'} okText={'确定'}
                                onOk={() => del({ ids: [work.id] }, { message: true, success: '删除成功' }).then(() => {
                                    setDelModalOpen(false)
                                    refresh()
                                })}
                            >
                                请再次确认是否删除？一旦删除，不可恢复！请确认删除？
                            </Modal>
                        </div>
                )
            }
        }
    }
    return (
        <>
            {
                workInfoLoading ? <PageLoading /> :
                    (
                        !workInfo?.total ? (
                            <div className="flex flex-col items-center mt-2">
                                <Empty description="暂无数据" />
                                <Button type="primary"
                                    onClick={() => {
                                        setModalOpen(true)
                                        setIsEdit(false)
                                    }}
                                >创建导师匹配服务</Button>
                            </div>
                        ) : (
                            <Fragment>
                                {workInfo?.workInfo?.map((work, idx) => (
                                    <CollapseCard key={work.id} {...GenerateCradConfig(work, idx)} />
                                ))}
                            </Fragment>
                        )
                    )
            }
            <Modal
                title={isEdit ? '修改工作' : '新增工作'}
                open={modalOpen}
                onCancel={() => { setModalOpen(false) }}
                //FIXME: 保证每次渲染的表单字段为后端存储值（但会损失部分性能）
                destroyOnClose={true}
                footer={null}
            >
                <ServiceForm service={work} isEdit={isEdit} closeModal={() => setModalOpen(false)} refresh={refresh} />
            </Modal>
        </>
    )
}