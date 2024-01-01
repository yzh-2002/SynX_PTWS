import { Button } from "antd"
import PermissionDenyImg from "@/assets/403.svg?react"
import { useNavigate } from "react-router-dom"

function PermissionDeny() {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col justify-center items-center m-auto mt-8">
            <PermissionDenyImg style={{ width: "300px", height: "300px" }} />
            <div className="px-6 text-xl opacity-50">暂无权限</div>
            <Button className="mt-2" onClick={() => { navigate(-1) }} type="primary">返回</Button>
        </div>
    )
}

export default PermissionDeny