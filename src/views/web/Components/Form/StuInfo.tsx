import { Form, Row, Col, Button, Input, Modal } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { DOWNLOAD_STU_URL } from "@/constants/app"
import UploadCard from "../UploadCard"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { addStuBatch, addStu, updateStu } from "@/api/admin/stuInfo"
import { useState, useEffect } from "react"
import { SearchStudentParams, StudentReturnType } from "@/objects/student"

interface SearchStuFormPropType {
    id: string,
    refresh: () => void,
    // 打开新增学生modal
    addStu: () => void,
    setParams: (v: SearchStudentParams) => void
}

export function SearchStuInfoForm({ id, refresh, addStu, setParams }: SearchStuFormPropType) {
    const [uploadModalOpen, setUploadModalOpen] = useState(false)
    const { loading: UploadLoading, runAsync: upload } = useRequest(useApi(addStuBatch), { manual: true })
    const [form] = Form.useForm()
    return (
        <>
            <Form form={form}>
                <Row gutter={[8, 0]}>
                    <Col span={7}>
                        <Form.Item label='姓名'>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={7}>
                        <Form.Item label='考号'>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={7}>
                        <Form.Item label='手机号'>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={3}>
                        <Form.Item>
                            <Button type="primary" shape="circle" icon={<SearchOutlined />} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div>
                <Button type="primary" className="mr-2" onClick={() => { addStu() }}>增加学生</Button>
                <Button type="primary" className="mr-2" onClick={() => { setUploadModalOpen(true) }}>批量导入</Button>
                <a href={DOWNLOAD_STU_URL} download={'批量导入教师模板'}>下载批量导入学生模板</a>
            </div>
            <Modal title={'批量上传'} footer={null} open={uploadModalOpen}
                onCancel={() => { setUploadModalOpen(false) }} destroyOnClose
            >
                <UploadCard loading={UploadLoading} upload={(f) => {
                    upload({ id, file: f }, { message: true, success: '批量导入学生成功' }).then(() => {
                        setUploadModalOpen(false)
                        refresh()
                    })
                }} />
            </Modal>
        </>
    )
}

interface StuFormPropType {
    isEdit: boolean,
    stuInfo?: StudentReturnType,
    id: string //workId
    callback: () => void
}

export function StuInfoForm(props: StuFormPropType) {
    const [form] = Form.useForm()
    useEffect(() => {
        props.isEdit && form.setFieldsValue(props.stuInfo)
    }, [props.isEdit])
    const { loading: AddLoading, runAsync: add } = useRequest(useApi(addStu), { manual: true })
    const { loading: UpdateLoading, runAsync: update } = useRequest(useApi(updateStu), { manual: true })
    return (
        <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
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
            <Form.Item wrapperCol={{ span: 13, offset: 5 }}>
                <Button type="primary" loading={props.isEdit ? UpdateLoading : AddLoading}
                    onClick={() => {
                        form.validateFields().then((result) => {
                            if (props.isEdit) {
                                // 修改时需要携带用户的id信息
                                result['id'] = props.stuInfo?.id
                                update({ workId: props.id, ...result }, {
                                    message: true, success: '修改学生成功'
                                }).then(() => { props.callback() })
                            } else {
                                add({ id: props.id, userlist: [result] }, {
                                    message: true, success: '添加学生成功'
                                }).then(() => {
                                    props.callback()
                                })
                            }
                        })

                    }}>{props.isEdit ? '确定修改' : '确定新增'}</Button>
            </Form.Item>
        </Form>
    )
}

// 管理端-师生导入-导师详情-指定学生
export function SearchSpecifyStuForm() {
    const [form] = Form.useForm()

    return (
        <Form form={form}>
            <Row gutter={[8, 0]}>
                <Col span={7}>
                    <Form.Item label='姓名'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={7}>
                    <Form.Item label='考号'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={7}>
                    <Form.Item label='手机号'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item>
                        <Button type="primary" shape="circle" icon={<SearchOutlined />} />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}