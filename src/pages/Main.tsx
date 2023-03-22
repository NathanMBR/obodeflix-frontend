import {
    ChangeEvent,
    useEffect,
    useState
} from "react";
import {
    Box,
    CircularProgress,
    Grid,
    SelectChangeEvent,
    Typography
} from "@mui/material";
import { CSSProperties } from "@mui/styled-engine";

import {
    Pagination,
    PaginationBuilder,
    Episode,
    OrderBy,
    EpisodeOrderColumn
} from "../types";
import {
    MostRecentSeasons,
    PaginatedContent
} from "../layouts";
import { EpisodeCard } from "../components";
import { API_URL } from "../settings";

export const Main = () => {
    const [page, setPage] = useState(1);
    const [quantity, setQuantity] = useState(20);
    const [orderColumn, setOrderColumn] = useState<EpisodeOrderColumn>("id");
    const [orderBy, setOrderBy] = useState<OrderBy>("desc");
    const [search, setSearch] = useState("");

    const [paginatedEpisodes, setPaginatedEpisodes] = useState<Pagination<Episode> | null>(null);
    const [episodes, setEpisodes] = useState<Array<Episode>>([]);
    const [isRequestLoading, setIsRequestLoading] = useState(false);

    useEffect(
        () => {
            setIsRequestLoading(true);

            fetch(`${API_URL}/episode/all?page=${page}&quantity=${quantity}&orderColumn=${orderColumn}&orderBy=${orderBy}${search ? `&search=${search}` : ""}`)
                .then(handleFetchResponse)
                .catch(error => console.error(error))
                .finally(() => setIsRequestLoading(false));
        },
        [
            page,
            quantity,
            orderColumn,
            orderBy,
            search
        ]
    );

    useEffect(
        () => {
            paginatedEpisodes
                ? setEpisodes(paginatedEpisodes.data)
                : setEpisodes([])
        },
        [paginatedEpisodes]
    );

    const handleFetchResponse = async (response: Response) => {
        const data = await response.json();

        if (!response.ok)
            return;

        const builtPaginatedEpisodes = new PaginationBuilder<Episode>(data);
        setPaginatedEpisodes(builtPaginatedEpisodes);
    };

    const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
        setPage(page);
    };

    const handleOrderColumnChange = (event: SelectChangeEvent<EpisodeOrderColumn>) => {
        setOrderColumn(event.target.value as EpisodeOrderColumn);
    };

    const handleOrderByChange = (event: SelectChangeEvent<OrderBy>) => {
        setOrderBy(event.target.value as OrderBy);
    };

    const handleQuantityChange = (event: SelectChangeEvent<number>) => {
        const newQuantity = Number(event.target.value);

        if (Number.isNaN(newQuantity))
            return;

        setQuantity(newQuantity);
    };

    const handleSearchChange = (newSearch: string) => {
        setSearch(newSearch);
    };

    const loadingStyle: CSSProperties = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
    };

    const loadingComponent = <Box sx={loadingStyle}>
        <CircularProgress />
    </Box>;

    if (!paginatedEpisodes)
        return loadingComponent;

    const noEpisodesComponent = <>
        <Typography variant="body1">Não há episódios a serem exibidos.</Typography>
    </>;

    return (
        <>
            <MostRecentSeasons />

            <PaginatedContent<EpisodeOrderColumn>
                contentTitle="Episódios mais recentes"
                hidePaginationContent={episodes.length <= 0}
                isRequestLoading={isRequestLoading}
                currentQuantity={episodes.length}
                totalQuantity={paginatedEpisodes?.totalQuantity || 0}
                noContent={noEpisodesComponent}

                newSearch={search}
                handleSearchChange={handleSearchChange}

                quantityPerPage={quantity}
                handleQuantityPerPageChange={handleQuantityChange}

                page={page}
                handlePageChange={handlePageChange}
                lastPage={paginatedEpisodes?.lastPage || 1}

                orderBy={orderBy}
                handleOrderByChange={handleOrderByChange}

                orderColumns={
                    [
                        ["id", "ID"],
                        ["name", "Nome"],
                        ["position", "Posição cronológica"],
                        ["updatedAt", "Recentemente atualizado"]
                    ]
                }
                handleOrderColumnChange={handleOrderColumnChange}
                currentOrderColumn={orderColumn}
            >
                <Grid container
                    spacing={2}
                >
                    {
                        episodes.map(
                            episode => <EpisodeCard
                            key={episode.id}
                            episode={episode}
                            />
                        )
                    }
                </Grid>
            </PaginatedContent>
        </>
    )
}