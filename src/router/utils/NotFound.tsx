import { Button } from "antd"
import NotFoundImg from "@/assets/404.svg?react"
import { useNavigate } from "react-router-dom"

function NotFound() {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col justify-center items-center m-auto mt-8">
            {/* FIXME:此处tailwind w-75 h-75不生效... */}
            <NotFoundImg style={{ width: '300px', height: '300px' }} />
            <div className="px-6 text-xl opacity-50">很抱歉，您要访问的页面不存在！</div>
            <Button className="mt-2" onClick={() => { navigate(-1) }} type="primary">返回</Button>
        </div>
    )
}

export default NotFound