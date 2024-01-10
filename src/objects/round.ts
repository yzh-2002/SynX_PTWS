// 创建轮次时后端所需数据类型
export interface RoundCreateType {
    name: string,
    fileMaxSize: number,
    duration: {
        start_1: string, //2023-1-11 19:25:00
        start_2: string,
        start_3: string,
        start_4: string,
        end_1: string,
        end_2: string,
        end_3: string,
        end_4: string,
    },
    description?: string,
    extension?: string
}

// 查询轮次时后端返回数据
export interface RoundReturnType {
    id: string;
    name: string;
    stage: string; //阶段 submit/verify-1|2|3
    isAtStage: boolean; //确实处于当前阶段还是处于空阶段（即上一阶段已结束而下一阶段未开始）
    status: string; //notStart/end/onGoing
    round: number; //第几轮次
    duration: string; //JSON字符串
    fileMaxSize: number;
    workId: string;
    createdTime: number;
    lastUpdateTime: number;
    creatorId: string;
    lastOperatorId: string;
    description: string;
    extension: string;
}