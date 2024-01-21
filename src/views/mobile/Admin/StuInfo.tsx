import { useCallback, useState } from "react"
import { Picker, Input, Empty, Collapse, Flex, Pagination, Button, Dialog, Toast, Popup } from "react-vant"
import { Search, Replay } from "@react-vant/icons"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import PageLoading from "@/views/App/PageLoading"
import { DOWNLOAD_STU_URL } from "@/constants/app"
import { useNavigate } from "react-router-dom"
import UploadCard from "../UploadCard"
import { getStuList, addStuBatch, delStu } from "@/api/admin/stuInfo"
import { StudentReturnType } from "@/objects/student"

const StuSearchFields = [
    { text: '姓名', value: 'name' },
    { text: '考号', value: 'code' },
    { text: '手机号', value: 'phone' },
]

interface StuCollapsePropType {
    stu: StudentReturnType
    id: string //workId
    refresh: () => void
}

function StuCollapseCard({ stu, id, refresh }: StuCollapsePropType) {
    const navigator = useNavigate()
    const Description = useCallback(({ label, value }: { label: string, value: string | number | undefined }) => {
        return (
            <div>
                <span className="text-[#909398] mr-2">{`${label}:`}</span>
                <span className=" text-black">{!!value && value != 0 ? value : '暂无信息'}</span>
            </div>
        )
    }, [])
    const { runAsync: del } = useRequest(useApi(delStu), { manual: true })
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
                    <Button type="primary" size="small" style={{ margin: '0 8px' }} onClick={() => {
                        navigator(`/app/create-stu?sid=${stu?.id}&wid=${id}`)
                    }}>修改</Button>
                    <Button type="danger" size="small" onClick={() => {
                        Dialog.show({
                            title: '二次确认',
                            message: '确认删除该学生？',
                            showCancelButton: true,
                            onConfirm: () => {
                                return new Promise(r => {
                                    del({ id, ids: [stu?.id], force: 0 }, { message: true }).then(() => {
                                        r(true)
                                        Toast.success(`删除${stu?.name}学生成功`)
                                        refresh()
                                    })
                                })
                            }
                        })
                    }}>删除</Button>
                </div>
            </Collapse.Item>
        </Collapse>
    )
}

export default function StuInfo({ id }: { id: string }) {
    const [searchField, setSearchField] = useState('name')
    const [searchValue, setSearchValue] = useState('')
    const [page, setPage] = useState(1)
    const navigator = useNavigate()
    const { loading: StuListLoading, data: StuList, run: getStu, refresh } = useRequest(useApi(getStuList), {
        defaultParams: [{ id, page, size: 5 }] //每页固定5个
    })
    const [uploadVisible, setUploadVisible] = useState(false)
    const { loading: UploadLoading, runAsync: uploadStus } = useRequest(useApi(addStuBatch), { manual: true })
    return (
        <>
            <>
                <div className="flex items-center p-2 mt-2 bg-white">
                    <Picker popup={{ round: true }} columns={StuSearchFields} value={searchField}
                        onConfirm={(v: string) => {
                            setSearchField(v)
                            setSearchValue('')
                        }}
                    >
                        {(val: string | string[], _, actions) => {
                            return <Input
                                className="h-8 bg-[#f5f5f7]" style={{ width: '240px' }}
                                placeholder="请选择搜索字段" onClick={() => actions.open()}
                                prefix={!!val ? '搜索字段:' : ''}
                                value={!!val ? StuSearchFields.find(v => v.value === val)?.text : ''}
                            />
                        }}
                    </Picker>
                    <Input className="h-8 bg-[#f5f5f7] mr-2" style={{ marginLeft: '4px' }}
                        value={searchValue} onChange={(v) => { setSearchValue(v) }}
                    />
                    <Button size="mini" type="primary" icon={<Search />} round onClick={() => {
                        getStu({ id, [searchField]: searchValue, page, size: 5 })
                    }} />
                    <Button size="mini" type="primary" icon={<Replay />} round onClick={() => {
                        setSearchField('')
                        setSearchValue('')
                        setPage(1)
                        getStu({ id, page: 1, size: 5 })
                    }} />
                </div>
                <div className="flex p-2 items-center bg-white">
                    <Button type="primary" size="small" onClick={() => {
                        navigator(`/app/create-stu?wid=${id}`)
                    }}>增加学生</Button>
                    <Button type="primary" size="small" style={{ margin: "0 8px" }}
                        onClick={() => { setUploadVisible(true) }}
                    >批量导入</Button>
                    <a href={DOWNLOAD_STU_URL} download={'批量导入教师模板'}>下载批量导入学生模板</a>
                </div>
            </>
            <div className="bg-[#f5f5f7] my-2 h-2 flex items-center pl-4 text-[#909398]">{`共${StuList?.total || 0}条数据`}</div>
            {
                StuListLoading ? <PageLoading /> : (
                    !!StuList?.total ? (
                        StuList?.userInfo?.map((stu) =>
                            <StuCollapseCard key={stu?.id} stu={stu} id={id} refresh={refresh} />)
                    ) : <Empty description={'暂无数据'} />
                )
            }
            <Pagination totalItems={StuList?.total || 0} itemsPerPage={5} value={page} mode='simple'
                onChange={(page) => {
                    setPage(page)
                    getStu({ id, [searchField]: searchValue, page, size: 5 })
                }}
            />
            <Popup visible={uploadVisible} title={'批量导入'} round
                onClose={() => setUploadVisible(false)}
            >
                <UploadCard loading={UploadLoading} upload={(f) => {
                    uploadStus({ id, file: f }, { message: true }).then(() => {
                        Toast.success('批量导入成功')
                        setUploadVisible(false)
                        refresh()
                    })
                }} />
            </Popup>
        </>
    )
}