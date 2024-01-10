import { ServiceReturnType } from "@/objects/service"
import { Form, Input, DatePicker, Button } from "antd"
import dayjs from "dayjs"
import { useEffect } from "react"
import { updateWork, createWork } from "@/api/admin/service"
import { useApi } from "@/api/request"
import { useRequest } from "ahooks"

interface ServiceFormPropType {
    service: ServiceReturnType | undefined
    isEdit: boolean
    closeModal: () => void
    refresh: () => void
}

export default function ServiceForm(props: ServiceFormPropType) {
    const { loading: updateLoading, runAsync: update } = useRequest(useApi(updateWork), { manual: true })
    const { loading: createLoading, runAsync: create } = useRequest(useApi(createWork), { manual: true })

    const [form] = Form.useForm()
    useEffect(() => {
        if (props.isEdit) {
            form.setFieldsValue({
                ...props.service,
                year: dayjs(props.service?.year?.toString(), "YYYY")
            })
        } else {
            // 创建服务时有默认填充信息
            form.setFieldsValue({
                name: `${dayjs().year()}年导师匹配服务`,
                year: dayjs()
            })
        }
    }, [props.isEdit])
    return (
        <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
            <Form.Item label='双选业务名称' name={'name'} rules={[{ required: true, message: '请输入工作名称' }]}>
                <Input></Input>
            </Form.Item>
            <Form.Item label="双选业务年份" name={'year'} rules={[{ required: true, message: '请输入工作年份' }]}>
                <DatePicker picker="year" format={"YYYY"} disabledDate={(current) => current.isBefore(dayjs(), 'year')} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                <Button
                    type="primary"
                    loading={props.isEdit ? updateLoading : createLoading}
                    onClick={() => {
                        form.validateFields().then((result) => {
                            if (props.isEdit) {
                                // 修改导师匹配服务信息
                                update({ id: props.service?.id!, ...result, year: result.year.year() }, {
                                    message: true,
                                    success: '修改导师匹配服务成功'
                                }).then(() => {
                                    props.closeModal()
                                    props.refresh()
                                })
                            } else {
                                // 新建导师匹配服务信息
                                create({ ...result, year: result.year.year() }, {
                                    message: true,
                                    success: '新建导师匹配服务成功'
                                }).then(() => {
                                    props.closeModal()
                                    props.refresh()
                                })
                            }
                        })
                    }}
                >{props.isEdit ? '确认修改' : '确认新建'}</Button>
            </Form.Item>
        </Form>
    )
}