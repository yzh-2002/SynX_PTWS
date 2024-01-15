import { api, ajax } from "../request";
import { SearchRoundParams, RoundReturnType, RoundCreateType } from "@/objects/round";

export const getRoundList = api<SearchRoundParams, RoundReturnType[]>({
    url: "/process",
    method: 'GET'
})

export const updateRoundStatus = api<{ id: string }>({
    url: '/process/status',
    method: 'GET'
})

// 由于该函数POST请求同时使用query和body参数，故api函数无法直接传递配置项
export const addRound = api<{ workId: string } & { processList: RoundCreateType[] }>(
    async ({ workId, processList }) =>
        await ajax({
            url: '/process',
            method: 'POST',
            data: {
                processlist: processList
            },
            params: { workId }
        })
)

export const delRound = api<{ ids: string[] }>({
    url: '/process?_method=DELETE',
    method: 'POST'
})

export const updateRoundInfo = api<{ id: string } & RoundCreateType>({
    url: '/process?_method=PUT',
    method: 'POST'
})