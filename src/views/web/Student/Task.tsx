import CollapseCard, { CollapseCardPropType } from "../Components/CollapseCard"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getStuTaskInfo, uploadCV } from "@/api/student/task"
import { useMemo, useState } from "react"
import PageLoading from "@/views/App/PageLoading"
import { Button, Modal, Tag } from "antd"
import UploadCard from "../Components/UploadCard"
import { FilePdfOutlined } from "@ant-design/icons"


export default function TaskDetail() {
    const params = new URLSearchParams(window.location.search)
    const { loading: TaskLoading, data: taskInfo, refresh } = useRequest(useApi(getStuTaskInfo), {
        defaultParams: [{ id: params?.get('pid') || '', page: 1, size: 10 }]
    })
    const { loading: UploadLoading, runAsync: upload } = useRequest(useApi(uploadCV), { manual: true })
    const [uploadModalOpen, setUploadModalOpen] = useState(false)

    const UploadCVConfig = useMemo<CollapseCardPropType>(() => {
        const duration = !!taskInfo?.processInfo?.duration ?
            JSON.parse(taskInfo?.processInfo?.duration) : null
        return {
            content: {
                label: '上传简历',
                showArrow: false,
            },
            collapsible: "disabled",
            header: {
                title: '上传简历',
                tag: !!taskInfo?.fileUrl ? (
                    <>
                        <Tag color='#108ee9'>已上传</Tag>
                        <a href={taskInfo?.fileUrl} target="_blank">
                            <FilePdfOutlined />
                            <span>点我预览</span>
                        </a>
                    </>
                ) : <Tag color='#f50'>未上传</Tag>,
                appendix: `起止日期：${duration?.start_1}--${duration?.end_1}`,
                action: (
                    <Button type="primary" onClick={() => { setUploadModalOpen(true) }}>上传简历</Button>
                )
            }
        }
    }, [taskInfo?.fileUrl, taskInfo?.processInfo?.duration])
    const ChooseTeachConfig = useMemo<CollapseCardPropType>(() => {
        const duration = !!taskInfo?.processInfo?.duration ?
            JSON.parse(taskInfo?.processInfo?.duration) : null
        return {
            content: {
                label: '申请导师',
                key: 'choose-teach',
                children: <></>
            },
            header: {
                title: '申请导师',
                appendix: (
                    <>
                        <div>请考生填报3名志愿导师，并根据一志愿、二志愿、三志愿进行排序（排序显示在页面下部）。</div>
                        <div>本轮填报时间：{`${duration?.start_1}--${duration?.end_1}`}</div>
                        <div>点击“保存导师志愿”，将导师志愿信息暂存云端，提交申请前需要先保存导师志愿信息，提交申请后不允许再修改简历PDF和导师志愿信息。</div>
                        <div>填报结束后，请务必点击"提交申请"。</div>
                    </>
                )
            }
        }
    }, [taskInfo?.processInfo?.duration])
    return (
        TaskLoading ? <PageLoading /> :
            <>
                <CollapseCard {...UploadCVConfig} />
                <CollapseCard {...ChooseTeachConfig} />
                <div className="flex justify-center mt-2">
                    <Button type="primary" style={{ width: '120px' }}>保存导师意向</Button>
                    <Button type="primary" className="ml-2" style={{ width: '120px' }}>提交申请</Button>
                </div>
                <Modal title={
                    <div className="flex items-center">
                        <span>上传简历</span>
                        <span className=" font-normal text-xs">
                            {`(简历文件只限于PDF文件，最大尺寸不超过${taskInfo?.processInfo?.fileMaxSize! / 1024 / 1024}MB!)`}
                        </span>
                    </div>}
                    open={uploadModalOpen} footer={null}
                    onCancel={() => setUploadModalOpen(false)}
                >
                    <UploadCard loading={UploadLoading} upload={(f) => {
                        upload({ id: taskInfo?.processInfo?.id!, file: f }, { message: true, success: '上传简历成功' }).then(() => {
                            setUploadModalOpen(false)
                            refresh()
                        })
                    }} />
                </Modal>
            </>
    )
}