//ms=>mutual selection(双选)

export interface MSType {
    choiceRank: number; //第几志愿
    createdTime: number;
    creatorId: string;
    description: null;
    extension: null;
    instanceId: string; //流程实例ID，Service运行之后创建一个对应的instance，无用
    jobTitle: string;
    keywords: string;
    lastOperatorId: null | string;
    lastUpdateTime: number | null;
    processId: string; //round id
    status: number;
    stuCode: string;
    stuId: string;
    stuName: string;
    teaCode: string;
    teaId: string;
    teamName: string;
    teaName: string;
    twsRound: number; //双选轮次=> 第几个task
    workId: string; //Service ID
}

export interface SearchMSParams {
    choiceRank?: string;
    page?: number;
    processId?: string;
    size?: number;
    status?: string;
    stuId?: string;
    teaId?: string;
    twsRound?: string;
    keywords?: string;
    workId: string;
}

export interface StuMSType {
    choiceRank?: number;
    status?: number;
    stuCode?: string;
    stuName?: string;
    stuPhone?: string;
    teaCode?: string;
    teaName?: string;
    twsRound?: number;
}

export interface SearchStuMSParams {
    choiceRank?: number;
    status?: number;
    stuCode?: string;
    teaCode?: string;
    twsRound?: number;
    workId: string;
    page: number,
    size: number
}