import { UserOutlined, UserSwitchOutlined, SettingOutlined } from "@ant-design/icons"
import { Button, Divider, Form, Input, Modal, Popover, Spin } from "antd"
import { useRecoilValue } from "recoil"
import { userInfoState } from "@/store/login"
import { Fragment, useMemo, useState, useEffect } from "react"
import { RoleAlias } from "@/constants/app"
import { useRequest } from "ahooks"
import { useApi } from "@/api/request"
import { getSelfInfo, updateSelfInfo } from "@/api/teacher/userInfo"
import { getWorkInfo } from "@/api/admin/service"
import { useRecoilState } from "recoil"
import { serviceInfoState } from "@/store/service"

export default function UserMenu() {
    const user = useRecoilValue(userInfoState)
    // 修改个人信息相关
    const [form] = Form.useForm()
    const [open, setOpen] = useState(false)
    // 获取workId
    const [serviceInfo, setServiceInfo] = useRecoilState(serviceInfoState)
    const { run } = useRequest(useApi(getWorkInfo), {
        manual: true,
        // 默认应用只有一个服务
        onSuccess: (data) => {
            setServiceInfo(data?.workInfo?.length && data.workInfo[0] ||
                { id: "", name: "", status: NaN, year: NaN })
        }
    })
    useEffect(() => {
        !serviceInfo?.id && run({ page: 1, size: 10 })
    }, [])

    const { loading: getSelfLoading, runAsync: getSelf } = useRequest(useApi(getSelfInfo), { manual: true })
    const { runAsync: updateSelf, loading: UpdateLoading } = useRequest(useApi(updateSelfInfo), { manual: true })


    const items = useMemo(() => {
        const Identity = RoleAlias[user?.identity as keyof typeof RoleAlias]
        return [
            { text: <span>{Identity || 'undefined'}</span>, icon: <UserSwitchOutlined /> },
            { divider: true },
            {
                text: (getSelfLoading ? <Spin /> : "修改信息"), onClick: () => {
                    getSelf({ id: serviceInfo?.id, userId: user?.id }).then((data) => {
                        form.setFieldsValue(data?.userInfo)
                        setOpen(true)
                    })
                },
                icon: <SettingOutlined />, hidden: user?.identity !== 'teacher'
            },
        ]
    }, [user, serviceInfo?.id, getSelfLoading])
    const content = useMemo(() => {
        return (
            <div className="cursor-pointer">
                {items.map(({ text, icon, hidden = false, onClick = () => { }, divider }, i) => (
                    <Fragment key={i}>
                        {!divider && !hidden &&
                            <div key={i} onClick={onClick} className="m-2 w-20">
                                {icon}
                                <span className="ml-2">{text}</span>
                            </div>
                        }
                        {divider && !hidden && <Divider key={i + 'd'} className="m-0" />}
                    </Fragment>
                ))}
            </div>
        )
    }, [items])

    return (
        <>
            <Popover content={content}>
                <div>
                    <span className="pr-4"><UserOutlined /></span>
                    <span className="cursor-pointer">{user?.name}</span>
                </div>
            </Popover>
            <Modal title="修改信息" open={open} onCancel={() => { setOpen(false) }} footer={null}>
                <Form form={form} labelCol={{ span: 5 }} wrapperCol={{ span: 17 }}>
                    <Form.Item label="姓名" name={'name'} rules={[{ required: true, message: '请输入姓名' }]}>
                        <Input placeholder="请输入姓名" disabled />
                    </Form.Item>
                    <Form.Item label="邮箱" name={'mail'}>
                        <Input placeholder="请输入邮箱" />
                    </Form.Item>
                    <Form.Item label="研究方向" name={'keywords'}>
                        <Input placeholder="请输入研究方向" />
                    </Form.Item>
                    <Form.Item label="个人主页" name={'details'} >
                        <Input placeholder="请输入个人主页" />
                    </Form.Item>
                    <Form.Item label="职称" name={'jobTitle'} >
                        <Input placeholder="请输入职称" disabled />
                    </Form.Item>
                    <Form.Item label="招生名额" name={'allQuotas'} >
                        <Input placeholder="请输入招生名额" disabled />
                    </Form.Item>
                    <Form.Item label="剩余名额" name={'oddQuotas'} >
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="所处团队" name={'teamName'} >
                        <Input placeholder="请输入所处团队" />
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 13, offset: 5 }}>
                        <Button type="primary" loading={UpdateLoading}
                            onClick={() => {
                                form.validateFields().then((result) => {
                                    updateSelf({ workId: serviceInfo?.id, id: user?.id, ...result }, { message: true, success: '修改成功' }).then(() => {
                                        setOpen(false)
                                    })
                                })
                            }}
                        >确认修改</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}