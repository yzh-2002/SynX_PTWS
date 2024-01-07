import { Image } from "react-vant"
import { useRecoilValue } from "recoil"

import { userInfoState } from "@/store/login"

// TODO:样式需要修改
export default function UserCard() {
    const userInfo = useRecoilValue(userInfoState)
    return (
        <div className="flex items-center">
            <Image round fit="cover" width={'10vw'}  src={userInfo?.avatar} />
            <div className="flex flex-col ml-2">
                <span>{userInfo?.name}</span>
                <span>{`open_id：${userInfo?.id}`}</span>
            </div>
        </div>
    )
}