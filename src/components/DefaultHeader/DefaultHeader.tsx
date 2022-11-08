import {
    Divider,
    Typography
} from "@mui/material";
import { CSSProperties } from "react";

export interface DefaultHeaderProps {
    children: string;
    style?: CSSProperties;
}

export const DefaultHeader = (props: DefaultHeaderProps) => {
    const {
        children,
        style
    } = props;

    return (
        <div style={{
            marginBottom: 16,
            ...style
        }}>
            <Typography variant="h4" component="h2">{children}</Typography>
            <Divider />
        </div>
    );
}