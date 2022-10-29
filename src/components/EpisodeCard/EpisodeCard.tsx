import { getDurationTime } from "../../helpers";
import { Episode } from "../../types";
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Grid,
    Paper,
    Tooltip,
    Typography
} from "@mui/material";

export interface EpisodeCardProps {
    episode: Episode;
}

export const EpisodeCard = (props: EpisodeCardProps) => {
    const { episode } = props;

    return (
        <>
            <Grid item xs={12} alignItems="stretch" key={episode.id}>
                <Paper elevation={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5" component="h3">{episode.name}</Typography>
                            <Typography variant="body2">Duração: {getDurationTime(episode.duration)}</Typography>
                        </CardContent>
                        <Divider />
                        <CardActions>
                            <Button>Baixar episódio</Button>
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