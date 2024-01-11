export interface TeacherReturnType {
    allQuotas?: number; //全部名额
    code: string; //工号
    description?: string; //description是用户基础服务必须字段，在双选服务中不关心
    details?: string; //详情信息，用于存储老师个人主页链接
    extension?: string;
    gender: number; //0->女，1->男
    identity: string; //身份
    jobTitle?: string;
    keywords?: string; //研究方向
    mail: string;
    name: string;
    oddQuotas?: number; //剩余名额
    status: number; //
    teamName?: string;
    id: string,
    account: string
}

export type TeacherAddType = Omit<TeacherReturnType, 'id'>

export interface SearchTeacherParams {
    code?: string;
    description?: string;
    jobTitle?: string;
    keywords?: string;
    name?: string;
    phone?: string;
    teamName?: string;
    // FIXME:没有分页？？
}