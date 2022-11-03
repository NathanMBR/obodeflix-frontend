import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Divider,
    Grid,
    Paper,
    Typography
} from "@mui/material";

import { Series } from "../../types";

export interface SeriesCardProps {
    series: Series;
}

export const SeriesCard = (props: SeriesCardProps) => {
    const {
        id,
        mainName,
        imageAddress
    } = props.series;

    return (
        <>
            <Grid item xs={2.4} style={{ display: "flex" }}>
                <Paper elevation={12} style={{ display: "flex" }}>
                    <Card>
                        <CardActionArea style={{ height: "100%" }} LinkComponent="a" href={`/series/${id}`}>
                            <CardMedia component="img" image={imageAddress || "/no-image"}>
                            </CardMedia>
                            <Divider />
                            <CardContent>
                                <Typography variant="subtitle2" component="h3" textAlign="center">{mainName}</Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Paper>
            </Grid>
        </>
    );
}