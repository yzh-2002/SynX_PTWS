import { Form, Row, Col, Button, Input } from "antd"
import { SearchOutlined } from "@ant-design/icons"

export function SearchStuInfoForm() {
    return (
        <>
            <Form>
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
                <Button type="primary" className="mr-2" onClick={() => { }}>增加学生</Button>
                <Button type="primary" className="mr-2" onClick={() => { }}>批量导入</Button>
                <a href={''} download={'批量导入教师模板'}>下载批量导入学生模板</a>
            </div>
        </>
    )
}

export function StuInfoForm() {
    return (
        <Form>
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
                <Button>确定新增</Button>
            </Form.Item>
        </Form>
    )
}