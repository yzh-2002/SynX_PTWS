import { api } from "../request";
import { TeachTaskReturnType } from "@/objects/task";

export const getTeachTaskInfo = api<{ id: string, stage: number }, TeachTaskReturnType>({
    url: '/process/verifyInfo',
    method: 'GET'
})

// status:0=>选择 1=>拒绝
export const verifyStu = api<{ processId: string, stuId: string, status: number }>({
    url: '/process/verify',
    method: 'POST'
})