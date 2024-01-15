interface SelectedTutorType {
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

// 学生获取任务详情信息
export interface StuTaskReturnType {
    // 当前任务所属轮次信息
    processInfo: {
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
    },
    //TODO：该字段实际未使用
    tutorInfo: any,
    // TODO：该字段实际未使用
    selectedResInfo: any,
    // 用户上传简历，未上传简历时为空
    fileUrl: string,
    // 当前选择的三个志愿
    currentSelectedTutor: {
        tutorId1: SelectedTutorType,
        tutorId2: SelectedTutorType,
        tutorId3: SelectedTutorType
    },
    // TODO:意义不明
    status: boolean
}