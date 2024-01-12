import { api, uploadFile, ajax } from "../request";
import { SearchStudentParams, StudentReturnType, StudentAddType } from "@/objects/student";

export const getStuList = api<{ id: string } & SearchStudentParams, { total: number, userInfo: StudentReturnType[] }>({
    url: '/work/student',
    method: 'GET'
})

export const addStuBatch = ({ id, file }: { id: string, file: File }) => {
    return uploadFile({
        url: '/work/student/excel',
        file,
        params: { id }
    })
}

export const addStu = api<{ id: string } & { userlist: StudentAddType[] }>(
    async ({ id, userlist }) =>
        await ajax({
            url: `/work/student?id=${id}`,
            method: 'POST',
            data: {
                userlist
            }
        })
)

// TODO:更新用户这里不需要workId？？？？
// FIXME：外部id为workId，data中也存在id为userId，故需更改命名
export const updateStu = api<{ workId?: string } & StudentReturnType>(
    async ({ workId, ...data }) =>
        await ajax({
            url: `/work/student?id=${workId}&_method=PUT`,
            method: 'POST',
            data
        })
)

export const delStu = api<{ id: string, ids: string[], force: 0 | 1 }>(
    async ({ id, ids, force }) =>
        await ajax({
            url: `/work/student?id=${id}&_method=DELETE`,
            method: 'POST',
            data: {
                ids, force
            }
        })
)