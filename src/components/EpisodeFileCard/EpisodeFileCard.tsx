import {
    Box,
    Card,
    CardContent,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import { DragHandle } from "@mui/icons-material";

export interface EpisodeFileCardProps {
    episodeTitle: string;
    sx?: CSSProperties;
};

export const EpisodeFileCard = (props: EpisodeFileCardProps) => {
    const {
        episodeTitle,
        sx
    } = props;

    return (
        <Box sx={sx}>
            <Paper elevation={12}>
                <Card>
                    <CardContent>
                        <Stack direction="row">
                            <DragHandle />

                            <Typography variant="body1">
                                { episodeTitle }
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Paper>
        </Box>
    );
};