import { atom } from "recoil";
import { ServiceReturnType } from "@/objects/service";

export const serviceInfoState = atom<ServiceReturnType>({
    key: 'serviceInfo',
    default: { id: "", name: "", status: NaN, year: NaN }
})
