import {
    Box,
    CardMedia,
    Chip,
    CircularProgress,
    Divider,
    Stack,
    Typography
} from "@mui/material";
import { ImageNotSupported } from "@mui/icons-material";
import { CSSProperties } from "@mui/styled-engine";

import { SeasonCard } from "./SeasonCard";
import {
    Season,
    Series
} from "../../types";

export interface SeriesInfoProps {
    series?: Series;
    seasons?: Array<Season>;
    sx?: CSSProperties;
};

export const SeriesInfo = (props: SeriesInfoProps) => {
    const {
        series,
        seasons,
        sx
    } = props;

    if (!series)
        return null;

    const { seriesTags } = series;

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
        <Box sx={sx}>
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
                            seriesTags.length > 0
                                ? seriesTags.map(
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

                <Box>
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{ marginTop: 2 }}
                    >
                        Temporadas
                    </Typography>

                    <Divider />

                    {
                        !seasons
                            ? <CircularProgress />
                            : seasons.length > 0
                                ? seasons
                                    .sort(
                                        (seasonA, seasonB) => seasonA.position - seasonB.position
                                    )
                                    .map(
                                        (season, index) => <SeasonCard
                                            key={index}
                                            season={season}
                                        />
                                    )
                                : <Typography variant="body1">
                                    Não há temporadas disponíveis.
                                </Typography>
                    }
                </Box>
            </Stack>
        </Box>
    );
};