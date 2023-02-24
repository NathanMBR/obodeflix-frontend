import { useState, useEffect } from "react"
import { Divider, Grid, Typography } from "@mui/material";

import {
    Pagination,
    Episode,
    OrderBy,
    EpisodeOrderColumn
} from "../types";
import { EpisodeCard } from "../components";
import { API_URL } from "../settings";

export const Main = () => {
    const [page, setPage] = useState(1);
    const [quantity, setQuantity] = useState(20);
    const [orderColumn, setOrderColumn] = useState<EpisodeOrderColumn>("id");
    const [orderBy, setOrderBy] = useState<OrderBy>("desc");

    const [paginatedEpisodes, setPaginatedEpisodes] = useState<Pagination<Episode> | null>(null);
    const [episodes, setEpisodes] = useState<Array<Episode>>([]);

    useEffect(
        () => {
            fetch(`${API_URL}/episode/all?page=${page}&quantity=${quantity}&orderColumn=${orderColumn}&orderBy=${orderBy}`)
                .then(response => response.json())
                .then(data => setPaginatedEpisodes(data))
                .catch(error => console.error(error))
        },
        []
    )

    useEffect(
        () => {
            paginatedEpisodes
                ? setEpisodes(paginatedEpisodes.data)
                : setEpisodes([])
        },
        [paginatedEpisodes]
    )

    return (
        <>
            <Typography variant="h4" component="h2">Episódios mais recentes</Typography>
            <Divider style={{ marginBottom: 16 }} />
            {
                episodes.length > 0
                    ? <>
                        <Typography variant="body1">Exibindo {episodes.length} resultados</Typography>
                        <Grid container spacing={2}>
                            {
                                episodes.map(
                                    episode => <EpisodeCard episode={episode} key={episode.id} />
                                )
                            }
                        </Grid>
                    </>

                    : <>
                        <Typography variant="body1">Não há episódios lançados.</Typography>
                    </>
            }
        </>
    )
}