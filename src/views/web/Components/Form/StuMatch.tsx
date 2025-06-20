import { Form, Row, Col, Input, Button, Select } from "antd"
import { SearchOutlined, RedoOutlined } from "@ant-design/icons"
import { StuMSParams } from "../../Admin/StuMatchInfo"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { MS_STATUS } from "@/constants/ms"
import { exportStuMSInfo } from "@/api/admin/ms"

interface SearchStuMatchFormPropType {
    id: string,
    params: StuMSParams,
    setParams: (v: StuMSParams) => void,
    refreshTable: () => void
}

export function SearchStuMatchForm({ id, params, setParams, refreshTable }: SearchStuMatchFormPropType) {
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
                        <Select allowClear placeholder={'请选择匹配状态'}
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
                <Col span={6}>
                    <Form.Item>
                        <Button type="primary" loading={ExportStuLoading}
                            onClick={() => {
                                exportStu({ workId: id, ...params }, { message: true, success: '导出学生信息成功' })
                            }}
                        >导出学生匹配信息</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    )
}