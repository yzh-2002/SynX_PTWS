import { Button } from "antd"
import NotFoundImg from "@/assets/404.svg?react"
import { useNavigate } from "react-router-dom"
import { userInfoState } from "@/store/login"
import { useRecoilValue } from "recoil"
import { RoleHome } from "@/constants/app"

function NotFound() {
    const navigate = useNavigate()
    const userInfo = useRecoilValue(userInfoState)
    return (
        <div className="flex flex-col justify-center items-center m-auto mt-8">
            {/* FIXME:此处tailwind w-75 h-75不生效... */}
            <NotFoundImg style={{ width: '300px', height: '300px' }} />
            <div className="px-6 text-xl opacity-50">很抱歉，您要访问的页面不存在！</div>
            <div className="flex justify-center">
                <Button className="mt-2 mr-2" onClick={() => { navigate(-1) }} type="primary">返回</Button>
                <Button className="mt-2" onClick={() => {
                    navigate(!!userInfo?.identity ? `/app${RoleHome[userInfo?.identity]}` : '/')
                }} type="primary">首页</Button>
            </div>
        </div>
    )
}

export default NotFound