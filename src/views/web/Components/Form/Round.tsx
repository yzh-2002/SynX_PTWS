import { Form, Input, FormInstance, Button } from "antd";
import { DatePicker } from "antd";

import { convert_to_backend, disabledDate, autoSetNextTaskStartTime, RangePickerValidator } from "@/utils/roundForm";
import { RangePickerProps } from "antd/es/date-picker";
import { useEffect } from "react";

const { RangePicker } = DatePicker

// interface RoundPropType {
//     form: FormInstance
// }

export default function Round() {
    // form应该由上层组件传
    const [form] = Form.useForm()
    // 监听四个任务的时间
    const task_0 = Form.useWatch(['duration', 0], form)
    useEffect(() => {
        autoSetNextTaskStartTime(task_0, form, 1)
    }, [task_0])

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
            <Form.Item label="教师审核第一志愿起止时间" name={['duration', 1]}>
                <RangePicker showTime format={'YYYY/MM/DD HH:mm'}
                    disabledDate={disabledDate(task_0) as RangePickerProps['disabledDate']}
                />
            </Form.Item>
            <Form.Item label="教师审核第二志愿起止时间" name={['duration', 2]}>
                <RangePicker showTime format={'YYYY/MM/DD HH:mm'} />
            </Form.Item>
            <Form.Item label="教师审核第三志愿起止时间" name={['duration', 3]}>
                <RangePicker showTime format={'YYYY/MM/DD HH:mm'} />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 14, offset: 6 }}>
                <Button type="primary" onClick={() => {
                    form.validateFields().then((result) => {
                        console.log(result)
                    })
                }}>确认新建</Button>
            </Form.Item>
        </Form>
    )
}