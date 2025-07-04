import { Form, Input, Button, Picker, Toast } from "react-vant"
import { jobTitleOption } from "@/views/web/Components/Form/TeachInfo"
import { useNavigate } from "react-router-dom"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { addTeacher, updateTeacher, getTeacherList } from "@/api/admin/teachInfo"
import { getWorkStatus } from "@/api/admin/service"
import { useEffect } from "react"
import PageLoading from "@/views/App/PageLoading"



export default function TeachInfoForm() {
    const params = new URLSearchParams(window.location.search)
    const navigator = useNavigate()
    const [form] = Form.useForm()

    const { loading: WorkStatusLoading, data: workStatus, run: getStatus } = useRequest(useApi(getWorkStatus), { manual: true })
    const { loading: GetLoading, runAsync: get } = useRequest(useApi(getTeacherList), { manual: true })
    const { loading: UpdateLoading, runAsync: update } = useRequest(useApi(updateTeacher), { manual: true })
    const { loading: AddLoading, runAsync: add } = useRequest(useApi(addTeacher), { manual: true })

    useEffect(() => {
        !!params.has('tid') && getStatus({ id: params.get('wid')! })
        !!params.has('tid') && get({ id: params.get('wid')!, teaId: params.get('tid')!, page: 1, size: 1 }).then((data) => {
            form.setFieldsValue(data?.userInfo?.[0])
        })
    }, [])

    return (
        (GetLoading || WorkStatusLoading) ? <PageLoading /> :
            <Form form={form}>
                <Form.Item label={'姓名'} name={'name'} rules={[{ required: true, message: '请输入姓名' }]}>
                    <Input placeholder={'请输入姓名'} />
                </Form.Item>
                <Form.Item label={'导师页面链接'} name={'details'}>
                    <Input placeholder={'请输入导师页面链接'} />
                </Form.Item>
                <Form.Item label={'工号'} name={'code'}
                    rules={[{
                        required: true, message: '工号格式不正确', type: 'number',
                        transform: (v) => !!v && Number(v)
                    }]}
                >
                    <Input placeholder={'请输入工号'} />
                </Form.Item>
                <Form.Item label={'手机号码'} name={'account'}
                    rules={[{
                        required: true, message: '手机号码格式不正确', pattern: /^1[3|4|5|7|8][0-9]\d{8}$/,
                        transform: (v) => !!v && Number(v)
                    }]}
                >
                    <Input placeholder={'请输入手机号码'} />
                </Form.Item>
                <Form.Item label={'邮箱'} name={'mail'}>
                    <Input placeholder={'请输入邮箱'} />
                </Form.Item>
                <Form.Item label={'招生名额'} name={'allQuotas'}
                    rules={[{
                        required: true, message: '招生名额格式不正确', type: 'number',
                        transform: (v) => !!v && Number(v)
                    }]}
                >
                    <Input placeholder={'请输入招生名额'} disabled={workStatus?.isStart} />
                </Form.Item>
                <Form.Item label={'职称'} name={'jobTitle'}
                    rules={[{ required: true, message: '请选择职称' }]}
                    onClick={(_, action) => action?.current?.open()}
                >
                    <Picker popup columns={jobTitleOption} columnsFieldNames={{ text: 'label', value: 'value' }}>
                        {v => v || '请选择职称'}
                    </Picker>
                </Form.Item>
                <Form.Item label={'研究方向'} name={'keywords'}>
                    <Input placeholder={'请输入研究方向'} />
                </Form.Item>
                <Form.Item label={'团队'} name={'teamName'} rules={[{ required: true, message: '请输入团队名称' }]}>
                    <Input placeholder={'请输入团队名称'} />
                </Form.Item>
                <Form.Item>
                    <div className="w-full flex justify-end">
                        <Button style={{ marginRight: '8px' }}>取消</Button>
                        <Button type="primary" loading={params.has('tid') ? UpdateLoading : AddLoading}
                            onClick={() => {
                                form.validateFields().then((result) => {
                                    if (!!params.has('tid')) {
                                        result['id'] = params.get('tid')
                                        delete result['allQuotas']
                                        update({ workId: params.get('wid')!, ...result }, { message: true }).then(() => {
                                            Toast.success('修改教师成功')
                                            navigator(-1)
                                        })
                                    } else {
                                        add({ id: params.get('wid')!, userlist: [result] }, { message: true }).then(() => {
                                            Toast.success('添加教师成功')
                                            navigator(-1)
                                        })
                                    }
                                })
                            }}
                        >{!!params.has('tid') ? '修改' : '新增'}</Button>
                    </div>
                </Form.Item>
            </Form>
    )
}