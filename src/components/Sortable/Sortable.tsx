import { CSSProperties } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { ReactContent } from "../../types";

import "./Sortable.css"

export interface SortableProps {
    id: number | string;
    children: ReactContent;
    style?: CSSProperties;
};

export const Sortable = (props: SortableProps) => {
    const {
        id,
        children,
        style
    } = props;

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id });

    const sortableStyle = {
        transform: CSS.Transform.toString(transform),
        // transition
    };

    const finalStyle = {
        ...sortableStyle,
        ...style
    };

    return (
        <div
            className="sortable"
            style={finalStyle}
            ref={setNodeRef}
            {...attributes}
            {...listeners}
        >
            {
                children
            }
        </div>
    );
};
