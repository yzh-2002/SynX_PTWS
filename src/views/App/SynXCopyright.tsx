import { useMemo } from "react"

function SynXCopyright() {
    const { start, current } = useMemo(() => {
        return {
            start: 2023,
            current: (new Date()).getFullYear(),
        }
    }, [])
    return (
        <div className="flex justify-center">
            <span style={{ whiteSpace: 'nowrap' }}>©{start}-{current}</span>
            <span style={{ padding: '2px' }} />
            <span style={{ whiteSpace: 'nowrap' }}>SynX Tech</span>
        </div>
    )
}

export default SynXCopyright