import { Form, Input, Button, DatetimePicker, Toast } from "react-vant";
import { useEffect } from "react";
import { useRequest } from "ahooks";
import { useApi } from "@/api/request";
import { addRound, updateRoundInfo, getRoundList } from "@/api/admin/round";
import { useNavigate } from "react-router-dom";
import { PickerValidator, autoSetNextTaskStartTime, convert_to_backend, convert_to_form } from "@/utils/roundForm";
import dayjs from "dayjs";
import PageLoading from "@/views/App/PageLoading";

export default function RoundForm() {
    const { loading: RoundLoading, runAsync: getRound } = useRequest(useApi(getRoundList), { manual: true })
    const { loading: AddLoading, runAsync: add } = useRequest(useApi(addRound), { manual: true })
    const { loading: UpdateLoading, runAsync: update } = useRequest(useApi(updateRoundInfo), { manual: true })
    const [form] = Form.useForm()
    const navigator = useNavigate()
    const params = new URLSearchParams(window.location.search)
    useEffect(() => {
        !!params.has('rid') && getRound({ workId: params.get('wid')!, id: params.get('rid')! }).then((data) => {
            form.setFieldsValue(convert_to_form(data?.[0]))
        })
    }, [])
    // 监听四个任务的时间
    const task_0 = Form.useWatch(['duration', 0], form)
    const task_1 = Form.useWatch(['duration', 1], form)
    const task_2 = Form.useWatch(['duration', 2], form)
    useEffect(() => {
        autoSetNextTaskStartTime(task_0, form, 1)
    }, [task_0])
    useEffect(() => {
        autoSetNextTaskStartTime(task_1, form, 2)
    }, [task_1])
    useEffect(() => {
        autoSetNextTaskStartTime(task_2, form, 3)
    }, [task_2])

    return (
        RoundLoading ? <PageLoading /> :
            <Form form={form} layout="vertical">
                <Form.Item label="轮次名称" name={'name'}
                    rules={[{ required: true, message: '请输入轮次名称' }]}
                >
                    <Input placeholder="请输入轮次名称" />
                </Form.Item>
                <Form.Item label="简历最大内存(MB)" name={'fileMaxSize'}
                    rules={[{
                        required: true, message: '不符合规范（最大100MB）', type: 'number',
                        max: 100, transform(v) { return !!v && Number(v) }
                    }]}
                >
                    <Input placeholder="请输入简历最大内存" />
                </Form.Item>
                <Form.Item label={(<span>学生选择意向导师<span className="text-[#108ee9] font-bold">开始</span>时间</span>)} name={['duration', 0, 0]}
                    onClick={(_, action) => action?.current?.open()} rules={[{ required: true, message: '时间不能为空' }]}
                >
                    <DatetimePicker type="datetime" popup >
                        {(val: Date) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm") : '请选择学生选择意向导师开始时间')}
                    </DatetimePicker>
                </Form.Item>
                <Form.Item label={(<span>学生选择意向导师<span className="text-[#f50] font-bold">结束</span>时间</span>)} name={['duration', 0, 1]}
                    onClick={(_, action) => action?.current?.open()} rules={[{
                        required: true, validator: (_, v) => PickerValidator(_, v, form.getFieldValue(['duration', 0, 0]))
                    }]}
                >
                    <DatetimePicker type="datetime" popup >
                        {(val: Date) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm") : '请选择学生选择意向导师开始时间')}
                    </DatetimePicker>
                </Form.Item>
                <Form.Item label={(<span>教师审核第一志愿<span className="text-[#108ee9] font-bold">开始</span>时间</span>)} name={['duration', 1, 0]}
                    onClick={(_, action) => action?.current?.open()}
                >
                    <DatetimePicker type="datetime" popup >
                        {(val: Date) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm") : '请选择教师审核第一志愿开始时间')}
                    </DatetimePicker>
                </Form.Item>
                <Form.Item label={(<span>教师审核第一志愿<span className="text-[#f50] font-bold">结束</span>时间</span>)} name={['duration', 1, 1]}
                    onClick={(_, action) => action?.current?.open()}
                >
                    <DatetimePicker type="datetime" popup >
                        {(val: Date) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm") : '请选择教师审核第一志愿结束时间')}
                    </DatetimePicker>
                </Form.Item>
                <Form.Item label={(<span>教师审核第二志愿<span className="text-[#108ee9] font-bold">开始</span>时间</span>)} name={['duration', 2, 0]}
                    onClick={(_, action) => action?.current?.open()}
                >
                    <DatetimePicker type="datetime" popup >
                        {(val: Date) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm") : '请选择教师审核第二志愿开始时间')}
                    </DatetimePicker>
                </Form.Item>
                <Form.Item label={(<span>教师审核第二志愿<span className="text-[#f50] font-bold">结束</span>时间</span>)} name={['duration', 2, 1]}
                    onClick={(_, action) => action?.current?.open()}
                >
                    <DatetimePicker type="datetime" popup >
                        {(val: Date) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm") : '请选择教师审核第二志愿结束时间')}
                    </DatetimePicker>
                </Form.Item>
                <Form.Item label={(<span>教师审核第三志愿<span className="text-[#108ee9] font-bold">开始</span>时间</span>)} name={['duration', 3, 0]}
                    onClick={(_, action) => action?.current?.open()}
                >
                    <DatetimePicker type="datetime" popup >
                        {(val: Date) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm") : '请选择教师审核第三志愿开始时间')}
                    </DatetimePicker>
                </Form.Item>
                <Form.Item label={(<span>教师审核第三志愿<span className="text-[#f50] font-bold">结束</span>时间</span>)} name={['duration', 3, 1]}
                    onClick={(_, action) => action?.current?.open()}
                >
                    <DatetimePicker type="datetime" popup >
                        {(val: Date) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm") : '请选择教师审核第三志愿结束时间')}
                    </DatetimePicker>
                </Form.Item>
                <Form.Item>
                    <div className="w-full flex justify-end">
                        <Button style={{ marginRight: '8px' }} onClick={() => { navigator(-1) }}>取消</Button>
                        <Button type="primary"
                            loading={!!params.has('rid') ? UpdateLoading : AddLoading}
                            onClick={() => {
                                form.validateFields().then((result) => {
                                    if (!!params.has('rid')) {
                                        update({ id: params.get('rid')!, ...convert_to_backend(result) }, {
                                            message: true
                                        }).then(() => {
                                            Toast.success('修改轮次信息成功')
                                            navigator(-1)
                                        })
                                    } else {
                                        add({ workId: params.get('wid')!, processList: [convert_to_backend(result)] }, { message: true }).then(() => {
                                            Toast.success('创建轮次成功')
                                            navigator(-1)
                                        })
                                    }
                                })
                            }}>{!!params.has('rid') ? '修改' : '新建'}</Button>
                    </div>
                </Form.Item>
            </Form>
    )
}