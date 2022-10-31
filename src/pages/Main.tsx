import { useState, useEffect } from "react"
import { Divider, Grid, Typography } from "@mui/material";

import {
    Pagination,
    Episode,
    OrderBy,
    EpisodeOrderColumn
} from "../types";
import { EpisodeCard } from "../components";

export const Main = () => {
    const [page, setPage] = useState(1);
    const [quantity, setQuantity] = useState(20);
    const [orderColumn, setOrderColumn] = useState<EpisodeOrderColumn>("id");
    const [orderBy, setOrderBy] = useState<OrderBy>("desc");

    const [paginatedEpisodes, setPaginatedEpisodes] = useState<Pagination<Episode> | null>(null);
    const [episodes, setEpisodes] = useState<Array<Episode>>([]);

    useEffect(
        () => {
            // fetch(`${VITE_APP_API_URL}/episode/all?page=${page}&quantity=${quantity}&orderColumn=${orderColumn}&orderBy=${orderBy}`)
            //     .then(response => response.json())
            //     .then(data => setPaginatedEpisodes(data))
            //     .catch(error => console.error(error))

            setPaginatedEpisodes(
                {
                    quantityPerPage: 3,
                    totalQuantity: 25,
                    currentPage: 1,
                    lastPage: 1,
                    data: [
                        {
                            id: 1,
                            name: "Episódio 1 - Momento Decisivo",
                            seasonId: 1,
                            duration: 1437,
                            path: "/Steins;Gate/[Dollars_Fansub]_Steins;Gate_01_[H264][AAC][BD-720p][Hi10P][BEABE7E9].mkv",
                            position: 1,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null
                        },

                        {
                            id: 2,
                            name: "Episódio 2 - Paranóia da Viagem no Tempo",
                            seasonId: 1,
                            duration: 1444,
                            path: "/Steins;Gate/[Dollars_Fansub]_Steins;Gate_02_[H264][AAC][BD-720p][Hi10P][2F3369EB].mkv",
                            position: 2,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null
                        },

                        {
                            id: 3,
                            name: "Episódio 3 - Paranóia do Mundo Paralelo",
                            seasonId: 1,
                            duration: 1437,
                            path: "/Steins;Gate/[Dollars_Fansub]_Steins;Gate_03_[H264][AAC][BD-720p][Hi10P][95027C66].mkv",
                            position: 3,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null
                        },

                        {
                            id: 4,
                            name: "Episódio 4 - Encontro de Intérpretes",
                            seasonId: 1,
                            duration: 1445,
                            path: "/Steins;Gate/[Dollars_Fansub]_Steins;Gate_04_[H264][AAC][BD-720p][Hi10P][E00DEF89].mkv",
                            position: 4,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null
                        },

                        {
                            id: 5,
                            name: "Episódio 5 - Colisão de Cargas Elétricas",
                            seasonId: 1,
                            duration: 1437,
                            path: "/Steins;Gate/[Dollars_Fansub]_Steins;Gate_05_[H264][AAC][BD-720p][Hi10P][E9BFF95E].mkv",
                            position: 5,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null
                        },

                        {
                            id: 6,
                            name: "Episódio 6 - Divergência sobre o Efeito Borboleta",
                            seasonId: 1,
                            duration: 1436,
                            path: "/Steins;Gate/[Dollars_Fansub]_Steins;Gate_06_[H264][AAC][BD-720p][Hi10P][DE4A6988].mkv",
                            position: 6,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null
                        },

                        {
                            id: 7,
                            name: "Episódio 7 - Divergência da Singularidade",
                            seasonId: 1,
                            duration: 1445,
                            path: "/Steins;Gate/[Dollars_Fansub]_Steins;Gate_07_[H264][AAC][BD-720p][Hi10P][2B8B0C78].mkv",
                            position: 7,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null
                        },

                        {
                            id: 8,
                            name: "Episódio 8 - Teoria do Caos Homeostática I",
                            seasonId: 1,
                            duration: 1437,
                            path: "/Steins;Gate/[Dollars_Fansub]_Steins;Gate_08_[H264][AAC][BD-720p][Hi10P][A4AD7EE5].mkv",
                            position: 8,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null
                        },

                        {
                            id: 9,
                            name: "Episódio 9 - Teoria do Caos Homeostática II",
                            seasonId: 1,
                            duration: 1436,
                            path: "/Steins;Gate/[Dollars_Fansub]_Steins;Gate_09_[H264][AAC][BD-720p][Hi10P][CC204F84].mkv",
                            position: 9,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null
                        },

                        {
                            id: 10,
                            name: "Episódio 10 - Teoria do Caos Homeostática III",
                            seasonId: 1,
                            duration: 1445,
                            path: "/Steins;Gate/[Dollars_Fansub]_Steins;Gate_10_[H264][AAC][BD-720p][Hi10P][70F695A4].mkv",
                            position: 10,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null
                        },

                        {
                            id: 11,
                            name: "Episódio 11 - Dogma no Horizonte de Eventos",
                            seasonId: 1,
                            duration: 1437,
                            path: "/Steins;Gate/[Dollars_Fansub]_Steins;Gate_11_[H264][AAC][BD-720p][Hi10P][FEC7403B].mkv",
                            position: 11,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null
                        },

                        {
                            id: 12,
                            name: "Episódio 12 - Dogma na Ergosfera",
                            seasonId: 1,
                            duration: 1436,
                            path: "/Steins;Gate/[Dollars_Fansub]_Steins;Gate_12_[H264][AAC][BD-720p][Hi10P][7BF325AE].mkv",
                            position: 12,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null
                        }
                    ]
                }
            )
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
            <Typography variant="h3" component="h2">Episódios mais recentes</Typography>
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