import { atom, selector } from "recoil";
import { ServiceReturnType } from "@/objects/service";
import { getWorkInfo } from "@/api/admin/service";

export const serviceInfo = atom<ServiceReturnType>({
    key: 'serviceInfo',
    default: { id: "", name: "", status: NaN, year: NaN }
})

export const serviceInfoAsync = selector<ServiceReturnType>({
    key: 'serviceInfoAsync',
    get: async ({ get }) => {
        const serviceInfoValue = get(serviceInfo)
        if (!!serviceInfoValue.id) {
            return serviceInfoValue
        }
        const serviceInfos = await getWorkInfo({ page: 1, size: 10 })
        return !!serviceInfos?.workInfo.length && serviceInfos?.workInfo[0]
            || { id: "", name: "", status: NaN, year: NaN }
    },
})