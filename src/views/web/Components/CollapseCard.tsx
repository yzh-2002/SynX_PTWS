import { Button, Collapse, CollapseProps, Tag } from "antd";
import { ReactNode } from "react";

type ExtractContentType<T> = T extends (infer U)[] ? U : never

interface CollapseCardPropType {
    content: ExtractContentType<CollapseProps['items']>,
    activeKey?: string | number | (string | number)[] | undefined,
    collapsible?: boolean,
    expandIconPosition?: 'start' | 'end'

}

interface CollapseCardHeaderPropType {
    title: string,
    tag?: string | ReactNode,
    appendix?: string | ReactNode,
    action?: ReactNode
}

function CollapseCardHeader(props: CollapseCardHeaderPropType) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex flex-col">
                <div className="flex items-center">
                    <span className=" font-bold text-xl mr-1">{props.title}</span>
                    {props?.tag && <Tag>{props.tag}</Tag>}
                </div>
                {props?.appendix}
            </div>
            {props?.action}
        </div>
    )
}

export default function CollapseCard() {
    const props: CollapseCardPropType = {
        content: {
            key: 'default',
            label: "This is panel header 3",
            children: <p>TEST</p>,
            // showArrow: false
        },
    }
    const Header = (
        <CollapseCardHeader
            title={props.content.label as string}
            tag={'TEST'}
            appendix={"112e32dsdsadsad"}
            action={
                <Button type="primary">发布</Button>
            }
        />
    )

    return (
        <Collapse
            className=" w-4/5 m-auto mt-4"
            bordered
            collapsible="icon"
            expandIconPosition="end"
            // activeKey={props.content.key as string}
            items={[{ ...props.content, label: Header }]}
        />
    )
}