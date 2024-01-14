import { Form, Row, Col, Input, Button } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { StuMSParams } from "../../Admin/StuMatchInfo"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { exportStuMSInfo } from "@/api/admin/ms"

interface SearchStuMatchFormPropType {
    id: string,
    params: StuMSParams,
    setParams: (v: StuMSParams) => void
}

export function SearchStuMatchForm({ id, params, setParams }: SearchStuMatchFormPropType) {
    const { loading: ExportStuLoading, run: exportStu } = useRequest(useApi(exportStuMSInfo), { manual: true })
    const [form] = Form.useForm()
    return (
        <Form layout="inline" form={form}>
            <Row gutter={[, 8]}>
                <Col span={8}>
                    <Form.Item label='导师姓名' name={'teaName'}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='学生姓名' name={'stuName'}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='对应轮次' name={'twsRound'}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='对应志愿' name={'choiceRank'}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label='匹配状态' name={'status'}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Form.Item>
                        <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => {
                            setParams(form.getFieldsValue())
                        }} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item>
                        <Button type="primary" loading={ExportStuLoading}
                            onClick={() => {
                                exportStu({ workId: id, ...params }, { message: true, success: '导出学生信息成功' })
                            }}
                        >导出学生信息</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}