import { Plugin } from "vite";

export interface MockApiOptions {
    port: number
}

export function ViteMockApiPlugin(options: MockApiOptions): Plugin