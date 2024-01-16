import { Form, Row, Col, Input, Select, Button } from "antd";
import { MS_STATUS } from "@/constants/ms";
import { SearchOutlined } from "@ant-design/icons"

export function SearchMSRsultForm() {
    const [form] = Form.useForm()
    return (
        <Form form={form} layout="inline">
            <Row gutter={[, 8]}>
                <Col span={8}>
                    <Form.Item label='导师姓名'>
                        <Input placeholder="请输入导师姓名" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='导师方向'>
                        <Input placeholder="请输入导师研究方向" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='双选轮次'>
                        <Input placeholder="请输入双选轮次" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='第几志愿'>
                        <Input placeholder="请输入第几志愿" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='双选状态'>
                        <Select allowClear placeholder={'请选择双选状态'}
                            options={MS_STATUS.map((status, idx) => ({
                                label: status, value: idx - 1
                            }))}
                        />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Form.Item>
                        <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => {

                        }} />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}