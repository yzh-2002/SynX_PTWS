import { ApiType } from "../utils/interface"
import generateApi from "../utils/generateApi"

const Api: { [index: string]: ApiType } = {
    loginByCode: {
        path:'/loginbycode',
        method: 'post'
    }
}

let _apis: {
    [index: string]: any //返回Promise接口请求对象
} = {}
Object.keys(Api).forEach(key => {
    _apis[key] = generateApi(Api[key]);
})

export default _apis

