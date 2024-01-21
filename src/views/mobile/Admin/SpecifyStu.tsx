import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Picker, Input, Button, Pagination, Empty, Collapse, Flex, Dialog, Toast } from "react-vant"
import { Search, Replay } from "@react-vant/icons"
import PageLoading from "@/views/App/PageLoading"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { specifyStu, getNotSelectStuList } from "@/api/admin/teachInfo"
import { StudentReturnType } from "@/objects/student"

// TODO:三参数后端尚未设置
const SearchFields = [
    { text: '考生姓名', value: 'name' },
    { text: '考生考号', value: 'code' },
    { text: '电话号码', value: 'phone' },
]

function StuCollapseCard({ stu }: { stu: StudentReturnType }) {
    const { runAsync: Specify } = useRequest(useApi(specifyStu), { manual: true })
    const navigator = useNavigate()
    const params = new URLSearchParams(window.location.search)
    const Description = useCallback(({ label, value }: { label: string, value: string | number | undefined }) => {
        return (
            <div>
                <span className="text-[#909398] mr-2">{`${label}:`}</span>
                <span className=" text-black">{!!value && value != 0 ? value : '暂无信息'}</span>
            </div>
        )
    }, [])
    return (
        <Collapse>
            <Collapse.Item title={stu?.name}>
                <Flex wrap="wrap">
                    <Flex.Item span={12}>
                        <Description label="姓名" value={stu?.name} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="考号" value={stu?.code} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="手机号" value={stu?.account} />
                    </Flex.Item>
                </Flex>
                <div className="flex justify-end">
                    <Button type="primary" size="small" onClick={() => {
                        Dialog.show({
                            title: "二次确认",
                            message: `确定要指定${stu?.name}？一旦选择，将无法撤销，请确定选择！`,
                            showCancelButton: true,
                            onConfirm: () => {
                                return new Promise(r => {
                                    Specify({ workId: params.get('wid')!, teaId: params.get('tid')!, stuId: stu?.id }, { message: true }).then(() => {
                                        r(true)
                                        Toast.success('')
                                        navigator(-1)
                                    })
                                })
                            }
                        })
                    }}>选择</Button>
                </div>
            </Collapse.Item>
        </Collapse>
    )
}

export default function SpecifyStu() {
    const [searchField, setSearchField] = useState('name')
    const [searchValue, setSearchValue] = useState('')
    const [page, setPage] = useState(1)
    const params = new URLSearchParams(window.location.search)

    const { loading: NotSelectedLoading, data: NotSelectedStu, run: getNoSelected } = useRequest(useApi(getNotSelectStuList), {
        defaultParams: [{ workId: params.get('wid')!, page: 1, size: 5 }]
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
                    getNoSelected({ workId: params.get('wid')!, [searchField]: searchValue, page: 1, size: 5 })
                }} />
                <Button size="mini" type="primary" icon={<Replay />} round onClick={() => {
                    setSearchField('')
                    setSearchValue('')
                    getNoSelected({ workId: params.get('wid')!, page: 1, size: 5 })
                }} />
            </div>
            <div className="bg-[#f5f5f7] my-2 h-8 flex items-center pl-4 text-[#909398]">{`共${NotSelectedStu?.total || 0}条数据`}</div>
            {
                NotSelectedLoading ? <PageLoading /> : (
                    !!NotSelectedStu?.total ? (
                        NotSelectedStu?.users?.map((stu) =>
                            <StuCollapseCard stu={stu} />)
                    ) : <Empty description={'暂无数据'} />
                )
            }
            <Pagination totalItems={NotSelectedStu?.total || 0} itemsPerPage={5} value={page} mode='simple'
                onChange={(page) => {
                    setPage(page)
                    getNoSelected({ workId: params.get('wid')!, page, size: 5 })
                }}
            />
        </>
    )
}