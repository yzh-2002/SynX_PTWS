import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getStuTaskInfo, uploadCV } from "@/api/student/task"
import { Button, Tabs, Tag, Popup, Toast } from "react-vant"
import { useMemo, useState } from "react"
import { NewspaperO } from "@react-vant/icons"
import PageLoading from "@/views/App/PageLoading"
import { StuTaskReturnType } from "@/objects/task"
import UploadCard from "../UploadCard"
import ChooseTeach from "./ChooseTeach"

function UploadCVCard({ task, refresh }: { task: StuTaskReturnType, refresh: () => void }) {
    const duration = JSON.parse(task?.processInfo?.duration || "")
    const [uploadVisible, setUploadVisible] = useState(false)
    const { loading: UploadLoading, runAsync: upload } = useRequest(useApi(uploadCV), { manual: true })
    return (
        <div className="flex flex-col bg-white mt-2 p-2">
            <div className="flex items-center">
                <div className="w-full flex justify-between">
                    <div className="flex items-center">
                        <span className="font-bold mr-2">上传简历</span>
                        {
                            !!task?.fileUrl ? (
                                <div className="flex items-center">
                                    <Tag color='#108ee9'>已上传</Tag>
                                    <a href={task?.fileUrl} target="_blank" className="flex items-center ml-2">
                                        <NewspaperO />
                                        <span>点我预览</span>
                                    </a>
                                </div>
                            ) : <Tag color='#f50'>未上传</Tag>
                        }
                    </div>
                    <Button type="primary" size="small" disabled={!!task?.status}
                        onClick={() => setUploadVisible(true)}
                    >上传简历</Button>
                </div>
            </div>
            <span className="mt-2 text-xs">{`起止日期：${duration?.start_1}--${duration?.end_1}`}</span>
            <Popup visible={uploadVisible} title={
                <div className="flex items-center">
                    <span>上传简历</span>
                    <span className=" font-normal text-xs">
                        {`(简历文件只限于PDF文件，最大尺寸不超过${task?.processInfo?.fileMaxSize! / 1024 / 1024}MB!)`}
                    </span>
                </div>
            } round
                onClose={() => setUploadVisible(false)}
            >
                <UploadCard loading={UploadLoading} upload={(f) => {
                    upload({ id: task?.processInfo?.id, file: f }, { message: true }).then(() => {
                        Toast.success('批量导入成功')
                        setUploadVisible(false)
                        refresh()
                    })
                }} />
            </Popup>
        </div>
    )
}


export default function RoundDetail() {
    const params = new URLSearchParams(window.location.search)
    const { loading: TaskLoading, data: taskInfo, refresh } = useRequest(useApi(getStuTaskInfo), {
        defaultParams: [{ id: params?.get('rid') || '', page: 1, size: 5 }]
    })

    const TabContents = useMemo(() => {
        return [
            {
                key: 'upload-cv', title: '上传简历', children: (
                    TaskLoading ? <PageLoading /> : <UploadCVCard task={taskInfo!} refresh={refresh} />
                )
            },
            {
                key: 'choose-teach', title: '申请导师', children: (
                    TaskLoading ? <PageLoading /> : <ChooseTeach task={taskInfo!} refresh={refresh} />
                )
            }
        ]
    }, [TaskLoading, taskInfo])

    return (
        <div className="bg-[#f5f5f7] flex flex-col">
            <span className="font-bold text-lg p-2 mb-2 bg-white">{
                decodeURIComponent(params.get('rname') || '')
            }</span>
            <Tabs className="mb-2">
                {TabContents.map(item => (
                    <Tabs.TabPane key={item?.key} title={item?.title}>{item?.children}</Tabs.TabPane>
                ))}
            </Tabs>
        </div>
    )
}