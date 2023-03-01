import {
    Box,
    CardMedia,
    Divider,
    IconButton,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import {
    ImageNotSupported,
    Visibility
} from "@mui/icons-material";
import { CSSProperties } from "@mui/styled-engine";
import { Link } from "react-router-dom";

import {
    Season,
    SeasonTypesEnum
} from "../../types";

export interface SeasonInfoProps {
    season?: Season;
    sx?: CSSProperties;
};

export const SeasonInfo = (props: SeasonInfoProps) => {
    const {
        season,
        sx
    } = props;

    if (!season)
        return null;

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
    
    return (
        <Box sx={sx}>
            <Stack direction="column">
                <Box>
                    {
                        season.imageAddress
                            ? <>
                                <CardMedia
                                    component="img"
                                    src={season.imageAddress || ""}
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
                        <Stack
                            direction="row"
                            sx={{ marginBottom: 2 }}
                        >
                            <Typography
                                variant="h4"
                                component="h2"
                            >
                                {season.name}
                            </Typography>

                            <Tooltip title="Ver série relacionada">
                                <Link to={`/series/${season.seriesId}`}>
                                    <IconButton>
                                        <Visibility />
                                    </IconButton>
                                </Link>
                            </Tooltip>
                        </Stack>

                        <Divider style={{ marginBottom: 16 }} />

                        <Typography variant="body1">
                            <b>Tipo:</b> {SeasonTypesEnum[season.type]}
                        </Typography>
                        
                        <Typography variant="body1">
                            <b>Posição cronológica:</b> {season.position}
                        </Typography>
                    </Box>
                </Box>
            </Stack>
        </Box>
    );
};