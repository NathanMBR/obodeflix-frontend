import {
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Grid,
    Link,
    Paper,
    Tooltip,
    Typography
} from "@mui/material";

import { getDurationTime } from "../../helpers";
import { Episode } from "../../types";
import { API_URL } from "../../settings";

export interface EpisodeCardProps {
    episode: Episode;
}

export const EpisodeCard = (props: EpisodeCardProps) => {
    const { episode } = props;

    return (
        <>
            <Grid item xs={12} alignItems="stretch">
                <Paper elevation={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h3">{episode.name}</Typography>
                            <Typography variant="body2">Duração: {getDurationTime(episode.duration)}</Typography>
                        </CardContent>
                        <Divider />
                        <CardActions>
                            <Link href={`${API_URL}/episode/watch/${episode.id}`}>
                                <Button>Baixar episódio</Button>
                            </Link>
                            <Tooltip title="Indisponível">
                                <div>
                                    <Button disabled>Assistir episódio</Button>
                                </div>
                            </Tooltip>
                        </CardActions>
                    </Card>
                </Paper>
            </Grid>
        </>
    );
}