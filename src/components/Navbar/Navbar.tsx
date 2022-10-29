import {
    AppBar,
    Button,
    Stack,
    Toolbar,
    Typography
} from "@mui/material";
import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/">
                            OBODEFLIX
                        </Link>
                    </Typography>

                    <Stack direction="row" spacing={2}>
                        <Link to="/">
                            <Button color="inherit">Home</Button>
                        </Link>
                        <Link to="/series">
                            <Button color="inherit">Series</Button>
                        </Link>
                        <Link to="/login">
                            <Button color="inherit">Login</Button>
                        </Link>
                        <Link to="/signup">
                            <Button color="inherit" variant="outlined">Sign up</Button>
                        </Link>
                    </Stack>
                </Toolbar>
            </AppBar>
        </>
    )
}