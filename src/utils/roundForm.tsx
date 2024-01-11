import dayjs, { Dayjs } from "dayjs"
import { TASK_CONFIG } from "@/constants/round"
import { FormInstance } from "antd";
import { RuleObject } from "antd/es/form";
import { RoundCreateType, RoundReturnType } from "@/objects/round";

// 轮次数据转换
// 前端轮次数据类型（表单）
export interface RoundFormType {
    name: string,
    fileMaxSize: string,
    duration: Array<Array<Dayjs>>
}

// 前端轮次Table数据类型
export interface RoundTableItemType {
    taskName: string;
    taskOrder: number;
    startTime: string;
    endTime: string;
    extension?: string;
}

export function convert_to_backend(v: RoundFormType): RoundCreateType {
    let result: RoundCreateType = {
        name: v.name,
        fileMaxSize: parseInt(v.fileMaxSize),
        duration: {} as RoundCreateType['duration']
    }
    v.duration.forEach((item, RoundIndex) => {
        item.forEach((time, index) => {
            // @ts-ignore
            result.duration[(index ? `end_${RoundIndex + 1}` : `start_${RoundIndex + 1}`)] = time.format('YYYY-MM-DD HH:mm:ss')
        })
    })
    return result
}

export function convert_to_form(v: RoundReturnType): RoundFormType {
    let result: RoundFormType = {
        name: v.name,
        //FIXME:此处应该统一处理一下...
        fileMaxSize: (v.fileMaxSize / 1024 / 1024).toString(),
        duration: []
    }
    const duration = JSON.parse(v.duration)
    for (let i = 1; i < 4; i++) {
        result.duration[i - 1] = [
            dayjs(duration[`start_${i}`]),
            dayjs(duration[`end_${i}`])
        ]
    }
    return result
}

export function convert_to_table(v: RoundReturnType): RoundTableItemType[] {
    const TableData: RoundTableItemType[] = []
    const duration = JSON.parse(v.duration)
    for (let i = 1; i <= TASK_CONFIG['TaskNum']; i++) {
        const TableItem: RoundTableItemType = {} as RoundTableItemType
        TableItem.taskName = TASK_CONFIG['TaskName'][i - 1]
        TableItem.taskOrder = i
        TableItem.startTime = duration[`start_${i}`]
        TableItem.endTime = duration[`end_${i}`]
        // 任务一有一额外简历字段
        if (i === 1) {
            TableItem.extension = `简历最大内存:${v.fileMaxSize / 1024 / 1024}MB`
        }
        TableData.push(TableItem)
    }
    return TableData
}

/**
 * 轮次中各任务的起止时间设置：
 * 1. 默认：下一任务的起始时间设置为上一任务的结束时间
 * 2. 同一任务，结束时间选择时，应当禁用起始及之前的时间（RangePicker默认行为）
 * 3. 下一任务，起始时间选择时，应当禁用上一任务结束及之前的时间
 */

// const range = (start: number, end: number) => {
//     const result = [];
//     for (let i = start; i < end; i++) {
//         result.push(i);
//     }
//     return result;
// };

export function disabledDate(preTask: Array<Dayjs> | undefined) {
    return (current: Dayjs) => {
        return current && preTask && preTask[1] && current < preTask[1]
    }
}

// 下一任务的起始时间应默认设置为上一任务的结束时间
export function autoSetNextTaskStartTime(preTask: Array<Dayjs> | undefined,
    form: FormInstance, taskOrder: number) {
    const curTask = form.getFieldValue(['duration', taskOrder])
    if (preTask && preTask[1] && !curTask) {
        // 当前任务为空时，可直接赋值
        form.setFieldValue(['duration', taskOrder], [preTask[1], null])
    } else if (curTask && curTask[1]) {
        // 当前任务不为空，且终止时间存在
        // 如果上一个任务的终止时间小于当前任务终止时间，则只需更新当前任务初始时间
        if (preTask && preTask[1].valueOf() <= curTask[1].valueOf()) {
            form.setFieldValue(['duration', taskOrder], [preTask[1], curTask[1]])
        } else if (preTask) {
            // 否则更新当前任务初始时间会破坏（终止>起始）的原则，需要将当前任务终止时间置空
            form.setFieldValue(['duration', taskOrder], [preTask[1], null])
        }
    }
}

// 表单中RangeTime校验规则
export function RangePickerValidator(_: RuleObject, v: any): Promise<any> {
    if (!v || !v[0] || !v[1]) {
        return Promise.reject("起止时间不能为空")
    }
    return Promise.resolve()
}

// 上一个任务的起止时间
// export function disabledTime(preTask: Array<Dayjs> | undefined) {
//     return (date: Dayjs) => {
//         // xx.day()=>返回周几
//         const day = preTask && preTask[1] && preTask[1].date()
//         const hour = preTask && preTask[1] && preTask[1].hour()
//         const minute = preTask && preTask[1] && preTask[1].minute()
//         if (date?.date() === day) {
//             if (date?.hour() === hour) {
//                 return {
//                     disabledHours: () => range(0, 24).splice(0, hour),
//                     disabledMinutes: () => range(0, 60).splice(0, minute)
//                 }
//             } else {
//                 return {
//                     disabledHours: () => range(0, 24).splice(0, hour)
//                 }
//             }
//         }
//     }
// }
