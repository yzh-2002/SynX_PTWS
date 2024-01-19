import { Picker, Input, Empty, Collapse, Flex, Pagination, Button, Tag } from "react-vant"
import { useState, useCallback, ReactNode } from "react"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { Search, Replay } from "@react-vant/icons"
import { getMSInfo } from "@/api/admin/ms"
import PageLoading from "@/views/App/PageLoading"
import { MSType } from "@/objects/ms"
import { MS_STATUS, MS_STATUS_COLOR } from "@/constants/ms"

const SearchFields = [
    { text: '学生考号', value: 'stuCode' },
    { text: '双选轮次', value: 'twsRound' },
    { text: '第几志愿', value: 'choiceRank' },
    { text: '双选状态', value: 'status' },
]

function StuMSCollapseCard({ stuMSInfo }: { stuMSInfo: MSType }) {

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
                        {/* TODO：缺少学生电话号码 */}
                        <Description label="电话号码" value={''} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="双选轮次" value={stuMSInfo?.twsRound} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="第几志愿" value={stuMSInfo?.choiceRank} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="匹配状态" value={
                            <Tag color={MS_STATUS_COLOR[stuMSInfo?.status! + 1]}>{MS_STATUS[stuMSInfo?.status! + 1]}</Tag>
                        } />
                    </Flex.Item>
                </Flex>
            </Collapse.Item>
        </Collapse>
    )
}

export default function RoundResult() {
    const [searchField, setSearchField] = useState('stuCode')
    const [searchValue, setSearchValue] = useState('')
    const [page, setPage] = useState(1)
    const params = new URLSearchParams(window.location.search)
    const { loading: MSInfoLoading, run: getMS, data: MSInfo } = useRequest(useApi(getMSInfo), {
        defaultParams: [{ page, size: 5, workId: params.get('wid')! }]
    })
    return (
        <>
            <div className="flex items-center p-2 mt-2 bg-white">
                <Picker popup={{ round: true }} columns={SearchFields} value={searchField}
                    onConfirm={(v: string) => {
                        setSearchField(v)
                        setSearchValue('')
                    }}
                >
                    {(val: string | string[], _, actions) => {
                        return <Input
                            className="h-8 bg-[#f5f5f7]" style={{ width: '240px' }}
                            placeholder="请选择搜索字段" onClick={() => actions.open()}
                            value={!!val ? SearchFields.find(v => v.value === val)?.text : ''}
                        />
                    }}
                </Picker>
                <Input className="h-8 bg-[#f5f5f7] mr-2" style={{ marginLeft: '4px' }}
                    value={searchValue} onChange={(v) => { setSearchValue(v) }}
                />
                <Button size="mini" type="primary" icon={<Search />} round onClick={() => {
                    getMS({ workId: params.get('wid')!, [searchField]: searchValue, page, size: 5 })
                }} />
                <Button size="mini" type="primary" icon={<Replay />} round onClick={() => {
                    setSearchField('')
                    setSearchValue('')
                    setPage(1)
                    getMS({ workId: params.get('wid')!, page, size: 5 })
                }} />
            </div>
            <div className="bg-[#f5f5f7] my-2 h-6 flex items-center pl-4 text-[#909398]">{`共${MSInfo?.twsInfo?.length || 0}条数据`}</div>
            {
                MSInfoLoading ? <PageLoading /> : (
                    !!MSInfo?.twsInfo?.length ? (
                        MSInfo?.twsInfo?.map((ms) =>
                            <StuMSCollapseCard stuMSInfo={ms} />)
                    ) : <Empty description={'暂无数据'} />
                )
            }
            <Pagination totalItems={MSInfo?.twsInfo?.length || 0} itemsPerPage={5} value={page} mode='simple'
                onChange={setPage}
            />
        </>
    )
}