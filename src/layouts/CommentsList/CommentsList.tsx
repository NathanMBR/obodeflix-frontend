import {
    Box,
    Divider,
    Stack,
    Typography
} from "@mui/material";

import { Comment } from "../../types"
import { CommentCard } from "../../components";
import { CSSProperties } from "@mui/styled-engine";

export interface CommentsListProps {
    comments: Array<Comment.Parent>
}

export const CommentsList = (props: CommentsListProps) => {
    const { comments } = props;
    // const comments: Comment.Parent[] = []

    const noCommentsStyle: CSSProperties = {
        marginTop: 2
    };

    return (
        <>
            <Typography
                variant="h4"
                component="h2"
            >
                Comentários
            </Typography>

            <Divider />

            {
                comments.length > 0
                    ? comments.map(
                        (comment, commentIndex) => <Box key={comment.id}>
                            <CommentCard
                                comment={comment}
                                sx={{ marginTop: commentIndex > 0 ? 8 : 2 }}
                            />

                            {
                                comment.children.map(
                                    reply => <Box key={reply.id}>
                                        <CommentCard
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
        </>
    );
}