import { Form, Row, Col, Input, Button } from "antd"
import { SearchOutlined } from "@ant-design/icons"

export function SearchTeachMatchForm() {
    return (
        <>
            <Form layout="inline">
                <Row gutter={[, 8]}>
                    <Col span={8}>
                        <Form.Item label='导师姓名'>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label='学生姓名'>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label='申报轮次'>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label='导师团队'>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label='匹配状态'>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item>
                            <Button type="primary" shape="circle" icon={<SearchOutlined />} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div className="mt-2">
                <Button className="mr-2" type="primary">导出导师信息</Button>
                <Button type="primary">导出匹配详情</Button>
            </div>
        </>
    )
}