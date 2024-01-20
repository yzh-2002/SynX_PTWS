export interface SelectedTutorType {
    account: string;
    allQuotas: number;
    code: string;
    createdTime: number;
    creatorId: string;
    description: string;
    details: string;
    extension: null;
    gender: number;
    id: string;
    identity: string;
    jobTitle: string;
    keywords: string;
    lastOperatorId: null;
    lastUpdateTime: null;
    mail: null;
    name: string;
    oddQuotas: number;
    status: number;
    teamName: string;
    workId: string;
}

interface ProcessInfoType {
    createdTime: number;
    creatorId: string;
    description: string;
    duration: string;
    extension: string;
    fileMaxSize: number;
    id: string;
    lastOperatorId: string;
    lastUpdateTime: number;
    name: string;
    round: number;
    stage: string;
    status: string;
    workId: string;
}

// 学生获取任务详情信息
export interface StuTaskReturnType {
    // 当前任务所属轮次信息
    processInfo: ProcessInfoType
    //学生可选择导师列表，与其他信息耦合，此处不适用，单独从另一接口返回
    tutorInfo: any,
    // 该字段实际未使用
    selectedResInfo: any,
    // 用户上传简历，未上传简历时为空
    fileUrl: string,
    // 当前选择的三个志愿
    currentSelectedTutor: {
        tutorId1: SelectedTutorType,
        tutorId2: SelectedTutorType,
        tutorId3: SelectedTutorType
    },
    // 是否已提交志愿，0->未提交，1->已提交
    status: number
}

export interface StuChooseTeachType {
    account: string;
    allQuotas: number;
    code: string;
    createdTime: number;
    creatorId: string;
    description?: string;
    details?: string;
    extension?: string;
    gender: number;
    id: string;
    identity: string;
    jobTitle: string;
    keywords: string;
    lastOperatorId?: string;
    lastUpdateTime?: string;
    mail?: string;
    name: string;
    oddQuotas: number;
    status: number;
    teamName: string;
    workId: string;
}

export interface StuInfoType {
    account: string,
    code: string,
    description?: string,
    extension?: string,
    fileUrl: string,
    gender?: number,
    id: string,
    identity: string,
    isSelected: boolean,
    mail?: string,
    name: string,
    serialVersionUID: number,
    status: number
}

// 教师获取任务详情信息
export interface TeachTaskReturnType {
    processInfo: ProcessInfoType,
    // 当前教师的详情信息
    quotaInfo: {
        allQuotas: number;
        createdTime: number;
        creatorId: string;
        description: null;
        details: null;
        extension: null;
        jobTitle: string;
        keywords: string;
        lastOperatorId: null;
        lastUpdateTime: null;
        oddQuotas: number;
        teaId: string;
        teamName: string;
        workId: string;
    }
    // 管理员指定学生
    adminStuInfo: StuInfoType[]
    stageMap: {
        // 教师选择的学生
        passStuInfo: StuInfoType[],
        // 教师未选择的学生（也没拒绝）
        notSelectStuInfo: StuInfoType[],
        // 教师拒绝选择的学生
        rejectStuInfo: StuInfoType[]
    }
}

// 学生申请教师列表时搜索参数
export interface SearchChooseTeachListParams {
    id: string;
    jobTitle?: string;
    keywords?: string;
    page: number;
    size: number;
    teamName?: string;
    teaName?: string;
}