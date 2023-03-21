import {
    Box,
    Divider,
    Typography
} from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import { useState } from "react";

import {
    CommentCard,
    DeleteCommentCard,
    ErrorCard,
    ErrorCardStatusCodeProp,
    Reply,
    ReplyProps,
    SuccessCard
} from "../../components";
import { Comment } from "../../types"
import { API_URL } from "../../settings";

export interface CommentsListProps {
    comments: Array<Comment.Parent>;
    replyReference: ReplyProps["reference"];
    sx?: CSSProperties;
}

export const CommentsList = (props: CommentsListProps) => {
    const {
        comments,
        replyReference,
        sx
    } = props;

    const [commentToDelete, setCommentToDelete] = useState<Comment.Parent | Comment.Child | null>(null);
    const [wasDeleteSuccessful, setWasDeleteSuccessful] = useState(false);

    const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null);
    const [reasons, setReasons] = useState<string | Array<string> | undefined>(undefined);

    const noCommentsStyle: CSSProperties = {
        marginTop: 2
    };

    const handleDeleteComment = () => {
        if (!commentToDelete)
            throw new Error("No comment to delete");

        fetch(
            `${API_URL}/comment/inactivate/${commentToDelete.id}`,

            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
            .then(
                async response => {
                    if (!response.ok) {
                        const data = await response.json();
                        setStatusCode(response.status as ErrorCardStatusCodeProp);

                        if (data.reason)
                            setReasons(data.reason);

                        return;
                    }

                    setCommentToDelete(null);
                    setWasDeleteSuccessful(true);
                    return;
                }
            )
            .catch(console.error);
    };

    return (
        <Box sx={sx}>
            <Typography
                variant="h4"
                component="h2"
            >
                Comentários
            </Typography>

            <Divider />

            <Reply
                sx={{ marginTop: 2 }}
                reference={replyReference}
            />

            {
                comments.length > 0
                    ? comments.map(
                        (comment, commentIndex) => <Box key={comment.id}>
                            <CommentCard
                                comment={comment}
                                handleDelete={() => setCommentToDelete(comment)}
                                sx={{ marginTop: commentIndex > 0 ? 8 : 2 }}
                            />

                            {
                                comment.children.map(
                                    reply => <Box key={reply.id}>
                                        <CommentCard
                                            handleDelete={() => setCommentToDelete(reply)}
                                            comment={reply}
                                            sx={{ marginTop: 2 }}
                                            isChild
                                        />
                                    </Box>
                                )
                            }
                        </Box>
                    )
                    : <Box sx={noCommentsStyle}>
                        <Typography
                            variant="body1"
                        >
                            Não há comentários a serem exibidos.
                        </Typography>
                    </Box>
            }

            <DeleteCommentCard
                comment={commentToDelete}
                handleClose={() => setCommentToDelete(null)}
                handleDelete={handleDeleteComment}
            />

            <SuccessCard
                isOpen={wasDeleteSuccessful}
                handleClose={
                    () => {
                        setWasDeleteSuccessful(false);
                        window.location.reload();
                    }
                }
                message="Comentário excluído com sucesso!"
            />

            <ErrorCard
                statusCode={statusCode}
                isOpen={!!statusCode}
                handleClose={
                    () => {
                        setStatusCode(null);
                        window.location.reload();
                    }
                }
                reasons={reasons}
            />
        </Box>
    );
}