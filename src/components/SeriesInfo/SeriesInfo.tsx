import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Chip,
    Divider,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import { ImageNotSupported } from "@mui/icons-material";
import { CSSProperties } from "@mui/styled-engine";

import { Series } from "../../types";

export interface SeriesInfoProps {
    series?: Series;
};

export const SeriesInfo = (props: SeriesInfoProps) => {
    const { series } = props;

    const imageStyle: CSSProperties = {
        border: "1px solid black",
        borderRadius: "5%",
        maxWidth: "200px",
        maxHeight: "280px",
        float: "left",
        marginRight: 2,
        marginBottom: 2
    };

    const noImageStyle: CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid black",
        borderRadius: "5%",
        width: "100vw",
        height: "100vh",
        maxWidth: "200px",
        maxHeight: "280px",
        float: "left",
        marginRight: 2
    };

    const tagStyle: CSSProperties = {
        marginRight: 1
    };

    return (
        series
            ? <>
                <Paper elevation={12}>
                    <Card>
                        <CardContent>
                            <Stack direction="column">
                                <Box>
                                    {
                                        series.imageAddress
                                            ? <>
                                                <CardMedia
                                                    component="img"
                                                    src={series.imageAddress || ""}
                                                    sx={imageStyle}
                                                />
                                            </>
                                            : <>
                                                <Stack
                                                    direction="column"
                                                    sx={noImageStyle}
                                                >
                                                    <ImageNotSupported
                                                        sx={{ fontSize: 32 }}
                                                    />
                                                    <Typography variant="subtitle2">
                                                        Imagem indisponível
                                                    </Typography>
                                                </Stack>
                                            </>
                                    }

                                    <Box>
                                        <Typography
                                            variant="h4"
                                            component="h2"
                                        >
                                            {series.mainName}
                                        </Typography>
                                        <Divider />

                                        <Typography variant="body1">
                                            <strong>Nome alternativo:</strong> {series.alternativeName || <i>(vazio)</i>}
                                        </Typography>

                                        <Typography
                                            variant="body1"
                                            sx={{ textAlign: "justify" }}
                                        >
                                            <strong>Descrição:</strong> {series.description || <i>(vazio)</i>}
                                        </Typography>

                                        <Typography variant="body1">
                                            <strong>
                                                Tags:
                                            </strong>
                                        </Typography>
                                        {
                                            series.seriesTags.length > 0
                                                ? series.seriesTags.map(
                                                    ({ tag }) => <Chip
                                                        key={tag.id}
                                                        label={tag.name}
                                                        variant="outlined"
                                                        sx={tagStyle}
                                                    />
                                                )
                                                : <i>(vazio)</i>
                                        }
                                    </Box>
                                </Box>

                                {/* <Box>
                                    <Typography
                                        variant="h4"
                                        component="h2"
                                        sx={{ marginTop: 2 }}
                                    >
                                        Temporadas
                                    </Typography>
                                    <Divider />
                                </Box> */}
                            </Stack>
                        </CardContent>
                    </Card>
                </Paper>
            </>
            : null

    );
};