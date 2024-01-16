import { Button, Form, Input, Select, Row, Col, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons"
import { DOWNLOAD_TEACH_URL } from "@/constants/app"
import UploadCard from "../UploadCard";
import { useEffect, useState } from "react";
import { useRequest } from "ahooks";
import { useApi } from "@/api/request";
import { addTeacherBatch, addTeacher, updateTeacher } from "@/api/admin/teachInfo";
import { TeacherReturnType, SearchTeacherParams } from "@/objects/teacher";

const jobTitleOption = [
    { label: '教授', value: '教授' },
    { label: '研究员', value: '研究员' },
    { label: '高级工程师(正高)', value: '高级工程师(正高)' },
    { label: '副教授', value: '副教授' },
    { label: '副研究员', value: '副研究员' },
    { label: '高级工程师', value: '高级工程师' },
]

interface SearchTeacherFormPropType {
    id: string,
    refresh: () => void,
    // 打开新增导师modal
    addTeach: () => void,
    setParams: (v: SearchTeacherParams) => void
}

export function SearchTeacherForm({ id, refresh, setParams, addTeach }: SearchTeacherFormPropType) {
    const [uploadModalOpen, setUploadModalOpen] = useState(false)
    const { loading: UploadLoading, runAsync: upload } = useRequest(useApi(addTeacherBatch), { manual: true })
    const [form] = Form.useForm()
    return (
        <>
            <Form layout="inline" form={form}>
                <Row gutter={[, 8]}>
                    <Col span={8}>
                        <Form.Item label="姓名" name={"name"}>
                            <Input placeholder={'请输入姓名'} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="工号" name={'code'}>
                            <Input placeholder={'请输入工号'} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="手机号" name={"phone"}>
                            <Input placeholder={'请输入手机号'} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="实验室" name={'teamName'}>
                            <Input placeholder={'请输入实验室名称'} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="职称" name={'jobTitle'}>
                            <Select dropdownStyle={{ width: "150px" }} allowClear placeholder={'请选择职称'} options={jobTitleOption} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item>
                            <Button type="primary" shape="circle" icon={<SearchOutlined />}
                                onClick={() => {
                                    setParams(form.getFieldsValue(true))
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div className="mt-2">
                <Button type="primary" className="mr-2" onClick={() => { addTeach() }}>增加导师</Button>
                <Button type="primary" className="mr-2" onClick={() => setUploadModalOpen(true)}>批量导入</Button>
                <a href={DOWNLOAD_TEACH_URL} download={'批量导入教师模板'}>下载批量导入导师模板</a>
            </div>
            <Modal title={'批量上传'} footer={null} open={uploadModalOpen}
                onCancel={() => { setUploadModalOpen(false) }} destroyOnClose
            >
                <UploadCard loading={UploadLoading} upload={(f) => {
                    upload({ id, file: f }, { message: true, success: '批量导入导师成功' }).then(() => {
                        setUploadModalOpen(false)
                        refresh()
                    })
                }} />
            </Modal>
        </>
    )
}

interface TeachFormPropType {
    isEdit: boolean,
    teachInfo?: TeacherReturnType,
    id: string //workId
    callback: () => void
}

export function TeacherForm(props: TeachFormPropType) {
    const [form] = Form.useForm()
    useEffect(() => {
        props.isEdit && form.setFieldsValue(props.teachInfo)
    }, [props.isEdit])
    const { loading: AddLoading, runAsync: add } = useRequest(useApi(addTeacher), { manual: true })
    const { loading: UpdateLoading, runAsync: update } = useRequest(useApi(updateTeacher), { manual: true })
    return (
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 17 }} form={form}>
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
                {/*TODO：此处需考虑老师是否可编辑（轮次发布之后不可编辑） */}
                <Input placeholder={'请输入招生名额'} />
            </Form.Item>
            <Form.Item label={'职称'} name={'jobTitle'} rules={[{ required: true, message: '请选择职称' }]}>
                <Select options={jobTitleOption} placeholder={'请选择职称'} />
            </Form.Item>
            <Form.Item label={'研究方向'} name={'keywords'}>
                <Input placeholder={'请输入研究方向'} />
            </Form.Item>
            <Form.Item label={'团队'} name={'teamName'} rules={[{ required: true, message: '请输入团队名称' }]}>
                <Input placeholder={'请输入团队名称'} />
            </Form.Item>
            <Form.Item wrapperCol={{ span: 13, offset: 5 }}>
                <Button type="primary" loading={props.isEdit ? UpdateLoading : AddLoading}
                    onClick={() => {
                        form.validateFields().then((result) => {
                            if (props.isEdit) {
                                // 修改时需要携带用户的id信息
                                result['id'] = props.teachInfo?.id
                                update({ workId: props.id, ...result }, {
                                    message: true, success: '修改导师成功'
                                }).then(() => { props.callback() })
                            } else {
                                add({ id: props.id, userlist: [result] }, {
                                    message: true, success: '添加导师成功'
                                }).then(() => {
                                    props.callback()
                                })
                            }
                        })
                    }}
                >{props.isEdit ? '确定修改' : '确定新增'}</Button>
            </Form.Item>
        </Form>
    )
}