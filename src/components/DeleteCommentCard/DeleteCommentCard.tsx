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

import { Comment } from "../../types";

interface DeleteCommentCardProps {
    comment: Comment.Parent | Comment.Child | null;
    handleClose: () => void;
    handleDelete: () => void;
};

export const DeleteCommentCard = (props: DeleteCommentCardProps) => {
    const {
        comment,
        handleClose,
        handleDelete
    } = props;

    if (!comment)
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
        <Modal
            open={!!comment}
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
                                    Você tem certeza de que deseja excluir o comentário abaixo?
                                    <br />
                                    Esta ação é irreversível.
                                </Typography>

                                <Typography
                                    variant="h5"
                                    component="h3"
                                >
                                    {
                                        comment.body
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
                                    Excluir comentário
                                </Button>
                            </Stack>
                        </CardActions>
                    </Card>
                </Paper>
            </Container>
        </Modal>
    );
};