import { Button } from "antd"
import { test } from "./api/login"
import { useApi } from "./api/request"
import { useRequest } from "ahooks"

import { useNavigate } from "react-router-dom"


import UserCard from "./views/mobile/UserCard"
import { Plus } from "@react-vant/icons"

//TODO：DEMO
function App() {
  const { run: testRun, loading: testLoading } = useRequest(useApi(test), { manual: true })

  const navigator = useNavigate()
  return (
    <>
      <UserCard />
      <div className="flex flex-col">
        <span>工作台</span>
        <div className="flex">
          <Plus onClick={() => {
            // 跳转至新建轮次页面
            navigator("/app/create-service")
          }} />
        </div>
      </div>
      <Button loading={testLoading} onClick={() => {
        testRun()
      }}>测试</Button>
    </>
  )
}

export default App
