import { useCallback, useState } from "react"
import { Picker, Input, Empty, Collapse, Flex, Pagination, Button, Dialog, Toast, Popup } from "react-vant"
import { Search, Replay } from "@react-vant/icons"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getTeacherList, delTeacher, addTeacherBatch } from "@/api/admin/teachInfo"
import PageLoading from "@/views/App/PageLoading"
import { TeacherReturnType } from "@/objects/teacher"
import { DOWNLOAD_TEACH_URL } from "@/constants/app"
import { useNavigate } from "react-router-dom"
import UploadCard from "../UploadCard"

const TeachSearchFields = [
    { text: '姓名', value: 'name' },
    { text: '工号', value: 'code' },
    { text: '手机号', value: 'phone' },
    { text: '实验室', value: 'teamName' },
    { text: '职称', value: 'jobTitle' },
]

interface TeachCollapsePropType {
    teach: TeacherReturnType,
    id: string //workId
    refresh: () => void
}

function TeachCollapseCard({ teach, id, refresh }: TeachCollapsePropType) {
    const navigator = useNavigate()
    const Description = useCallback(({ label, value }: { label: string, value: string | number | undefined }) => {
        return (
            <div>
                <span className="text-[#909398] mr-2">{`${label}:`}</span>
                <span className=" text-black">{!!value && value != 0 ? value : '暂无信息'}</span>
            </div>
        )
    }, [])
    const { runAsync: del } = useRequest(useApi(delTeacher), { manual: true })
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
                <div className="flex justify-end">
                    <Button type="primary" size="small" onClick={() => {
                        navigator(`/app/specify-stu?tid=${teach?.id}&wid=${id}`)
                    }}>指定学生</Button>
                    <Button type="primary" size="small" style={{ margin: '0 8px' }} onClick={() => {
                        navigator(`/app/create-teach?tid=${teach?.id}&wid=${id}`)
                    }}>修改</Button>
                    <Button type="danger" size="small" onClick={() => {
                        Dialog.show({
                            title: '二次确认',
                            message: '确认删除该导师？',
                            showCancelButton: true,
                            onConfirm: () => {
                                return new Promise(r => {
                                    del({ id, ids: [teach?.id] }, { message: true }).then(() => {
                                        r(true)
                                        Toast.success(`删除${teach?.name}教师成功`)
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

export default function TeachInfo({ id }: { id: string }) {
    const [searchField, setSearchField] = useState('name')
    const [searchValue, setSearchValue] = useState('')
    const [page, setPage] = useState(1)
    const navigator = useNavigate()
    const { loading: TeachListLoading, data: TeachList, run: getTeach, refresh } = useRequest(useApi(getTeacherList), {
        defaultParams: [{ id, page: 1, size: 5 }]
    })
    const [uploadVisible, setUploadVisible] = useState(false)
    const { loading: UploadLoading, runAsync: uploadTeaches } = useRequest(useApi(addTeacherBatch), { manual: true })

    return (
        <>
            <>
                <div className="flex items-center p-2 mt-2 bg-white">
                    <Picker popup={{ round: true }} columns={TeachSearchFields} value={searchField}
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
                                value={!!val ? TeachSearchFields.find(v => v.value === val)?.text : ''}
                            />
                        }}
                    </Picker>
                    <Input className="h-8 bg-[#f5f5f7] mr-2" style={{ marginLeft: '4px' }}
                        value={searchValue} onChange={(v) => { setSearchValue(v) }}
                    />
                    <Button size="mini" type="primary" icon={<Search />} round onClick={() => {
                        getTeach({ id, [searchField]: searchValue, page: 1, size: 5 })
                    }} />
                    <Button size="mini" type="primary" icon={<Replay />} round onClick={() => {
                        setSearchField('')
                        setSearchValue('')
                        getTeach({ id, page: 1, size: 5 })
                    }} />
                </div>
                <div className="flex p-2 items-center bg-white">
                    <Button type="primary" size="small" onClick={() => {
                        navigator(`/app/create-teach?wid=${id}`)
                    }}>增加导师</Button>
                    <Button type="primary" size="small" style={{ margin: "0 8px" }}
                        onClick={() => { setUploadVisible(true) }}
                    >批量导入</Button>
                    <a href={DOWNLOAD_TEACH_URL} download={'批量导入教师模板'}>下载批量导入导师模板</a>
                </div>
            </>
            <div className="bg-[#f5f5f7] my-2 h-2 flex items-center pl-4 text-[#909398]">{`共${TeachList?.total || 0}条数据`}</div>
            {
                TeachListLoading ? <PageLoading /> : (
                    !!TeachList?.total ? (
                        TeachList?.userInfo?.map((teach) =>
                            <TeachCollapseCard key={teach?.id} teach={teach} id={id} refresh={refresh} />)
                    ) : <Empty description={'暂无数据'} />
                )
            }
            <Pagination totalItems={TeachList?.total || 0} itemsPerPage={5} value={page} mode='simple'
                onChange={(page) => {
                    setPage(page)
                    getTeach({ id, page, size: 5 })
                }}
            />
            <Popup visible={uploadVisible} title={'批量导入'} round
                onClose={() => setUploadVisible(false)}
            >
                <UploadCard loading={UploadLoading} upload={(f) => {
                    uploadTeaches({ id, file: f }, { message: true }).then(() => {
                        Toast.success('批量导入成功')
                        setUploadVisible(false)
                        refresh()
                    })
                }} />
            </Popup>
        </>
    )
}