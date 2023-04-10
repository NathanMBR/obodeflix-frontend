import {
    Box,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    Stack,
    Typography
} from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";
import {
    KeyboardArrowLeft,
    KeyboardArrowRight
} from "@mui/icons-material";
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
    const [page, setPage] = useState(1);

    useEffect(
        () => {
            setIsRequestLoading(true);

            fetch(
                `${API_URL}/season/recent?page=${page}&quantity=10`
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

        [
            page
        ]
    );

    const placeholderStyleMargin = 8;
    const placeholderStyle: CSSProperties = {
        textAlign: "center",
        marginTop: placeholderStyleMargin,
        marginBottom: placeholderStyleMargin
    };
    const changePageContainerStyle: CSSProperties = {
        flexGrow: 100,
        display: "flex",
        justifyContent: "right"
    };
    const iconButtonStyle: CSSProperties = {
        width: "50px",
        height: "50px"
    };

    return (
        <Box sx={sx}>
            <Stack direction="row" display="flex">
                <Box>
                    <Typography
                        variant="h4"
                        component="h2"
                        sx={{ marginBottom: 2 }}
                    >
                        Séries/Temporadas mais recentes
                    </Typography>
                </Box>

                <Box sx={changePageContainerStyle}>
                    <IconButton
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1}
                        sx={iconButtonStyle}
                    >
                        <KeyboardArrowLeft />
                    </IconButton>

                    <IconButton
                        onClick={() => setPage(page + 1)}
                        disabled={!!paginatedSeasons && paginatedSeasons.lastPage <= page}
                        sx={iconButtonStyle}
                    >
                        <KeyboardArrowRight />
                    </IconButton>
                </Box>
            </Stack>

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