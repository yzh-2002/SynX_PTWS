import axios from "axios";
import qs from "qs";

import { ApiType } from "./interface";
import { API_ENTRY } from '../../../config/global'

const target = 'http://127.0.0.1:5173'
const fetch = axios.create({ timeout: 60 * 1000 })

export default function generateApi(apiConfig: ApiType) {
    const {
        path, method, header = {}, permission = [], config = {}
    } = apiConfig
    if (!!permission.length) {

    }
    return async (reqObj: any, queryObj: any) => {
        fetch.interceptors.request.use((c) => {
            // TODO
            return c
        })
        let baseUrl = `${target}${API_ENTRY}`
        let res =await fetch[method](`${baseUrl}${path}${qs.stringify(queryObj, {
            filter: (_, v) => {
                if (!!v || v === 0) {
                    return v
                }
            },
            addQueryPrefix: true
        })}`,
            {
                ...reqObj
            },
            {
                ...config,
                headers: { ...header }
            }
        )
        return res
    }
}