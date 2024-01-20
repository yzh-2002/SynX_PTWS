import { ajax, api, uploadFile } from "../request";
import { StuTaskReturnType, StuChooseTeachType, SearchChooseTeachListParams } from "@/objects/task";

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


// 获取学生任务中可选择的教师列表
export const getChooseTeachList = api<
    SearchChooseTeachListParams,
    { total: number, userMaps: StuChooseTeachType[] }>
    ({
        url: '/process/instance-tutor',
        method: 'GET'
    })

// 学生申请导师，相当于保存了三个志愿，提交任务接口才是完成最终任务的接口
export const applyTutor = api<{ id: string, tutorId1: string, tutorId2: string, tutorId3: string }>(
    async ({ id, tutorId1, tutorId2, tutorId3 }) => {
        await ajax({
            url: '/process/apply',
            method: 'POST',
            params: { id },
            data: { tutorId1, tutorId2, tutorId3 }
        })
    }
)

// 提交任务，之后学生不可再修改信息
export const submitTask = api<{ id: string }>({
    url: '/process/submit',
    method: 'GET'
})