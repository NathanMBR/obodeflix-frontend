import {
    Box,
    Fab,
    Link
} from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import { KeyboardArrowUp } from "@mui/icons-material";

export interface GoToTopFABProps {
    href: string;
    sx?: CSSProperties;
};

export const GoToTopFAB = (props: GoToTopFABProps) => {
    const {
        href,
        sx
    } = props;

    const fabStyle: CSSProperties = {
        position: "fixed",
        bottom: 16,
        right: 16
    };

    return (
        <Box sx={sx}>
            <Link href={href}>
                <Fab
                    color="primary"
                    sx={fabStyle}
                >
                    <KeyboardArrowUp />
                </Fab>
            </Link>
        </Box>
    );
};