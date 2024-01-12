import { Table, TableColumnsType } from "antd"
import { SearchStuInfoForm } from "../Components/Form/StuInfo"
import { useMemo } from "react"

export default function StuInfo({ id }: { id: string }) {
    const StuInfoColumns = useMemo<TableColumnsType<any>>(() => {
        return [
            { title: '姓名', dataIndex: 'name', key: 'name' },
            { title: '考号', dataIndex: 'code', key: 'code' },
            { title: '手机号', dataIndex: 'account', key: 'phone' },
            { title: '操作', key: 'action' }
        ]
    }, [])

    return (
        <div>
            <SearchStuInfoForm />
            <Table className="mt-2" columns={StuInfoColumns} />
        </div>
    )
}