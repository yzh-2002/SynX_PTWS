import { UserOutlined, UserSwitchOutlined, SettingOutlined } from "@ant-design/icons"
import { Divider, Form, Input, Modal, Popover } from "antd"
import { useRecoilValue } from "recoil"
import { userInfoState } from "@/store/login"
import { Fragment, useState } from "react"


export default function UserMenu() {
    const user = useRecoilValue(userInfoState)
    const items = [
        { text: "用户身份", icon: <UserSwitchOutlined /> },
        { divider: true },
        { text: "修改信息", onClick: () => { setOpen(true) }, icon: <SettingOutlined /> },
    ]
    const content = (
        <div className="cursor-pointer">
            {items.map(({ text, icon, onClick = () => { }, divider }, i) => (
                <Fragment key={i}>
                    {!divider &&
                        <div key={i} onClick={onClick} className="m-2">
                            {icon}
                            <span className="ml-2">{text}</span>
                        </div>
                    }
                    {divider && <Divider key={i + 'd'} className="m-0" />}
                </Fragment>
            ))}
        </div>
    )
    // 修改个人信息相关
    const [form] = Form.useForm()
    const [open, setOpen] = useState(false)
    return (
        <>
            <Popover
                content={content}
            >
                <div>
                    <span className="pr-4"><UserOutlined /></span>
                    <span className="cursor-pointer">{user?.name}</span>
                </div>
            </Popover>
            <Modal title="修改信息" open={open} onCancel={() => { setOpen(false) }} footer={null}>
                <Form form={form}>
                    <Form.Item label="姓名" name={'name'} rules={[{ required: true, message: '请输入姓名' }]}>
                        <Input placeholder="请输入" disabled />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}