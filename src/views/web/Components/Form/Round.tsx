import { Form, Input, Button } from "antd";
import { DatePicker } from "antd";
import { RoundFormType, disabledDate, autoSetNextTaskStartTime, RangePickerValidator, convert_to_backend } from "@/utils/roundForm";
import { RangePickerProps } from "antd/es/date-picker";
import { useEffect } from "react";
import { useRequest } from "ahooks";
import { useApi } from "@/api/request";
import { addRound, updateRoundInfo } from "@/api/admin/round";

const { RangePicker } = DatePicker

interface RoundFormPropType {
    isEdit: boolean
    roundInfo: RoundFormType | undefined
    workId: string,
    RoundId: string,
    callback: () => void
}

export default function RoundForm(props: RoundFormPropType) {
    const { loading: AddLoading, runAsync: add } = useRequest(useApi(addRound), { manual: true })
    const { loading: UpdateLoading, runAsync: update } = useRequest(useApi(updateRoundInfo), { manual: true })
    const [form] = Form.useForm()
    useEffect(() => {
        if (props.isEdit) {
            form.setFieldsValue(props.roundInfo)
        } else {
            // 轮次名称有默认值...
        }
    }, [props.isEdit])
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
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }}>
            <Form.Item label="轮次名称" name={'name'}
                rules={[{ required: true, message: '请输入轮次名称' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item label="简历最大内存(MB)" name={'fileMaxSize'}
                rules={[{
                    required: true, message: '不符合规范（最大100MB）', type: 'number',
                    max: 100, transform(v) { return !!v && Number(v) }
                }]}
            >
                <Input />
            </Form.Item>
            <Form.Item label="学生选择意向导师起止时间" name={['duration', 0]}
                rules={[{ required: true, validator: (_, v) => RangePickerValidator(_, v) }]}
            >
                <RangePicker showTime format={'YYYY/MM/DD HH:mm'} />
            </Form.Item>
            <Form.Item label="教师审核第一志愿起止时间" name={['duration', 1]}
                rules={[{ required: true, validator: (_, v) => RangePickerValidator(_, v) }]}
            >
                <RangePicker showTime format={'YYYY/MM/DD HH:mm'}
                    disabledDate={disabledDate(task_0) as RangePickerProps['disabledDate']}
                />
            </Form.Item>
            <Form.Item label="教师审核第二志愿起止时间" name={['duration', 2]}
                rules={[{ required: true, validator: (_, v) => RangePickerValidator(_, v) }]}
            >
                <RangePicker showTime format={'YYYY/MM/DD HH:mm'} />
            </Form.Item>
            <Form.Item label="教师审核第三志愿起止时间" name={['duration', 3]}
                rules={[{ required: true, validator: (_, v) => RangePickerValidator(_, v) }]}
            >
                <RangePicker showTime format={'YYYY/MM/DD HH:mm'} />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 14, offset: 6 }}>
                <Button type="primary" onClick={() => {
                    form.validateFields().then((result: RoundFormType) => {
                        if (props.isEdit) {
                            update({ id: props.RoundId, ...convert_to_backend(result) }).then(() => {
                                props.callback()
                            })
                        } else {
                            add({ workId: props.workId, processList: [convert_to_backend(result)] }).then(() => {
                                props.callback()
                            })
                        }
                    })
                }}>{props.isEdit ? '确认修改' : '确认新建'}</Button>
            </Form.Item>
        </Form>
    )
}