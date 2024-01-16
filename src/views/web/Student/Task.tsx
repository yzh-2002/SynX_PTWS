import CollapseCard, { CollapseCardPropType } from "../Components/CollapseCard"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getStuTaskInfo, uploadCV, applyTutor, submitTask } from "@/api/student/task"
import { useMemo, useState } from "react"
import PageLoading from "@/views/App/PageLoading"
import { Button, Modal, Tag, Tooltip, Popconfirm, App } from "antd"
import UploadCard from "../Components/UploadCard"
import { FilePdfOutlined } from "@ant-design/icons"
import { ChooseTeachContent } from "./TaskContent"
import { SelectedTutorType } from "@/objects/task"

export default function TaskDetail() {
    const params = new URLSearchParams(window.location.search)
    const { loading: TaskLoading, data: taskInfo, refresh } = useRequest(useApi(getStuTaskInfo), {
        defaultParams: [{ id: params?.get('pid') || '', page: 1, size: 5 }]
    })
    const { loading: UploadLoading, runAsync: upload } = useRequest(useApi(uploadCV), { manual: true })
    const { loading: ApplyLoading, runAsync: apply } = useRequest(useApi(applyTutor), { manual: true })
    const { loading: SubmitLoading, runAsync: submit } = useRequest(useApi(submitTask), { manual: true })

    const [uploadModalOpen, setUploadModalOpen] = useState(false)
    // 当前学生选择的志愿老师，注意其在数组中的顺序即为志愿顺序
    const [tutorList, setTutorList] = useState<SelectedTutorType[]>([])

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
                    <Button type="primary" disabled={!!taskInfo?.status}
                        onClick={() => { setUploadModalOpen(true) }}
                    >上传简历</Button>
                )
            }
        }
    }, [taskInfo?.fileUrl, taskInfo?.processInfo?.duration, taskInfo?.status])
    const ChooseTeachConfig = useMemo<CollapseCardPropType>(() => {
        const duration = !!taskInfo?.processInfo?.duration ?
            JSON.parse(taskInfo?.processInfo?.duration) : null
        return {
            content: {
                label: '申请导师',
                key: 'choose-teach',
                children: <ChooseTeachContent
                    id={taskInfo?.processInfo?.id!}
                    selectedTutorList={taskInfo?.currentSelectedTutor!}
                    taskStatus={taskInfo?.status!}
                    tutorList={tutorList}
                    setTutorList={setTutorList}
                />
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
    }, [taskInfo?.processInfo?.id, taskInfo?.processInfo?.duration,
    taskInfo?.currentSelectedTutor, taskInfo?.status, tutorList])
    return (
        TaskLoading ? <PageLoading /> :
            <>
                <CollapseCard {...UploadCVConfig} />
                <CollapseCard {...ChooseTeachConfig} />
                <div className="flex justify-center mt-2">
                    <Tooltip title={'将导师志愿选择保存至云端，等待提交确认'}>
                        <Button type="primary" style={{ width: '120px' }}
                            disabled={!!taskInfo?.status || !tutorList?.length}
                            loading={ApplyLoading}
                            onClick={() => {
                                apply({
                                    id: taskInfo?.processInfo?.id!,
                                    tutorId1: tutorList[0]?.id,
                                    tutorId2: tutorList[1]?.id,
                                    tutorId3: tutorList[2]?.id
                                }, { message: true, success: '保存导师意向成功' }).then(() => { refresh() })
                            }}
                        >保存导师意向</Button>
                    </Tooltip>
                    <Popconfirm title={'确认提交任务？一旦提交，将无法修改申请信息，请确定提交！'}
                        okText={'确定'} cancelText={'取消'}
                        onConfirm={() => {
                            submit({ id: taskInfo?.processInfo?.id! },
                                { message: true, success: '提交任务成功' }).then(() => { refresh() })
                        }}
                    >
                        <Button type="primary" className="ml-2" style={{ width: '120px' }}
                            loading={SubmitLoading}
                            disabled={!!taskInfo?.status}
                        >提交申请</Button>
                    </Popconfirm>
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