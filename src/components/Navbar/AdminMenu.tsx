import {
    Divider,
    MenuItem
} from "@mui/material";
import { Link } from "react-router-dom";

export interface AdminMenuProps {
    handleCloseMenu: () => void;
}

export const AdminMenu = (props: AdminMenuProps) => {
    const { handleCloseMenu } = props;

    return (
        <>
            <Divider variant="middle" />
            <Link to="/admin">
                <MenuItem onClick={handleCloseMenu}>Administração</MenuItem>
            </Link>
        </>

    )
}