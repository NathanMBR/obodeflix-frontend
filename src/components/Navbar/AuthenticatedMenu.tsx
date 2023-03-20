import {
    Button,
    Divider,
    Menu,
    MenuItem
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import {
    MouseEvent,
    useState
} from "react";
import { Link } from "react-router-dom";

import { AdminMenu } from "./AdminMenu";

export const AuthenticatedMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

    const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setIsMenuOpen(true);
        setAnchorElement(event.currentTarget);
    }

    const handleCloseMenu = () => {
        setIsMenuOpen(false);
        setAnchorElement(null);
    }

    const handleLogoutClick = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("type");
        localStorage.removeItem("id");
        window.location.reload();
    }

    return (
        <>
            <Button color="inherit" onClick={handleOpenMenu}>
                <AccountCircle />
            </Button>
            <Menu
                open={isMenuOpen}
                onClose={handleCloseMenu}
                anchorEl={anchorElement}
            >
                <Link to="/profile" style={{ width: "100%" }}>
                    <MenuItem onClick={handleCloseMenu}>Perfil</MenuItem>
                </Link>

                {
                    localStorage.getItem("type") === "ADMIN"
                        ? <AdminMenu handleCloseMenu={handleCloseMenu} />
                        : null
                }

                <Divider variant="middle" />
                <MenuItem onClick={handleLogoutClick}>Sair</MenuItem>
            </Menu>
        </>
    );
}