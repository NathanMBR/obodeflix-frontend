import { Fab } from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import { Add } from "@mui/icons-material";
import { Link } from "react-router-dom";

export interface AdminPanelAddContentFABProps {
    href: string;
}

export const AdminPanelAddContentFAB = (props: AdminPanelAddContentFABProps) => {
    const { href } = props;

    const fabStyle: CSSProperties = {
        position: "fixed",
        bottom: 16,
        right: 16
    };

    return (
        <>
            <Link to={href}>
                <Fab color="primary" sx={fabStyle}>
                    <Add />
                </Fab>
            </Link>
        </>
    );
};