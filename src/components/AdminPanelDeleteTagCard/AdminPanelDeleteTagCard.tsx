import {
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Divider,
    Modal,
    Paper,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import { WarningAmber } from "@mui/icons-material";
import { CSSProperties } from "react";

import { Tag } from "../../types";

export interface AdminPanelDeleteTagCardProps {
    tag: Tag | null;
    handleDelete: () => void;

    isOpen: boolean;
    handleClose: () => void;
};

export const AdminPanelDeleteTagCard = (props: AdminPanelDeleteTagCardProps) => {
    const {
        tag,
        handleDelete,
        isOpen,
        handleClose
    } = props;

    if (!tag)
        return null;

    const containerStyle: CSSProperties = {
        paddingTop: "50vh"
    };

    const paperStyle: CSSProperties = {
        textAlign: "center",
        transform: "translateY(-50%)"
    };

    const cardActionsStyle: CSSProperties = {
        display: "block",
        width: "auto"
    };

    const cardActionsStackStyle: CSSProperties = {
        display: "flex",
        justifyContent: "space-evenly"
    };

    return (
        <>
            <Modal
                open={isOpen}
                onClose={handleClose}
            >
                <Container
                    maxWidth="sm"
                    sx={containerStyle}
                >
                    <Paper
                        elevation={12}
                        sx={paperStyle}
                    >
                        <Card>
                            <CardContent>
                                <Stack
                                    direction="column"
                                    sx={{ alignItems: "center" }}
                                >
                                    <WarningAmber
                                        color="error"
                                        sx={{ fontSize: 64 }}
                                    />
                                    <Typography
                                        variant="h4"
                                        component="h2"
                                    >
                                        Aviso
                                    </Typography>
                                    <Typography variant="body1">
                                        Você tem certeza de que deseja excluir a tag abaixo?
                                        <br />
                                        Esta ação é irreversível.
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        component="h3"
                                    >
                                        {
                                            tag.name
                                        }
                                    </Typography>
                                </Stack>
                            </CardContent>

                            <Divider />

                            <CardActions sx={cardActionsStyle}>
                                <Stack
                                    direction="row"
                                    sx={cardActionsStackStyle}
                                >
                                    <Button
                                        variant="outlined"
                                        onClick={handleClose}
                                    >
                                        Cancelar
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleDelete}
                                    >
                                        Excluir tag
                                    </Button>
                                </Stack>
                            </CardActions>
                        </Card>
                    </Paper>
                </Container>
            </Modal>
        </>
    );
};