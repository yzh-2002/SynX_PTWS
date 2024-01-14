import { FormInstance } from "react-vant";
import { useMemo } from "react";
import { Button, Input, Form, Picker } from "react-vant";
import { useRequest } from "ahooks";
import { useApi } from "@/api/request";
import { createWork } from "@/api/admin/service";
import { useNavigate } from "react-router-dom";

function FormFooter(props: { form: FormInstance }) {
    const { loading: CreateWorkLoading, runAsync: create } = useRequest(useApi(createWork), { manual: true })
    const navigator = useNavigate()
    return (
        <div className="flex justify-end mr-2 mt-2">
            {/*TODO:此处mr-2不生效 */}
            <Button size="small" className="mr-2" onClick={() => { navigator(-1) }}>取消</Button>
            <Button type="primary" size='small' loading={CreateWorkLoading}
                onClick={() => {
                    props.form.validateFields().then(data => {
                        create({ ...data }, { message: true, success: '创建导师匹配服务成功' }).then(() => { })
                    })
                }}
            >创建</Button>
        </div>
    )
}

export default function Service() {
    const [form] = Form.useForm()
    const YearOptions = useMemo(() => {
        return Array.from({ length: 11 }, (_, index) => (new Date().getFullYear() - 5 + index).toString())
    }, [])
    // const [year, setYear] = useState(new Date().getFullYear().toString())

    return (
        <div className="flex flex-col">
            <span className="font-bold m-2">导师双选服务信息</span>
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
        </div>
    )
}