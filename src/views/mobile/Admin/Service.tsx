import { Button, Empty, Input, Tag, Dialog, Toast } from "react-vant";
import { Search } from "@react-vant/icons"
import { useNavigate } from "react-router-dom";
import { ServiceReturnType } from "@/objects/service";
import { useRequest } from "ahooks";
import { useApi } from "@/api/request";
import { getWorkInfo, updateWorkStatus, delWork } from "@/api/admin/service";
import PageLoading from "@/views/App/PageLoading";
import { ServiceStatus, ServiceStatusColor } from "@/constants/service";
import { useRecoilState } from "recoil";
import { serviceInfoState } from "@/store/service";

interface ServiceCardPropType {
    service: ServiceReturnType
    refresh: () => void
}

function ServiceCard({ service, refresh }: ServiceCardPropType) {
    const { runAsync: updateStatus } = useRequest(useApi(updateWorkStatus), { manual: true })
    const { runAsync: del } = useRequest(useApi(delWork), { manual: true })

    const navigator = useNavigate()
    return (
        <div className="p-2 pl-4 mb-0.5 bg-white flex flex-col cursor-pointer"
            onClick={() => navigator(`/app/service-detail?id=${service.id}`)}
        >
            <div className="flex items-center">
                <span className="text-lg font-bold mr-2">{service?.name}</span>
                <Tag color={ServiceStatusColor[service.status]}>{ServiceStatus[service.status]}</Tag>
            </div>
            <div className="flex justify-end">
                {
                    service.status ?
                        <>
                            <Button size="small" type="primary" style={{ marginRight: '4px' }} onClick={(e) => {
                                e.stopPropagation()
                                Dialog.show({
                                    title: '二次确认',
                                    message: '确定要变更工作状态至已发布？',
                                    showCancelButton: true,
                                    onConfirm: () => {
                                        return new Promise(r => {
                                            updateStatus({ id: service?.id }, { message: true }).then(() => {
                                                r(true)
                                                Toast.success('发布成功')
                                                refresh()
                                            })
                                        })
                                    }
                                })
                            }}>发布</Button>
                            <Button size="small" type="primary" style={{ marginRight: '4px' }} onClick={(e) => {
                                e.stopPropagation()
                                navigator(`/app/create-service?id=${service.id}`)
                            }}>编辑</Button>
                            <Button size="small" type="danger"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    Dialog.show({
                                        title: '二次确认',
                                        message: '即将删除导师匹配服务全部数据，不可恢复！请确认删除？',
                                        showCancelButton: true,
                                        onConfirm: () => {
                                            return new Promise(r => {
                                                del({ ids: [service?.id] }, { message: true }).then(() => {
                                                    r(true)
                                                    Toast.success('删除成功')
                                                    refresh()
                                                })
                                            })
                                        }
                                    })
                                }}
                            >删除</Button>
                        </> :
                        <Button size="small" type="primary" onClick={(e) => {
                            e.stopPropagation()
                            Dialog.show({
                                title: '二次确认',
                                message: '确定要变更工作状态至未发布？',
                                showCancelButton: true,
                                onConfirm: () => {
                                    return new Promise(r => {
                                        updateStatus({ id: service?.id }, { message: true }).then(() => {
                                            r(true)
                                            Toast.success('成功撤回')
                                            refresh()
                                        })
                                    })
                                }
                            })
                        }}>撤回</Button>
                }
            </div>
        </div>
    )
}

export default function Service() {
    const navigator = useNavigate()
    const [, setServiceInfo] = useRecoilState(serviceInfoState)
    const { loading: WorkInfoLoading, data: WorkList, refresh } = useRequest(useApi(getWorkInfo), {
        defaultParams: [{ page: 1, size: 10 }],
        // 默认应用只有一个服务
        onSuccess: (data) => {
            setServiceInfo(data?.workInfo?.length && data.workInfo[0] ||
                { id: "", name: "", status: NaN, year: NaN })
        }
    })
    return (
        <div className="flex flex-col mt-2">
            <div className="flex flex-col mx-4 justify-center">
                <div className="flex justify-between">
                    <span className="font-bold">全部</span>
                    <span className="text-lg" onClick={() => navigator('/app/create-service')}>+</span>
                </div>
                <Input className="bg-[#f5f5f7] mt-4 h-8 pl-2"
                    prefix={<Search color="#909398" />} placeholder="按展示名称搜索" />
            </div>
            <div className="bg-[#f5f5f7] mt-2 h-8 flex items-center pl-4 text-[#909398]">{`共${WorkList?.total || 0}条数据`}</div>
            <div className="bg-[#f5f5f7]">
                {
                    WorkInfoLoading ? <PageLoading /> :
                        (
                            !!WorkList?.total ?
                                WorkList.workInfo.map((work) =>
                                    <ServiceCard key={work.id} service={work} refresh={refresh} />) :
                                <Empty description={'暂无数据'} />
                        )
                }
            </div>
        </div>
    )
}