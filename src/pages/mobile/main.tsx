import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import router from '@/router/mobile'
import "@/styles/taildwind.css"
import PageLoading from '@/views/App/PageLoading'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RecoilRoot>
            {/*FIXME: 不加Suspence懒加载会报错... */}
            <Suspense fallback={<PageLoading />}>
                <RouterProvider router={router} />
            </Suspense>
        </RecoilRoot>
    </React.StrictMode>,
)
