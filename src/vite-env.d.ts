/// <reference types="vite/client" />
// svgr 4.x使用问题：https://stackoverflow.com/questions/54121536/
/// <reference types="vite-plugin-svgr/client" />

// lark JSAPI
export declare global {
    interface Window {
        h5sdk: any
    }
    const tt: any
}