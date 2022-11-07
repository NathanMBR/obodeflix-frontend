import {
    Divider,
    Typography
} from "@mui/material";

export interface DefaultHeaderProps {
    children: string;
}

export const DefaultHeader = (props: DefaultHeaderProps) => {
    const { children } = props;

    return (
        <>
            <Typography variant="h4" component="h2">{children}</Typography>
            <Divider />
        </>
    );
}