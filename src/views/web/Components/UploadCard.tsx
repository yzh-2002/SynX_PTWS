import { Upload, Spin } from "antd"
import { InboxOutlined } from '@ant-design/icons';

interface UploadCardPropType {
    // 支持上传的文件
    accept?: string;
    loading: boolean;
    upload: (file: File) => void
}

/**
 * antd的Upload组件默认上传行为：通过POST请求将文件上传指指定地址（action，无则为当前页面URL）
 * 实际使用希望上传行为自主可控，以及上传进度自主可控
 */
export default function UploadCard({ accept, upload, loading }: UploadCardPropType) {

    return (
        <Upload.Dragger
            showUploadList={false}
            multiple={false}
            maxCount={1}
            accept={accept}
            customRequest={({ file }) => {
                upload(file as File)
            }}
        >
            {
                loading ? <Spin /> :
                    <>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">点击或拖拽文件到此区域以上传文件</p>
                    </>
            }
        </Upload.Dragger>
    )
}