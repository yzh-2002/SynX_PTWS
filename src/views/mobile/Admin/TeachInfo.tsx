import { useCallback, useEffect, useState } from "react"
import { Picker, Input, Empty, Collapse, Flex, Pagination } from "react-vant"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getTeacherList } from "@/api/admin/teacher"
import PageLoading from "@/views/App/PageLoading"
import { TeacherReturnType } from "@/objects/teacher"

const TeachSearchFields = [
    { text: '姓名', value: 'name' },
    { text: '工号', value: 'code' },
    { text: '手机号', value: 'phone' },
    { text: '实验室', value: 'teamName' },
    { text: '职称', value: 'jobTitle' },
]

function TeachCollapseCard({ teach }: { teach: TeacherReturnType }) {
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
            <Collapse.Item title={teach?.name}>
                <Flex wrap="wrap">
                    <Flex.Item span={12}>
                        <Description label="姓名" value={teach?.name} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="工号" value={teach?.code} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="团队" value={teach?.teamName} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="职称" value={teach?.jobTitle} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="研究方向" value={teach?.keywords} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="邮箱" value={teach?.mail} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="手机号" value={teach?.account} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="全部名额" value={teach?.allQuotas} />
                    </Flex.Item>
                    <Flex.Item span={12}>
                        <Description label="剩余名额" value={teach?.oddQuotas} />
                    </Flex.Item>
                </Flex>
            </Collapse.Item>
        </Collapse>
    )
}

export default function TeachInfo({ id }: { id: string }) {
    const [searchField, setSearchField] = useState('name')
    const [searchValue, setSearchValue] = useState('')
    const [page, setPage] = useState(1)
    // TODO:获取教师目前未分页
    const { loading: TeachListLoading, data: TeachList, run: getTeach } = useRequest(useApi(getTeacherList), {
        manual: true, debounceWait: 300
    })
    useEffect(() => { getTeach({ id, [searchField]: searchValue }) }, [searchField, searchValue])
    return (
        <>
            <div className="flex p-2 mt-2 bg-white">
                <Picker popup={{ round: true }} columns={TeachSearchFields} value={searchField}
                    onConfirm={(v: string) => {
                        setSearchField(v)
                        setSearchValue('')
                    }}
                >
                    {(val: string | string[], _, actions) => {
                        return <Input
                            className="h-8 bg-[#f5f5f7]" style={{ width: '160px' }}
                            placeholder="  请选择搜索字段" onClick={() => actions.open()}
                            value={!!val ? TeachSearchFields.find(v => v.value === val)?.text : ''}
                        />
                    }}
                </Picker>
                <Input className="h-8 bg-[#f5f5f7]" style={{ marginLeft: '4px' }}
                    value={searchValue} onChange={(v) => { setSearchValue(v) }}
                />
            </div>
            <div className="bg-[#f5f5f7] my-2 h-2 flex items-center pl-4 text-[#909398]">{`共${TeachList?.total || 0}条数据`}</div>
            {
                TeachListLoading ? <PageLoading /> : (
                    !!TeachList?.total ? (
                        TeachList?.userInfo?.map((teach) => <TeachCollapseCard key={teach?.id} teach={teach} />)
                    ) : <Empty description={'暂无数据'} />
                )
            }
            <Pagination totalItems={TeachList?.total || 0} itemsPerPage={5} value={page} mode='simple'
                onChange={setPage}
            />
        </>
    )
}