export interface StudentType {
    code?: string; //考号
    description?: string;
    extension?: string;
    gender?: number; //?
    identity?: string; //admin,student,tutor
    mail?: string;
    name?: string;
    status?: number; //用户基础服务配置，在双选系统中不关心
}

// 考生查询参数
export interface SearchStudentParams {
    code?: string;
    description?: string;
    id: string; //?
    name?: string;
    page?: number;
    phone?: string; //=>account ???
    size?: number;
}