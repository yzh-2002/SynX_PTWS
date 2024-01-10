import { api } from "../request";
import { SearchServiceParams, ServiceReturnType, ServiceCreateType } from "@/objects/service";

export const getWorkInfo = api<SearchServiceParams, { total: number, workInfo: ServiceReturnType[] }>({
    url: '/work',
    method: 'GET'
})

export const createWork = api<ServiceCreateType, void>({
    url: '/work',
    method: 'POST'
})

export const updateWork = api<{ id: string } & ServiceCreateType>({
    url: '/work?_method=PUT',
    method: 'POST'
})

export const delWork = api<{ ids: string[] }>({
    url: '/work?_method=DELETE',
    method: 'POST'
})

// 变更工作状态，0->未发布，1->已发布
export const updateWorkStatus = api<{ id: string }>({
    url: '/work/status',
    method: 'GET'
})