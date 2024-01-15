import { TARGET, env, API_ENTRY } from "../../config/global"

export const SCHOOL_NAME = '电子科技大学'
export const COLLEGE_NAME = '信息与软件工程学院'
export const APP_FULL_NAME = '导师匹配管理系统'

interface RoleHomeType {
    [key: string]: string
}

export const RoleAlias = {
    'admin': '管理员',
    'tutor': '教师',
    'student': '考生'
}


// 不同身份登陆后跳转首页路由
export const RoleHome: RoleHomeType = {
    'admin': '/admin-home',
    'tutor': '/tutor-home',
    'student': '/stu-home'
}

export const MimeMap: { [key: string]: string | undefined } = {
    'image': 'image/*',
    'audio': 'audio/*',
    'video': 'video/*',
    'pdf': 'application/pdf',
    // 'ppt': 'application/vnd.ms-powerpoint',
    'ppt': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'word': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'doc': 'application/msword',
    'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'xls': 'application/vnd.ms-excel',
    'text': 'text/plain',
    'txt': 'text/plain',
    'zip': 'application/zip',
    'csv': 'text/csv'
}


// 批量导入模板链接
export const DOWNLOAD_TEACH_URL = `${TARGET[env]}${API_ENTRY}/file/批量导入导师模板.xlsx`
export const DOWNLOAD_STU_URL = `${TARGET[env]}${API_ENTRY}/file/批量导入学生模板.xlsx`