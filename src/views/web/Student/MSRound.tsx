import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getRoundList } from "@/api/admin/round"
import PageLoading from "@/views/App/PageLoading"
import { Empty } from "antd"

export default function MSRound() {
    // TODO:应从接口获取最新workid，接口还未开发，此处先写死
    const workId = '116768022462585'
    const { loading: RoundListLoading, data: RoundList, refresh } = useRequest(useApi(getRoundList), {
        defaultParams: [{ workId: workId }]
    })
    return (
        RoundListLoading ? <PageLoading /> :
            !RoundList?.length ? <Empty description={'导师匹配服务尚未发布，具体时间请咨询学院研究生科！'} />
                :
                <></>
    )
}