import {
    Box,
    SelectChangeEvent,
    Typography
} from "@mui/material";
import {
    ChangeEvent,
    useState,
    useEffect
} from "react";

import { NotFound } from "../pages";
import { PaginatedContent } from "../layouts";
import {
    AdminPanelAddContentFAB,
    AdminPanelDeleteSeasonCard,
    AdminPanelSeasonTable,
    ErrorCard,
    ErrorCardStatusCodeProp,
    SuccessCard
} from "../components";
import {
    OrderBy,
    Pagination,
    PaginationBuilder,
    Season,
    SeasonOrderColumn
} from "../types";
import { API_URL } from "../settings";

export const ManageSeasons = () => {
    const hasPermissionToAccess = localStorage.getItem("token") && localStorage.getItem("type") === "ADMIN";
    if (!hasPermissionToAccess)
        return <NotFound />;

    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null);

    const [page, setPage] = useState(1);
    const [quantity, setQuantity] = useState(50);
    const [orderColumn, setOrderColumn] = useState<SeasonOrderColumn>("id");
    const [orderBy, setOrderBy] = useState<OrderBy>("asc");
    const [search, setSearch] = useState("");

    const [paginatedSeasons, setPaginatedSeasons] = useState<Pagination<Season> | null>(null);
    const [seasons, setSeasons] = useState<Array<Season>>([]);

    const [deleteSeasonCardData, setDeleteSeasonCardData] = useState<Season | null>(null);
    const [showSuccessCard, setShowSuccessCard] = useState(false);

    const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
        setPage(page);
    };

    const handleOrderColumnChange = (event: SelectChangeEvent<SeasonOrderColumn>) => {
        setOrderColumn(event.target.value as SeasonOrderColumn);
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

    const handleErrorClose = () => {
        setStatusCode(null);
        window.location.href = "/";
    };

    const handleFetchAllSeasonsResponse = async (response: Response) => {
        if (!response.ok)
            return setStatusCode(response.status as ErrorCardStatusCodeProp);

        const data = await response.json();
        const builtPaginatedSeasons = new PaginationBuilder<Season>(data);
        setPaginatedSeasons(builtPaginatedSeasons);
    };

    const fetchAllSeasons = async () => fetch(`${API_URL}/season/all?page=${page}&quantity=${quantity}&orderColumn=${orderColumn}&orderBy=${orderBy}${search.length > 0 ? `&search=${search}` : ""}`)
        .then(handleFetchAllSeasonsResponse)
        .catch(console.error)
        .finally(() => setIsRequestLoading(false));

    const handleDeleteSeasonResponse = async (response: Response) => {
        if (!response.ok)
            return setStatusCode(response.status as ErrorCardStatusCodeProp);

        setShowSuccessCard(true);
    };

    const getOpenDeleteSeasonCardHandler = (season: Season) => {
        const handleOpenDeleteSeasonCard = () => {
            setDeleteSeasonCardData(season);
        };

        return handleOpenDeleteSeasonCard;
    };

    const getDeleteSeasonHandler = (season: Season | null) => {
        const finishDeleteProcess = () => {
            setDeleteSeasonCardData(null);

            fetchAllSeasons();
        };

        return () => {
            if (!season)
                return;

            fetch(
                `${API_URL}/season/inactivate/${season.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
                .then(handleDeleteSeasonResponse)
                .catch(console.error)
                .finally(finishDeleteProcess);
        };
    };

    const handleDeleteSeasonCardClose = () => {
        setDeleteSeasonCardData(null);
    };

    const handleSearchChange = (newSearch: string) => {
        setSearch(newSearch);
    };

    useEffect(
        () => {
            setIsRequestLoading(true);

            fetchAllSeasons();
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
            paginatedSeasons
                ? setSeasons(paginatedSeasons.data)
                : setSeasons([]);

            const isCurrentPageEmpty = paginatedSeasons &&
                paginatedSeasons.data.length <= 0 &&
                paginatedSeasons.currentPage > 1;

            if (isCurrentPageEmpty)
                setPage(1);
        },

        [
            paginatedSeasons
        ]
    );

    const noContentWarning = <Typography variant="body1">Não há temporadas cadastradas.</Typography>

    return (
        <>
            <Box sx={{ position: "relative" }}>
                <PaginatedContent<SeasonOrderColumn>
                    contentTitle="Gerenciar temporadas"
                    hidePaginationContent={seasons.length <= 0}
                    isRequestLoading={isRequestLoading}
                    currentQuantity={seasons.length}
                    totalQuantity={paginatedSeasons?.totalQuantity || 0}
                    noContent={noContentWarning}

                    newSearch={search}
                    handleSearchChange={handleSearchChange}

                    quantityPerPage={quantity}
                    handleQuantityPerPageChange={handleQuantityChange}

                    page={page}
                    handlePageChange={handlePageChange}
                    lastPage={paginatedSeasons?.lastPage || 1}

                    orderBy={orderBy}
                    handleOrderByChange={handleOrderByChange}

                    orderColumns={[
                        ["id", "ID"],
                        ["name", "Nome"],
                        ["updatedAt", "Recentemente atualizado"]
                    ]}
                    handleOrderColumnChange={handleOrderColumnChange}
                    currentOrderColumn={orderColumn}
                >
                    <AdminPanelSeasonTable
                        seasons={seasons}
                        getDeleteSeasonHandler={getOpenDeleteSeasonCardHandler}
                    />
                </PaginatedContent>

                <AdminPanelAddContentFAB href="/admin/seasons/0" />

                <AdminPanelDeleteSeasonCard
                    season={deleteSeasonCardData}
                    isOpen={!!deleteSeasonCardData}
                    handleClose={handleDeleteSeasonCardClose}
                    handleDelete={getDeleteSeasonHandler(deleteSeasonCardData)}
                />

                <ErrorCard
                    isOpen={!!statusCode}
                    statusCode={statusCode}
                    handleClose={handleErrorClose}
                    reasons="Um erro inesperado ocorreu. Por favor, tente novamente mais tarde."
                />

                <SuccessCard
                    message="Temporada deletada com sucesso!"
                    isOpen={showSuccessCard}
                    handleClose={() => setShowSuccessCard(false)}
                />
            </Box>
        </>
    );
};