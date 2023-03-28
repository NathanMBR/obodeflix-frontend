import {
    Box,
    CircularProgress,
    Divider,
    Grid,
    Typography
} from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import {
    useEffect,
    useState
} from "react";

import { MostRecentSeasonsCard } from "../../components";
import {
    PaginationBuilder,
    Season
} from "../../types";
import { API_URL } from "../../settings";

export interface MostRecentSeasonsProps {
    sx?: CSSProperties;
}

export const MostRecentSeasons = (props: MostRecentSeasonsProps) => {
    const {
        sx
    } = props;

    const [paginatedSeasons, setPaginatedSeasons] = useState<PaginationBuilder<Season> | null>(null);
    const [isRequestLoading, setIsRequestLoading] = useState(false);

    useEffect(
        () => {
            setIsRequestLoading(true);

            fetch(
                `${API_URL}/season/all?page=1&quantity=10&orderColumn=id&orderBy=desc`
            )
                .then(
                    async response => {
                        const data = await response.json();

                        if (!response.ok)
                            return console.error(data);

                        const paginatedSeasons = new PaginationBuilder<Season>(data);
                        setPaginatedSeasons(paginatedSeasons);
                    }
                )
                .catch(console.error)
                .finally(() => setIsRequestLoading(false))
        },

        []
    );

    const placeholderStyleMargin = 8;
    const placeholderStyle: CSSProperties = {
        textAlign: "center",
        marginTop: placeholderStyleMargin,
        marginBottom: placeholderStyleMargin
    };

    return (
        <Box sx={sx}>
            <Typography
                variant="h4"
                component="h2"
                sx={{ marginBottom: 2 }}
            >
                Séries/Temporadas mais recentes
            </Typography>

            <Divider sx={{ marginBottom: 2 }} />

            <Box>
                {
                    isRequestLoading
                    ? <Box sx={placeholderStyle}>
                        <CircularProgress/>
                    </Box>
                    : <>
                        {
                            paginatedSeasons
                                ? <Grid container
                                    spacing={2}
                                    sx={{ marginBottom: 8 }}
                                >
                                    {
                                        paginatedSeasons.data.map(
                                            season => <MostRecentSeasonsCard
                                                key={season.id}
                                                season={season}
                                                xs={2.4}
                                            />
                                        )
                                    }
                                </Grid>
                                : <Box sx={placeholderStyle}>
                                    <Typography variant="body1">
                                        Um erro inesperado ocorreu.
                                    </Typography>
                                </Box>
                                
                        }
                    </>
                }
            </Box>
        </Box>
    );
}