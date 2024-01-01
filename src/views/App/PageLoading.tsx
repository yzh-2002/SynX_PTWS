import { Spin } from 'antd'

export default function PageLoading() {
    return (
        <div style={{ margin: '64px auto', textAlign: 'center' }}>
            <Spin size={'large'} />
        </div>
    )
}
