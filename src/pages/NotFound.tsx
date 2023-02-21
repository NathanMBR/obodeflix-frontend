import {
    Button,
    Stack,
    Typography
} from "@mui/material";
import { WarningAmber } from "@mui/icons-material";
import { CSSProperties } from "react";
import { Link } from "react-router-dom";

export const NotFound = () => {
    const stackStyle: CSSProperties = {
        paddingTop: "25vh",
        display: "flex",
        alignItems: "center"
    };

    return (
        <>
            <Stack direction="column" sx={stackStyle}>
                <WarningAmber color="error" sx={{ fontSize: 96 }} />
                <Typography variant="h4" component="h2">Página não encontrada</Typography>
                <Link to="/">
                    <Button>Voltar para o início</Button>
                </Link>
            </Stack>
        </>
    )
}