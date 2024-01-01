import { Button } from "antd"
import { test } from "./api/login"
import { useApi } from "./api/request"
import { useRequest } from "ahooks"


function App() {
  const { run: testRun, loading: testLoading } = useRequest(useApi(test), { manual: true })

  return (
    <>
      <div>Hello World</div>
      <Button loading={testLoading} onClick={() => {
        testRun()
      }}>测试</Button>
    </>
  )
}

export default App
