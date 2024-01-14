import { api, downloadFile } from "../request";
import { SearchMSParams, MSType, SearchStuMSParams, StuMSType } from "@/objects/ms";

/**
 * getMSInfo:记录学生当前是否提交简历，选择了导师，参与到第几轮次等数据（更细致）
 * getStuMSInfo:记录学生是否完成双选
 */
export const getMSInfo = api<SearchMSParams, { total: number, twsInfo: MSType[] }>({
    url: '/twsInfo',
    method: 'GET'
})

export const getStuMSInfo = api<SearchStuMSParams, StuMSType[]>({
    url: '/twsInfo/student',
    method: 'GET'
})

export const exportMSInfo = ({ ...params }: SearchMSParams) => {
    return downloadFile({
        url: '/twsInfo/excel',
        method: 'GET',
        params
    })
}

export const exportStuMSInfo = ({ ...params }: SearchStuMSParams) => {
    return downloadFile({
        url: '/twsInfo/student/excel',
        method: 'GET',
        params
    })
}

// TODO:如何理解？
export const exportTeachMSInfo = ({ workId }: { workId: string }) => {
    return downloadFile({
        url: '/twsInfo/teacher/excel',
        method: 'GET', //默认即为GET
        params: {
            workId
        }
    })
}

