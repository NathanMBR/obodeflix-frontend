import {
    Button,
    Card,
    CardContent,
    CardActions,
    Divider,
    Typography
} from "@mui/material";
import { Link } from "react-router-dom";
import { CSSProperties } from "react";

export interface AdminPanelOptionProps {
    title: string;
    link: string;
}

export const AdminPanelOption = (props: AdminPanelOptionProps) => {
    const {
        title,
        link
    } = props;

    const cardActionsStyle: CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    };

    return (
        <>
            <Card>
                <CardContent>
                    <Typography
                        variant="h5"
                        component="h3"
                        textAlign="center"
                    >
                        {title}
                    </Typography>
                </CardContent>

                <Divider />

                <CardActions sx={cardActionsStyle}>
                    <Link to={link}>
                        <Button>Gerenciar</Button>
                    </Link>
                </CardActions>
            </Card>
        </>
    );
}