import {
    AppBar,
    Button,
    Stack,
    Toolbar,
    Typography
} from "@mui/material";
import { DarkMode } from "@mui/icons-material";
import { Link } from "react-router-dom";

export interface NavbarProps {
    handleThemeChange: () => void
};

export const Navbar = (props: NavbarProps) => {
    const { handleThemeChange } = props;

    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
                        <Link to="/">
                            OBODEFLIX
                        </Link>
                    </Typography>

                    <Stack direction="row" spacing={2}>
                        <Button color="inherit" onClick={handleThemeChange}>
                            <DarkMode />
                        </Button>
                        <Link to="/">
                            <Button color="inherit">Home</Button>
                        </Link>
                        <Link to="/series">
                            <Button color="inherit">Séries</Button>
                        </Link>
                        <Link to="/login">
                            <Button color="inherit">Fazer login</Button>
                        </Link>
                        <Link to="/signup">
                            <Button color="inherit" variant="outlined">Criar conta</Button>
                        </Link>
                    </Stack>
                </Toolbar>
            </AppBar>
        </>
    )
}