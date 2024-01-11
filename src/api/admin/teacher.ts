import { api, uploadFile } from "../request";
import { SearchTeacherParams, TeacherReturnType } from "@/objects/teacher";

export const getTeacherList = api<{ id: string } & SearchTeacherParams, { total: number, userInfo: TeacherReturnType[] }>({
    url: "/work/teacher",
    method: 'GET'
})

// 批量导入
export function addTeacherBatch({ id, file }: { id: string, file: File }) {
    return uploadFile({
        url: '/work/teacher/excel',
        file,
        params: { id }
    })
}