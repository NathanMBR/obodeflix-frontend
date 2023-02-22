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
    Typography
} from "@mui/material";
import { WarningAmber } from "@mui/icons-material";
import { CSSProperties } from "react";

import { Episode } from "../../types";

export interface AdminPanelDeleteEpisodeCardProps {
    episode: Episode | null;
    isOpen: boolean;
    handleClose: () => void;
    handleDelete: () => void;
};

export const AdminPanelDeleteEpisodeCard = (props: AdminPanelDeleteEpisodeCardProps) => {
    const {
        episode,
        isOpen,
        handleClose,
        handleDelete
    } = props;

    if (!episode)
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
                                        Você tem certeza de que deseja excluir o episódio abaixo?
                                        <br />
                                        Esta ação é irreversível.
                                    </Typography>

                                    <Typography
                                        variant="h5"
                                        component="h3"
                                    >
                                        {
                                            episode.name
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
                                        Excluir episódio
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