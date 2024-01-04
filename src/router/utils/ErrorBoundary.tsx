import { Component, ComponentType, ErrorInfo } from 'react'

export class ErrorBoundary extends Component<{ fallback: ComponentType<{ error: any }> }> {
    state: { error: any }

    constructor(props: { fallback: ComponentType<{ error: any }> }) {
        super(props)
        this.state = { error: null }
    }

    static getDerivedStateFromError(e: any) {
        // 更新 state 使下一次渲染能够显示降级后的 UI
        // console.log('error', e)
        return { error: e }
    }

    componentDidCatch(e: Error, errorInfo: ErrorInfo) {
        // 你同样可以将错误日志上报给服务器
        // logErrorToMyService(e, errorInfo)
        console.error('error', e)
        console.log('errorInfo',errorInfo)
    }

    render() {
        if (this.state.error) {
            // 你可以自定义降级后的 UI 并渲染
            const C = this.props.fallback
            return <C error={this.state.error} />
        }
        // @ts-ignore
        return this.props.children
    }
}
