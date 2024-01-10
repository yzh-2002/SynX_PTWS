import { Button, Collapse, CollapseProps, Tag } from "antd";
import React, { ReactNode } from "react";

type ExtractContentType<T> = T extends (infer U)[] ? U : never

export interface CollapseCardPropType {
    content: ExtractContentType<CollapseProps['items']>,
    activeKey?: string | number | (string | number)[] | undefined,
    collapsible?: 'disabled' | 'icon',
    header: CollapseCardHeaderPropType
}

interface CollapseCardHeaderPropType {
    title: string,
    tag?: string | ReactNode,
    appendix?: string | ReactNode,
    action?: ReactNode
}
/**
 * label：header的title
 * key：如果卡片禁止折叠，则activeKey设置为对应key即可
 */
function CollapseCardHeader(props: CollapseCardHeaderPropType) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex flex-col">
                <div className="flex items-center">
                    <span className=" font-bold text-xl mr-1">{props.title}</span>
                    {props?.tag}
                </div>
                {props?.appendix}
            </div>
            {props?.action}
        </div>
    )
}

export default function CollapseCard(props: CollapseCardPropType) {
    const Header = (
        <CollapseCardHeader
            title={props.content.label as string}
            tag={props.header?.tag}
            appendix={props.header?.appendix}
            action={props.header?.action}
        />
    )

    return (
        <Collapse
            className=" w-4/5 m-auto mt-4"
            bordered
            collapsible={props?.collapsible || 'icon'}
            expandIconPosition="end"
            activeKey={props.content.key as string | undefined}
            items={[{ ...props.content, label: Header }]}
        />
    )
}