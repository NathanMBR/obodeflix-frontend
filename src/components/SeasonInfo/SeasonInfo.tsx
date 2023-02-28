import {
    Box,
    Divider,
    IconButton,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
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
    
    return (
        <Box sx={sx}>
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
    );
};