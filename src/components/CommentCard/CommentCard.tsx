import {
    Avatar,
    Box,
    Card,
    CardActions,
    CardContent,
    Divider,
    IconButton,
    Paper,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import {
    Edit,
    Delete,
    QuestionAnswer
} from "@mui/icons-material";
import { CSSProperties } from "@mui/styled-engine";
import { useState } from "react"; 

import { Reply } from "..";
import { Comment } from "../../types";
import { getFormattedDate } from "../../helpers";

export interface CommentCardProps {
    comment: Comment.Parent | Comment.Child;
    isChild?: boolean;
    handleDelete: () => void;
    sx?: CSSProperties;
}

export const CommentCard = (props: CommentCardProps) => {
    const {
        comment,
        isChild,
        handleDelete,
        sx
    } = props;

    const iconColor = "action.disabled";

    const [toggleReply, setToggleReply] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const formattedCreatedAt = getFormattedDate(comment.createdAt);
    const formattedUpdatedAt = getFormattedDate(comment.updatedAt);
    const showUpdatedAt = new Date(comment.createdAt).getTime() !== new Date(comment.updatedAt).getTime();

    const verticalDividerStyle: CSSProperties = {
        marginLeft: 2,
        marginRight: 2
    };

    const formattedDateStyle: CSSProperties = {
        display: "inline-block",
        marginBottom: 2,
        fontStyle: "italic"
    };

    const fullWidthStyle: CSSProperties = {
        width: "100%"
    };

    return (
        <Box sx={{
            ...sx,
            marginLeft: isChild ? 8 : "auto",
        }}>
            <Paper elevation={12}>
                <Card>
                    <CardContent>
                        <Stack direction="row">
                            <Stack direction="column">
                                <Box>
                                    <Stack
                                        direction="column"
                                        sx={{
                                            alignItems: "center",
                                        }}
                                    >
                                        <Avatar
                                            sx={{ backgroundColor: iconColor }}
                                        />

                                        <Typography variant="body2">
                                            {comment.user.name}
                                        </Typography>
                                    </Stack>
                                </Box>

                                <Box sx={{ minHeight: 32 }} />

                                <Stack direction="column">
                                    <IconButton
                                        onClick={
                                            () => {
                                                setIsEdit(false);
                                                setToggleReply(toggleReplyState => !toggleReplyState);
                                            }
                                        }
                                    >
                                        <Tooltip
                                            title={
                                                !toggleReply
                                                    ? "Responder comentário"
                                                    : "Cancelar resposta"
                                            }
                                        >
                                            <QuestionAnswer sx={{ color: iconColor}} />
                                        </Tooltip>
                                    </IconButton>

                                    {
                                        String(comment.userId) === localStorage.getItem("id")
                                            ? <>
                                                <IconButton
                                                    onClick={
                                                        () => {
                                                            setIsEdit(true);
                                                            setToggleReply(toggleReplyState => !toggleReplyState)
                                                        }
                                                    }
                                                >
                                                    <Tooltip title="Editar comentário">
                                                        <Edit sx={{ color: iconColor }} />
                                                    </Tooltip>
                                                </IconButton>

                                                <IconButton onClick={handleDelete}>
                                                    <Tooltip title="Excluir comentário">
                                                        <Delete sx={{ color: iconColor }} />
                                                    </Tooltip>
                                                </IconButton>
                                            </>
                                            : null
                                    }
                                </Stack>

                            </Stack>

                            <Divider
                                orientation="vertical"
                                sx={verticalDividerStyle}
                                flexItem
                            />

                            <Box>
                                <Typography
                                    variant="body2"
                                    sx={formattedDateStyle}
                                >
                                    {
                                        showUpdatedAt
                                            ? `Editado em ${formattedUpdatedAt}`
                                            : `Criado em ${formattedCreatedAt}`
                                    }
                                    
                                </Typography>

                                <Typography
                                    variant="body1"
                                    display="block"
                                >
                                    {comment.body}
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>

                    {
                        toggleReply
                            ? <>
                                <Divider />

                                <CardActions>
                                    <Reply
                                        sx={fullWidthStyle}
                                        comment={comment}
                                        reference={
                                            {
                                                key: "parentId",
                                                value: comment.parentId ?? comment.id
                                            }
                                        }
                                        isEdit={isEdit}
                                    />
                                </CardActions>
                            </>
                            : null
                    }
                </Card>
            </Paper>
        </Box>
    );
}