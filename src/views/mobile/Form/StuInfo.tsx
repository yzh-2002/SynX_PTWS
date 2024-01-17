import { Form, Input, Button } from "react-vant"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { addStu, updateStu } from "@/api/admin/stuInfo"
import { useNavigate } from "react-router-dom"


export default function StuInfoForm() {
    const [form] = Form.useForm()
    const navigator = useNavigate()
    const params = new URLSearchParams(window.location.search)

    const { loading: AddLoading, runAsync: add } = useRequest(useApi(addStu), { manual: true })
    const { loading: UpdateLoading, runAsync: update } = useRequest(useApi(updateStu), { manual: true })
    return (
        <Form form={form}>
            <Form.Item label='学生姓名' name={'name'}
                rules={[{ required: true, message: '请输入学生姓名' }]}
            >
                <Input placeholder={'请输入学生姓名'} />
            </Form.Item>
            <Form.Item label='学生考号' name={'code'}
                rules={[{
                    required: true, message: '学生考号不符合要求', type: 'number',
                    transform: (v) => !!v && Number(v)
                }]}
            >
                <Input placeholder={'请输入学生考号'} />
            </Form.Item>
            <Form.Item label='手机号码' name={'account'}
                rules={[{
                    required: true, message: '手机号码格式不正确', pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                    transform: (v) => !!v && Number(v)
                }]}
            >
                <Input placeholder={'请输入手机号码'} />
            </Form.Item>
            <Form.Item>
                <div className="w-full flex justify-end">
                    <Button style={{ marginRight: '8px' }} onClick={() => { navigator(-1) }}>取消</Button>
                    <Button type="primary" loading={!!params.has('sid') ? UpdateLoading : AddLoading}
                        onClick={() => {
                            form.validateFields().then((result) => {
                                if (!!params.has('sid')) {
                                    // 修改时需要携带用户的id信息
                                    result['id'] = params.get('sid')
                                    update({ workId: params.get('wid'), ...result }, {
                                        message: true, success: '修改学生成功'
                                    }).then(() => {
                                        navigator(-1)
                                    })
                                } else {
                                    add({ id: params.get('wid')!, userlist: [result] }, {
                                        message: true, success: '添加学生成功'
                                    }).then(() => {
                                        navigator(-1)
                                    })
                                }
                            })

                        }}>{!!params.has('sid') ? '修改' : '新增'}</Button>
                </div>
            </Form.Item>
        </Form>
    )
}