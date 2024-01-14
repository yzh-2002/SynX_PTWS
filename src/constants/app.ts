import { TARGET, env, API_ENTRY } from "../../config/global"

export const SCHOOL_NAME = '电子科技大学'
export const COLLEGE_NAME = '信息与软件工程学院'
export const APP_FULL_NAME = '导师匹配管理系统'

interface RoleHomeType {
    [key: string]: string | undefined
}

export const RoleAlias = {
    'admin': '管理员',
    'tutor': '教师',
    'student': '考生'
}

// 后端返回用户身份字段
export const Role = {
    Admin: 'admin',
    Teacher: 'tutor',
    Student: 'student'
}

// 不同身份登陆后跳转首页路由
export const RoleHome: RoleHomeType = {
    [Role.Admin]: '',
    [Role.Teacher]: '',
    [Role.Student]: ''
}

// 批量导入模板链接
// TODO:目前存在问题
export const DOWNLOAD_TEACH_URL = `${TARGET[env]}${API_ENTRY}/file/批量导入导师模板.xlsx`
export const DOWNLOAD_STU_URL = `${TARGET[env]}${API_ENTRY}/file/批量导入学生模板.xlsx`