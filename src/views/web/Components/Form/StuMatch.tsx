import { Form, Row, Col, Input, Button } from "antd"
import { SearchOutlined } from "@ant-design/icons"

export function SearchStuMatchForm() {
    return (
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
                    <Form.Item label='对应轮次'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='对应志愿'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='匹配状态'>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Form.Item>
                        <Button type="primary" shape="circle" icon={<SearchOutlined />} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item>
                        <Button type="primary">导出学生信息</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}