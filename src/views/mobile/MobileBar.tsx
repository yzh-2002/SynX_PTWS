import { ArrowLeft, WapHomeO } from "@react-vant/icons"
import { useLocation, useNavigate } from "react-router-dom"
import { BAR_CONFIG } from "@/constants/mobile"
import { APP_FULL_NAME } from "@/constants/app"
import { useRecoilValue } from "recoil"
import { userInfoState } from "@/store/login"
import { RoleHome } from "@/constants/app"

function MobileBar() {
    const location = useLocation()
    const navigator = useNavigate()
    const userInfo = useRecoilValue(userInfoState)
    return (
        <div className="flex items-center justify-between bg-slate-50 h-14 px-1">
            {BAR_CONFIG[location?.pathname]?.isHome ?
                <WapHomeO className="ml-2" fontSize={'25px'} onClick={() => {
                    navigator(!!userInfo?.identity ? `/app${RoleHome[userInfo?.identity]}` : '/')
                }} /> :
                <ArrowLeft className="ml-2" fontSize={'25px'} onClick={() => { navigator(-1) }} />
            }
            <span className=" font-bold text-lg mr-2">{BAR_CONFIG[location?.pathname]?.title || APP_FULL_NAME}</span>
            <div />
        </div>
    )
}

export default MobileBar