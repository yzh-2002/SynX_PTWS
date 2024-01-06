import { atom, useRecoilState, useRecoilValue } from "recoil"
import { ComponentType, useEffect } from "react"

/**
 * xs(Extra Small)：<600px，手机
 * sm(Small)：600px-960px，平板
 * md(medium)：960px-1280px，平板电脑
 * lg(Large)：1280px-1920px，大型显示器
 * xl(Extra Large)：>1920px，超大型显示器
 */
export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface IBreakpoint {
    height: number
    lg: boolean
    lgAndDown: boolean
    lgAndUp: boolean
    lgOnly: boolean
    md: boolean
    mdAndDown: boolean
    mdAndUp: boolean
    mdOnly: boolean
    name: BreakpointName
    sm: boolean
    smAndDown: boolean
    smAndUp: boolean
    smOnly: boolean
    width: number
    xl: boolean
    xlOnly: boolean
    xs: boolean
    xsOnly: boolean
    mobile: boolean
    // 区分移动端/pc端的breakpoint
    mobileBreakpoint: number | BreakpointName
    // 各breakpoint的阈值
    thresholds: BreakpointThresholds
    // 页面纵向滚动条宽度，实际页面宽度=窗口宽度-滚动条宽度
    scrollBarWidth: number
}

export interface BreakpointThresholds {
    xs: number
    sm: number
    md: number
    lg: number
}

export interface BreakpointOptions {
    mobileBreakpoint?: number | BreakpointName
    scrollBarWidth?: number
    thresholds?: Partial<BreakpointThresholds>
}

export class Breakpoint implements IBreakpoint {
    static defaultThreshold = {
        xs: 600,
        sm: 960,
        md: 1280,
        lg: 1920,
    }
    public static property: 'breakpoint' = 'breakpoint'
    // Public
    public xs = false
    public sm = false
    public md = false
    public lg = false
    public xl = false
    public xsOnly = false
    public smOnly = false
    public smAndDown = false
    public smAndUp = false
    public mdOnly = false
    public mdAndDown = false
    public mdAndUp = false
    public lgOnly = false
    public lgAndDown = false
    public lgAndUp = false
    public xlOnly = false

    public name: IBreakpoint['name'] = 'xs'
    public height = 0
    public width = 0
    public mobile = true
    public mobileBreakpoint: IBreakpoint['mobileBreakpoint']
    public thresholds: IBreakpoint['thresholds']
    public scrollBarWidth: IBreakpoint['scrollBarWidth']
    private resizeTimeout = 0
    private updateHandlers: ((state: IBreakpoint) => void)[] = []

    // 初始化配置项
    constructor(preset: BreakpointOptions) {
        const {
            mobileBreakpoint = 1280,
            scrollBarWidth = 16,
            thresholds = {
                xs: 600,
                sm: 960,
                md: 1280,
                lg: 1920,
            },
        } = preset
        this.mobileBreakpoint = mobileBreakpoint
        this.scrollBarWidth = scrollBarWidth
        this.thresholds = { ...thresholds, ...Breakpoint.defaultThreshold }
    }

    // 绑定事件
    public init() {
        this.update()
        if (typeof window === 'undefined') return
        window.addEventListener(
            'resize',
            this.onResize.bind(this),
            // 设置为被动，则告知浏览器在resize事件后没有默认行为，无需等待，进而优化性能
            { passive: true },
        )
    }

    public update(ssr = false) {
        // SSR时html中代码会在服务端执行，没有DOM API，故需要对一些DOM中全局变量进行判空操作...
        const height = ssr ? 0 : this.getClientHeight()
        const width = ssr ? 0 : this.getClientWidth()

        const xs = width < this.thresholds.xs
        const sm = width < this.thresholds.sm && !xs
        const md = width < (this.thresholds.md - this.scrollBarWidth) && !(sm || xs)
        const lg = width < (this.thresholds.lg - this.scrollBarWidth) && !(md || sm || xs)
        const xl = width >= (this.thresholds.lg - this.scrollBarWidth)

        this.height = height
        this.width = width

        this.xs = xs
        this.sm = sm
        this.md = md
        this.lg = lg
        this.xl = xl

        this.xsOnly = xs
        this.smOnly = sm
        this.smAndDown = (xs || sm) && !(md || lg || xl)
        this.smAndUp = !xs && (sm || md || lg || xl)
        this.mdOnly = md
        this.mdAndDown = (xs || sm || md) && !(lg || xl)
        this.mdAndUp = !(xs || sm) && (md || lg || xl)
        this.lgOnly = lg
        this.lgAndDown = (xs || sm || md || lg) && !xl
        this.lgAndUp = !(xs || sm || md) && (lg || xl)
        this.xlOnly = xl

        switch (true) {
            case (xs):
                this.name = 'xs'
                break
            case (sm):
                this.name = 'sm'
                break
            case (md):
                this.name = 'md'
                break
            case (lg):
                this.name = 'lg'
                break
            default:
                this.name = 'xl'
                break
        }

        if (typeof this.mobileBreakpoint === 'number') {
            this.mobile = width < this.mobileBreakpoint
        } else {
            const breakpoints = {
                xs: 0,
                sm: 1,
                md: 2,
                lg: 3,
                xl: 4,
            } as const

            const current = breakpoints[this.name]
            const max = breakpoints[this.mobileBreakpoint]

            this.mobile = current <= max
        }

        const state = this.getState()
        // 回调，用于更新外部状态，详见withBreakpoint
        this.updateHandlers.forEach(handler => {
            handler(state)
        })
    }

    // 防抖，防止频繁触发
    private onResize() {
        clearTimeout(this.resizeTimeout)

        // Added debounce to match what
        // v-resize used to do but was
        // removed due to a memory leak
        // https://github.com/vuetifyjs/vuetify/pull/2997
        this.resizeTimeout = window.setTimeout(this.update.bind(this), 200)
    }

    // Cross-browser support as described in:
    // https://stackoverflow.com/questions/1248081
    private getClientWidth() {
        /* istanbul ignore if */
        if (typeof document === 'undefined') return 0 // SSR
        return Math.max(
            document.documentElement!.clientWidth,
            window.innerWidth || 0,
        )
    }

    private getClientHeight() {
        /* istanbul ignore if */
        if (typeof document === 'undefined') return 0 // SSR
        return Math.max(
            document.documentElement!.clientHeight,
            window.innerHeight || 0,
        )
    }

    public onUpdate(fn: (state: IBreakpoint) => void) {
        this.updateHandlers.push(fn)
    }

    public offUpdate(handler: (state: IBreakpoint) => void) {
        const i = this.updateHandlers.findIndex(fn => fn === handler)
        if (i !== -1) {
            this.updateHandlers.splice(i, 1)
        }
    }

    public getState(): IBreakpoint {
        const {
            height, lg, lgAndDown, lgAndUp, lgOnly,
            md, mdAndDown, mdAndUp, mdOnly, name,
            sm, smAndDown, smAndUp, smOnly, width,
            xl, xlOnly, xs, xsOnly, mobile,
            mobileBreakpoint, thresholds, scrollBarWidth,
        } = this
        return {
            height, lg, lgAndDown, lgAndUp, lgOnly,
            md, mdAndDown, mdAndUp, mdOnly, name,
            sm, smAndDown, smAndUp, smOnly, width,
            xl, xlOnly, xs, xsOnly, mobile,
            mobileBreakpoint, thresholds, scrollBarWidth,
        }
    }
}

const breakpoint = new Breakpoint({})
breakpoint.init()

const breakpointState = atom({
    key: "breakpoint",
    default: breakpoint.getState()
})

export function useBreakpoint() {
    return useRecoilValue(breakpointState)
}

// 使组件在挂载时能监听屏幕缩放更新断点
export function withBreakpoint(Component: ComponentType<any>) {
    return (props: any) => {
        const [, setState] = useRecoilState(breakpointState)
        useEffect(() => {
            const handler = (b: IBreakpoint) => {
                setState(b)
            }
            breakpoint.onUpdate(handler)
            return () => {
                breakpoint.offUpdate(handler)
            }
        }, [])
        return (<Component {...props} />)
    }
}