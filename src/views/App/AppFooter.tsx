import { useMemo } from "react"

export default function AppFooter() {
    const current = useMemo(() => {
        const current = (new Date()).getFullYear()
        return current
    }, [])
    return (
        <div className="flex justify-center items-center bg-slate-50 h-14">
            <span style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                ©{current} 电子科技大学 信息与软件工程学院
            </span>
        </div>
    )
}