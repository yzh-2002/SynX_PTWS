import { FormInstance } from "react-vant";
import { useMemo } from "react";
import { Button, Input, Form, Picker } from "react-vant";

function FormFooter(props: { form: FormInstance }) {
    return (
        <div className="flex justify-end mr-2 mt-2">
            <Button>取消</Button>
            <Button type="primary"
                onClick={() => {
                    props.form.validateFields().then(data => {
                        console.log(data)
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
            <span>导师双选服务信息</span>
            {/* FIXME:form 类型问题 */}
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