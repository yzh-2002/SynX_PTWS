// 创建导师匹配服务所需类型
export interface ServiceCreateType {
    name: string,
    year: number,
    description?: string,
    extension?: string
}

// 查询导师匹配服务返回类型
export interface ServiceReturnType {
    createdTime?: number;
    creatorId?: string;
    description?: string;
    extension?: string;
    grpIds?: string; //关联用户分组
    id: string;
    lastOperatorId?: string;
    lastUpdateTime?: number;
    name: string;
    processIds?: string; //该服务关联轮次，使用，分隔
    status: number; //0->交互状态（已发布）1->非交互状态（未发布）
    year: number;
}

// 查询导师匹配服务参数类型
// TODO:此处无需分页，后续后端考虑去掉该参数
export interface SearchServiceParams {
    page: number;
    size: number;
}