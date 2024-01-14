import { Form, Row, Col, Input, Button, Select } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import { exportTeachMSInfo, exportMSInfo } from "@/api/admin/ms"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { MS_STATUS } from "@/constants/ms"
import { MSParams } from "../../Admin/TeachMatchInfo"

interface SearchTeachMatchFormPropType {
    id: string,
    params: MSParams
    setParams: (v: MSParams) => void
}

export function SearchTeachMatchForm({ id, params, setParams }: SearchTeachMatchFormPropType) {
    const { loading: ExportTeachLoading, run: exportTeach } = useRequest(useApi(exportTeachMSInfo), { manual: true })
    const { loading: ExportMSLoading, run: exportMS } = useRequest(useApi(exportMSInfo), { manual: true })
    const [form] = Form.useForm()
    return (
        <>
            <Form layout="inline" form={form}>
                <Row gutter={[, 8]}>
                    <Col span={8}>
                        <Form.Item label='导师姓名' name={'teaName'}>
                            <Input placeholder={'请输入导师姓名'} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label='学生姓名' name={'stuName'}>
                            <Input placeholder={'请输入学生姓名'} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label='申报轮次' name={'twsRound'}>
                            <Input placeholder={'请输入申报轮次'} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label='导师团队' name={'teamName'}>
                            <Input placeholder={'请输入导师团队'} />
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
                    <Col span={8}>
                        <Form.Item>
                            <Button type="primary" shape="circle" icon={<SearchOutlined />} onClick={() => {
                                setParams(form.getFieldsValue())
                            }} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div className="mt-2">
                <Button className="mr-2" type="primary" loading={ExportTeachLoading}
                    onClick={() => {
                        exportTeach({ workId: id }, { message: true, success: '导出导师信息成功' })
                    }}>导出导师信息</Button>
                <Button type="primary" loading={ExportMSLoading} onClick={() => {
                    exportMS({ workId: id, ...params }, { message: true, success: '导出匹配详情成功' })
                }}>导出匹配详情</Button>
            </div>
        </>
    )
}