export const SCHOOL_NAME = '电子科技大学'
export const COLLEGE_NAME = '信息与软件工程学院'
export const APP_FULL_NAME = '导师匹配管理系统'

interface RoleHomeType {
    [key: string]: string | undefined
}

// 后端返回用户身份字段
export const Role = {
    Admin: '',
    Teacher: '',
    Student: ''
}

// 不同身份登陆后跳转首页路由
export const RoleHome: RoleHomeType = {
    [Role.Admin]: '',
    [Role.Teacher]: '',
    [Role.Student]: ''
}