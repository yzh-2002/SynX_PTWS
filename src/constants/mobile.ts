// mobile Bar 配置
interface BarConfigType {
    [router: string]: {
        title: string,
        isHome: boolean //Bar左侧按钮为跳转至主页还是返回上一路由
    }
}


export const BAR_CONFIG: BarConfigType = {
    "/app": {
        title: '导师匹配管理系统',
        isHome: true
    },
    "/app/service": {
        title: '全部导师匹配管理服务',
        isHome: true
    },
    "/app/create-service": {
        title: '创建导师匹配服务',
        isHome: false
    }
}