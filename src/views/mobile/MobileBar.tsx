import { WapHomeO } from "@react-vant/icons"
import { useLocation, useNavigate } from "react-router-dom"
import { BAR_CONFIG } from "@/constants/mobile"
import { APP_FULL_NAME } from "@/constants/app"
import { useRecoilValue } from "recoil"
import { userInfoState } from "@/store/login"
import { RoleHome } from "@/constants/app"
import { NavBar } from "react-vant"

function MobileBar() {
    const location = useLocation()
    const navigator = useNavigate()
    const userInfo = useRecoilValue(userInfoState)
    return (
        <NavBar
            title={BAR_CONFIG[location?.pathname] || APP_FULL_NAME}
            leftText='返回'
            onClickLeft={() => { navigator(-1) }}
            rightText={<WapHomeO fontSize={20} />}
            onClickRight={() => {
                navigator(!!userInfo?.identity ? `/app${RoleHome[userInfo?.identity]}` : '/')
            }}
        />
    )
}

export default MobileBar