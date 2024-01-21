import { Picker, Input, Empty, Collapse, Flex, Pagination, Button, Toast, Tag } from "react-vant"
import { useState, useCallback, ReactNode } from "react"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { Search, Replay } from "@react-vant/icons"
import { getStuMSInfo, exportStuMSInfo } from "@/api/admin/ms"
import PageLoading from "@/views/App/PageLoading"
import { StuMSType } from "@/objects/ms"
import { MS_STATUS, MS_STATUS_COLOR } from "@/constants/ms"

const StuMSSearchFields = [
    { text: '导师姓名', value: 'teaName' },
    { text: '学生姓名', value: 'stuName' },
    { text: '对应轮次', value: 'twsRound' },
    { text: '对应志愿', value: 'choiceRank' },
    { text: '匹配状态', value: 'status' },
]

function StuMSCollapseCard({ stuMSInfo }: { stuMSInfo: StuMSType }) {

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
            <Collapse.Item title={stuMSInfo?.stuName}>
                <Flex wrap="wrap">
                    <Flex.Item span={12}>
                        <Description label="学生姓名" value={stuMSInfo?.stuName} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="学生考号" value={stuMSInfo?.stuCode} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="电话号码" value={stuMSInfo?.stuPhone} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="匹配状态" value={
                            <Tag color={MS_STATUS_COLOR[stuMSInfo?.status! + 1]}>{MS_STATUS[stuMSInfo?.status! + 1]}</Tag>
                        } />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="对应轮次" value={stuMSInfo?.twsRound} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="对应志愿" value={stuMSInfo?.choiceRank} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="导师姓名" value={stuMSInfo?.teaName} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="导师工号" value={stuMSInfo?.teaCode} />
                    </Flex.Item>
                </Flex>
            </Collapse.Item>
        </Collapse>
    )
}


export default function StuMSInfo({ id }: { id: string }) {
    const [searchField, setSearchField] = useState('teaName')
    const [searchValue, setSearchValue] = useState('')
    const [page, setPage] = useState(1)

    const { loading: StuMSLoading, data: StuMSInfo, run: getStuMS } = useRequest(useApi(getStuMSInfo), {
        defaultParams: [{ workId: id, page: 1, size: 5 }]
    })
    const { loading: ExportStuLoading, runAsync: exportStu } = useRequest(useApi(exportStuMSInfo), { manual: true })
    return (
        <>
            <>
                <div className="flex items-center p-2 mt-2 bg-white">
                    <Picker popup={{ round: true }} columns={StuMSSearchFields} value={searchField}
                        onConfirm={(v: string) => {
                            setSearchField(v)
                            setSearchValue('')
                        }}
                    >
                        {(val: string | string[], _, actions) => {
                            return <Input
                                className="h-8 bg-[#f5f5f7]" style={{ width: '240px' }}
                                placeholder="请选择搜索字段" onClick={() => actions.open()}
                                value={!!val ? StuMSSearchFields.find(v => v.value === val)?.text : ''}
                            />
                        }}
                    </Picker>
                    <Input className="h-8 bg-[#f5f5f7] mr-2" style={{ marginLeft: '4px' }}
                        value={searchValue} onChange={(v) => { setSearchValue(v) }}
                    />
                    <Button size="mini" type="primary" icon={<Search />} round onClick={() => {
                        getStuMS({ workId: id, [searchField]: searchValue, page: 1, size: 5 })
                    }} />
                    <Button size="mini" type="primary" icon={<Replay />} round onClick={() => {
                        setSearchField('')
                        setSearchValue('')
                        setPage(1)
                        getStuMS({ workId: id, page: 1, size: 5 })
                    }} />
                </div>
                <div className="flex p-2 items-center bg-white">
                    <Button type="primary" size="small" loading={ExportStuLoading} onClick={() => {
                        exportStu({ workId: id, page, size: 5 }, { message: true }).then(() => { Toast.success('导出学生信息成功') })
                    }}>导出学生信息</Button>
                </div>
            </>
            <div className="bg-[#f5f5f7] my-2 h-2 flex items-center pl-4 text-[#909398]">{`共${StuMSInfo?.total || 0}条数据`}</div>
            {
                StuMSLoading ? <PageLoading /> : (
                    !!StuMSInfo?.total ? (
                        StuMSInfo?.userInfo?.map((ms) =>
                            <StuMSCollapseCard stuMSInfo={ms} />)
                    ) : <Empty description={'暂无数据'} />
                )
            }
            <Pagination totalItems={StuMSInfo?.total || 0} itemsPerPage={5} value={page} mode='simple'
                onChange={(page) => {
                    setPage(page)
                    getStuMS({ workId: id, page, size: 5 })
                }}
            />
        </>
    )
}