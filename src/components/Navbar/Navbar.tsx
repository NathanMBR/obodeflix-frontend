import {
    AppBar,
    Button,
    Stack,
    Toolbar,
    Typography
} from "@mui/material";

export const Navbar = () => {
    return (
        <>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>OBODEFLIX</Typography>

                    <Stack direction="row" spacing={2}>
                        <Button color="inherit">Series</Button>
                        <Button color="inherit">Login</Button>
                        <Button color="inherit" variant="outlined">Sign up</Button>
                    </Stack>
                </Toolbar>
            </AppBar>
        </>
    )
}