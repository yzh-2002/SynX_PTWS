import { Picker, Input, Empty, Collapse, Flex, Pagination, Button, Tag, Toast } from "react-vant"
import { Search, Replay } from "@react-vant/icons"
import { useState, useCallback, ReactNode } from "react"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getMSInfo, exportMSInfo, exportTeachMSInfo } from "@/api/admin/ms"
import PageLoading from "@/views/App/PageLoading"
import { MS_STATUS, MS_STATUS_COLOR } from "@/constants/ms"
import { MSType } from "@/objects/ms"
import dayjs from "dayjs"

const TeachMSSearchFields = [
    { text: '导师姓名', value: 'teaName' },
    { text: '学生姓名', value: 'stuName' },
    { text: '申报轮次', value: 'twsRound' },
    { text: '导师团队', value: 'teamName' },
    { text: '匹配状态', value: 'status' },
]

function MSCollapseCard({ MSInfo }: { MSInfo: MSType }) {

    const Description = useCallback(({ label, value }: { label: string, value: string | number | ReactNode | undefined }) => {
        return (
            <div>
                <span className="text-[#909398] mr-2">{`${label}:`}</span>
                <span className=" text-black">{!!value && value != 0 ? value : '暂无信息'}</span>
            </div>
        )
    }, [])
    return (
        <Collapse>
            <Collapse.Item title={`${MSInfo?.stuName}申请${MSInfo?.teaName}`}>
                <Flex wrap="wrap">
                    <Flex.Item span={12}>
                        <Description label="学生姓名" value={MSInfo?.stuName} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="学生考号" value={MSInfo?.stuCode} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="导师姓名" value={MSInfo?.teaName} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="导师工号" value={MSInfo?.teaCode} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="导师职称" value={MSInfo?.jobTitle} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="导师团队" value={MSInfo?.teamName} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="申报轮次" value={MSInfo?.twsRound} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="申报志愿" value={MSInfo?.choiceRank} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="匹配状态" value={
                            <Tag color={MS_STATUS_COLOR[MSInfo?.status! + 1]}>{MS_STATUS[MSInfo?.status! + 1]}</Tag>
                        } />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="审核时间" value={dayjs(MSInfo?.createdTime).format('YYYY-MM-DD HH:mm')} />
                    </Flex.Item>
                </Flex>
            </Collapse.Item>
        </Collapse>
    )
}

export default function TeachMSInfo({ id }: { id: string }) {
    const [searchField, setSearchField] = useState('teaName')
    const [searchValue, setSearchValue] = useState('')
    const [page, setPage] = useState(1)

    const { loading: MSLoading, data: MSInfo, run: getMS } = useRequest(useApi(getMSInfo), {
        defaultParams: [{ workId: id, page, size: 5 }]
    })
    const { loading: ExportTeachLoading, runAsync: exportTeach } = useRequest(useApi(exportTeachMSInfo), { manual: true })
    const { loading: ExportMSLoading, runAsync: exportMS } = useRequest(useApi(exportMSInfo), { manual: true })
    return (
        <>
            <>
                <div className="flex items-center p-2 mt-2 bg-white">
                    <Picker popup={{ round: true }} columns={TeachMSSearchFields} value={searchField}
                        onConfirm={(v: string) => {
                            setSearchField(v)
                            setSearchValue('')
                        }}
                    >
                        {(val: string | string[], _, actions) => {
                            return <Input
                                className="h-8 bg-[#f5f5f7]" style={{ width: '240px' }}
                                placeholder="请选择搜索字段" onClick={() => actions.open()}
                                value={!!val ? TeachMSSearchFields.find(v => v.value === val)?.text : ''}
                            />
                        }}
                    </Picker>
                    <Input className="h-8 bg-[#f5f5f7] mr-2" style={{ marginLeft: '4px' }}
                        value={searchValue} onChange={(v) => { setSearchValue(v) }}
                    />
                    <Button size="mini" type="primary" icon={<Search />} round onClick={() => {
                        getMS({ workId: id, [searchField]: searchValue, page, size: 5 })
                    }} />
                    <Button size="mini" type="primary" icon={<Replay />} round onClick={() => {
                        setSearchField('')
                        setSearchValue('')
                        setPage(1)
                        getMS({ workId: id, page: 1, size: 5 })
                    }} />
                </div>
                <div className="flex p-2 items-center bg-white">
                    <Button type="primary" size="small" loading={ExportTeachLoading} onClick={() => {
                        exportTeach({ workId: id }, { message: true }).then(() => { Toast.success('导出导师信息成功') })
                    }}>导出导师信息</Button>
                    <Button type="primary" size="small" style={{ margin: "0 8px" }} loading={ExportMSLoading}
                        onClick={() => {
                            exportMS({ workId: id, [searchField]: searchValue, page, size: 5 }, { message: true }).then(() => {
                                Toast.success('导出匹配详情成功')
                            })
                        }}
                    >导出匹配详情</Button>
                </div>
            </>
            <div className="bg-[#f5f5f7] my-2 h-2 flex items-center pl-4 text-[#909398]">{`共${MSInfo?.total || 0}条数据`}</div>
            {
                MSLoading ? <PageLoading /> : (
                    !!MSInfo?.total ? (
                        MSInfo?.twsInfo?.map((ms) =>
                            <MSCollapseCard MSInfo={ms} />)
                    ) : <Empty description={'暂无数据'} />
                )
            }
            <Pagination totalItems={MSInfo?.total || 0} itemsPerPage={5} value={page} mode='simple'
                onChange={setPage}
            />
        </>
    )
}