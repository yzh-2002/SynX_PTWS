import { TeacherReturnType } from "@/objects/teacher";
import { ajax, api } from "../request";

// 前一个id为workId
export const getSelfInfo = api<{ id: string, userId: string }, { userInfo: TeacherReturnType }>({
    url: '/work/teacher/self',
    method: 'GET'
})

interface UpdateSelfInfoType {
    id: string,
    mail: string,
    keywords: string,
    details: string
}

export const updateSelfInfo = api<{ workId: string } & UpdateSelfInfoType>(
    async ({ workId, ...data }) =>
        await ajax({
            url: '/work/teacher/personal',
            method: 'POST',
            params: {
                id: workId,
                '_method': 'PUT'
            },
            data
        })
)