import { api, uploadFile } from "../request";
import { StuTaskReturnType } from "@/objects/task";

export const getStuTaskInfo = api<{ id: string, page: number, size: number }, StuTaskReturnType>({
    url: '/process/instance',
    method: 'GET'
})

export const uploadCV = ({ id, file }: { id: string, file: File }) => {
    return uploadFile({
        url: '/process/file',
        file,
        params: { id }
    })
}