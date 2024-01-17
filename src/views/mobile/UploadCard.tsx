import { Uploader, Loading } from "react-vant";
import { Idcard } from '@react-vant/icons'

interface UploadCardPropType {
    loading: boolean
    accept?: string
    upload: (file: File) => void
}

export default function UploadCard({ loading, accept, upload }: UploadCardPropType) {
    return (
        <Uploader
            previewImage={false}
            multiple={false}
            maxCount={1}
            accept={accept}
            // react-vant未提供自定义上传函数
            beforeRead={(file) => {
                return new Promise((resolve, _) => {
                    upload(file)
                    resolve(false)
                })
            }}
        >
            <div className="flex flex-col items-center m-2 p-2"
                style={{
                    boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, \
                        rgba(60, 64, 67, 0.15) 0px 1px 3px 1px', height: '60px', width: '200px'
                }}>
                {
                    loading ? <Loading /> :
                        <>
                            <Idcard fontSize={40} />
                            <span className="ant-upload-text">点击此区域以上传文件</span>
                        </>
                }
            </div>
        </Uploader>
    )
}