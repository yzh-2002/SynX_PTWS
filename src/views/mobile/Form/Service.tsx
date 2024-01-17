import { FormInstance } from "react-vant";
import { useMemo, useEffect } from "react";
import { Button, Input, Form, Picker } from "react-vant";
import { useRequest } from "ahooks";
import { useApi } from "@/api/request";
import { createWork, getWorkInfo, updateWork } from "@/api/admin/service";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { serviceInfoState } from "@/store/service";
import PageLoading from "@/views/App/PageLoading";


function FormFooter(props: { form: FormInstance }) {
    const { loading: CreateWorkLoading, runAsync: create } = useRequest(useApi(createWork), { manual: true })
    const { loading: UpdateWorkLoading, runAsync: update } = useRequest(useApi(updateWork), { manual: true })
    const navigator = useNavigate()
    const params = new URLSearchParams(window.location.search)
    return (
        <div className="flex justify-end mr-2 mt-2">
            <Button size="small" style={{ marginRight: '8px' }} onClick={() => { navigator(-1) }}>取消</Button>
            <Button type="primary" size='small' loading={!!params.has('id') ? UpdateWorkLoading : CreateWorkLoading}
                onClick={() => {
                    props.form.validateFields().then(data => {
                        if (!!params.has('id')) {
                            update({ id: params.get('id'), ...data }, { message: true, success: '修改导师匹配服务成功' }).then(() => { navigator(-1) })
                        } else {
                            create({ ...data }, { message: true, success: '创建导师匹配服务成功' }).then(() => { navigator(-1) })
                        }
                    })
                }}
            >{!!params.has('id') ? '修改' : '创建'}</Button>
        </div>
    )
}

export default function Service() {
    const params = new URLSearchParams(window.location.search)
    const [serviceInfo, setServiceInfo] = useRecoilState(serviceInfoState)
    const { loading: workInfoLoading, run } = useRequest(useApi(getWorkInfo), {
        manual: true,
        // 默认应用只有一个服务
        onSuccess: (data) => {
            setServiceInfo(data?.workInfo?.length && data.workInfo[0] ||
                { id: "", name: "", status: NaN, year: NaN })
        }
    })
    useEffect(() => {
        !serviceInfo?.id && params.has('id') && run({ page: 1, size: 10 })
    }, [])
    const [form] = Form.useForm()
    useEffect(() => {
        !!serviceInfo?.id && params.has('id') && form.setFieldsValue(serviceInfo)
    }, [serviceInfo])
    const YearOptions = useMemo(() => {
        return Array.from({ length: 11 }, (_, index) => (new Date().getFullYear() - 5 + index).toString())
    }, [])

    return (
        <div className="flex flex-col">
            <span className="font-bold m-2">导师双选服务信息</span>
            {
                workInfoLoading ? <PageLoading /> :
                    <Form form={form} footer={<FormFooter form={form} />}>
                        <Form.Item name={'name'} label="双选业务名称" rules={[{ required: true, message: '请填写用户名' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="year"
                            label='双选业务年份'
                            rules={[{ required: true, message: '请选择年份' }]}
                            onClick={(_, action) => action?.current?.open()}
                        >
                            <Picker popup columns={YearOptions}>
                                {v => v || '请选择年份'}
                            </Picker>
                        </Form.Item>
                    </Form>
            }
        </div>
    )
}