import { Button } from "antd"
import PermissionDenyImg from "@/assets/403.svg?react"
import { useNavigate } from "react-router-dom"
import { userInfoState } from "@/store/login"
import { useRecoilValue } from "recoil"
import { RoleHome } from "@/constants/app"

function PermissionDeny() {
    const navigate = useNavigate()
    const userInfo = useRecoilValue(userInfoState)
    return (
        <div className="flex flex-col justify-center items-center m-auto mt-8">
            <PermissionDenyImg style={{ width: "300px", height: "300px" }} />
            <div className="px-6 text-xl opacity-50">暂无权限</div>
            <div className="flex justify-center">
                <Button className="mt-2 mr-2" onClick={() => { navigate(-1) }} type="primary">返回</Button>
                <Button className="mt-2" onClick={() => {
                    navigate(!!userInfo?.identity ? `/app${RoleHome[userInfo?.identity]}` : '/')
                }} type="primary">首页</Button>
            </div>
        </div>
    )
}

export default PermissionDeny