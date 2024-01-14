import { Button, Empty, Input, Tag } from "react-vant";
import { Search } from "@react-vant/icons"
import { useNavigate } from "react-router-dom";
import { ServiceReturnType } from "@/objects/service";
import { useRequest } from "ahooks";
import { useApi } from "@/api/request";
import { getWorkInfo } from "@/api/admin/service";
import PageLoading from "@/views/App/PageLoading";
import { ServiceStatus, ServiceStatusColor } from "@/constants/service";

function ServiceCard({ service }: { service: ServiceReturnType }) {
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
                            }}>发布</Button>
                            <Button size="small" type="primary" style={{ marginRight: '4px' }} onClick={(e) => {
                                e.stopPropagation()
                                navigator(`/app/create-service?id=${service.id}`)
                            }}>编辑</Button>
                            <Button size="small" type="danger">撤回</Button>
                        </> :
                        <Button size="small" type="primary" >撤回</Button>
                }
            </div>
        </div>
    )
}

export default function Service() {
    const navigator = useNavigate()
    const { loading: WorkInfoLoading, data: WorkList, refresh } = useRequest(useApi(getWorkInfo), {
        defaultParams: [{ page: 1, size: 10 }],
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
                                WorkList.workInfo.map((work) => <ServiceCard key={work.id} service={work} />) :
                                <Empty description={'暂无数据'} />
                        )
                }
            </div>
        </div>
    )
}