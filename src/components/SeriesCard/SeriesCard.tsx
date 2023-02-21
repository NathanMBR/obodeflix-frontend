import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Divider,
    Grid,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import { ImageNotSupported } from "@mui/icons-material";
import { CSSProperties } from "@mui/styled-engine";

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

    const imageStyle: CSSProperties = {
        width: "220px",
        height: "320px"
    };

    const noImageStyle: CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        width: "220px",
        height: "320px"
    };

    return (
        <>
            <Grid item
                xs={2.4}
                style={{ display: "flex" }}
            >
                <Paper
                    elevation={12}
                    style={{ display: "flex" }}
                >
                    <Card>
                        <CardActionArea
                            style={{ height: "100%" }}
                            LinkComponent="a"
                            href={`/series/${id}`}
                        >

                            {
                                imageAddress
                                    ? <CardMedia
                                        component="img"
                                        src={imageAddress || ""}
                                        sx={imageStyle}
                                    />
                                    : <>
                                        <Stack
                                            direction="column"
                                            sx={noImageStyle}
                                        >
                                            <ImageNotSupported />
                                            <Typography
                                                variant="subtitle2"
                                            >
                                                Imagem indisponível
                                            </Typography>
                                        </Stack>
                                    </>
                            }

                            <Divider />
                            <CardContent>
                                <Typography
                                    variant="subtitle2"
                                    component="h3"
                                    textAlign="center"
                                >
                                    {mainName}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Paper>
            </Grid>
        </>
    );
}