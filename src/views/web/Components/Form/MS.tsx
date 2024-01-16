import { Form, Row, Col, Input, Select, Button } from "antd";
import { MS_STATUS } from "@/constants/ms";
import { SearchOutlined, RedoOutlined } from "@ant-design/icons"
import { MSParams } from "../../Admin/TeachMatchInfo";

interface SearchMSFormPropType {
    setParams: (v: MSParams) => void,
    refreshTable: () => void
}

export function SearchStuMSRsultForm({ setParams, refreshTable }: SearchMSFormPropType) {
    const [form] = Form.useForm()
    return (
        <Form form={form} layout="inline">
            <Row gutter={[, 8]}>
                <Col span={8}>
                    <Form.Item label='导师姓名' name={'teaName'}>
                        <Input placeholder="请输入导师姓名" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='导师方向' name={'keywords'}>
                        <Input placeholder="请输入导师研究方向" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='双选轮次' name={'twsRound'}>
                        <Input placeholder="请输入双选轮次" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='第几志愿' name={'choiceRank'}>
                        <Input placeholder="请输入第几志愿" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='双选状态' name={'status'}>
                        <Select allowClear placeholder={'请选择双选状态'}
                            options={MS_STATUS.map((status, idx) => ({
                                label: status, value: idx - 1
                            }))}
                        />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Form.Item>
                        <div className="flex">
                            <Button type="primary" shape="circle" icon={<SearchOutlined />}
                                onClick={() => {
                                    setParams({ ...form.getFieldsValue() })
                                }}
                            />
                            <Button className="ml-2" type="primary" shape="circle" icon={<RedoOutlined />}
                                onClick={() => {
                                    form.resetFields()
                                    refreshTable()
                                }}
                            ></Button>
                        </div>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}

export function SearchTeachMSRsultForm({ setParams, refreshTable }: SearchMSFormPropType) {
    const [form] = Form.useForm()

    return (
        <Form layout="inline" form={form}>
            <Row gutter={[, 8]}>
                <Col span={8}>
                    <Form.Item label="学生考号" name={'stuCode'}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='双选轮次' name={'twsRound'}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='第几志愿' name={'choiceRank'}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='双选状态' name={'status'}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Form.Item>
                        <div className="flex">
                            <Button type="primary" shape="circle" icon={<SearchOutlined />}
                                onClick={() => {
                                    setParams({ ...form.getFieldsValue() })
                                }}
                            />
                            <Button className="ml-2" type="primary" shape="circle" icon={<RedoOutlined />}
                                onClick={() => {
                                    form.resetFields()
                                    refreshTable()
                                }}
                            ></Button>
                        </div>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}