/**
 * stage:submit/verify-1|2|3 //轮次所处阶段（四个任务）
 * status:'notStart' | 'end' | 'onGoing' //轮次整体情况
 * isAtStage:boolean //stage:'submit' & isAtStage:false=> 表示此时位于submit和verify-1之间
 * cur:表示当前任务，1，2，3=>三个志愿
 * 
 * 0，1，2=>未开始，进行中，已结束
 */

export const getTaskStatus = (status: string, isAtStage: boolean, stage: string, cur: number) => {
    if (status === 'onGoing') {
        if (stage === 'submit') {
            return 0
        } else {
            // 当前处于verify-x阶段
            const StageNum = parseInt(stage?.match(/verify-(\d+)/)?.[1] || '')
            if (StageNum < cur) {
                return 0
            } else if (StageNum > cur || (StageNum === cur && !isAtStage)) {
                return 2
            } else {
                return 1
            }
        }
    } else if (status === 'notStart') {
        return 0
    } else if (status === 'end') {
        return 2
    }
}