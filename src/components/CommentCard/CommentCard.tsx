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
import { CSSProperties } from "@mui/styled-engine";
import { QuestionAnswer } from "@mui/icons-material";

import { Comment } from "../../types";

export interface CommentCardProps {
    comment: Comment.Parent | Comment.Child;
    isChild?: boolean;
    sx?: CSSProperties;
}

export const CommentCard = (props: CommentCardProps) => {
    const {
        comment,
        isChild,
        sx
    } = props;

    const verticalDividerStyle: CSSProperties = {
        marginLeft: 2,
        marginRight: 2
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
                            <Stack
                                direction="column"
                                sx={{
                                    alignContent: "center",
                                    justifyContent: "space-between"
                                }}
                            >
                                <Box>
                                    <Stack direction="column">
                                        <Avatar
                                            sx={{ backgroundColor: "action.disabled" }}
                                        />

                                        <Typography variant="body2">
                                            {comment.user.name}
                                        </Typography>
                                    </Stack>
                                </Box>

                                <Box sx={{ minHeight: 32 }} />

                                <Box>
                                    <IconButton>
                                        <Tooltip title="Responder comentário">
                                            <QuestionAnswer sx={{ color: "action.disabled"}} />
                                        </Tooltip>
                                    </IconButton>
                                </Box>

                            </Stack>

                            <Divider
                                orientation="vertical"
                                sx={verticalDividerStyle}
                                flexItem
                            />

                            <Typography variant="body1">
                                {comment.body}
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Paper>
        </Box>
    );
}