import { ajax, api, uploadFile } from "../request";
import { SearchTeacherParams, TeacherReturnType, TeacherAddType } from "@/objects/teacher";

// TODO:搜索时参数在query中转义导致查询失败...
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

export const addTeacher = api<{ id: string } & { userlist: TeacherAddType[] }>(
    async ({ id, userlist }) =>
        await ajax({
            url: `/work/tutor?id=${id}`,
            method: 'POST',
            data: {
                userlist
            }
        })
)

// FIXME：外部id为workId，data中也存在id为userId，故需更改命名
export const updateTeacher = api<{ workId: string } & TeacherReturnType>(
    async ({ workId, ...data }) =>
        await ajax({
            url: `/work/teacher?id=${workId}&_method=PUT`,
            method: 'POST',
            data
        })
)

export const delTeacher = api<{ id: string, ids: string[] }>(
    async ({ id, ids }) =>
        await ajax({
            url: `/work/teacher?id=${id}&_method=DELETE`,
            method: 'POST',
            data: {
                ids
            }
        })
)