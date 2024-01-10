// 用户登录参数
export interface LoginParams {
    clientId: string;
    clientSecret: string;
    code: string;
    redirectUri: string;
}

// 登录用户信息
export interface UserInfoType {
    createdTime: number,
    lastUpdateTime?: number,
    creatorId: string,
    lastOperatorId?: string,
    description?: string,
    extension?: string,
    id: string,
    name: string,
    account?: string, //手机号？？
    password: string,
    gender: number,
    mail: string,
    status?: number, //用户基础服务字段，双选系统内不关心
    code?: string,
    identity: string,
    salt?: string
}