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
    AdminPanelSeriesTable,
    ErrorCard,
    ErrorCardStatusCodeProp
} from "../components";
import {
    OrderBy,
    Pagination,
    PaginationBuilder,
    Series,
    SeriesOrderColumn
} from "../types";
import { API_URL } from "../settings";

export const ManageSeries = () => {
    const hasPermissionToAccess = localStorage.getItem("token") && localStorage.getItem("type") === "ADMIN";
    if (!hasPermissionToAccess)
        return <NotFound />;

    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null);

    const [page, setPage] = useState(1);
    const [quantity, setQuantity] = useState(25);
    const [orderColumn, setOrderColumn] = useState<SeriesOrderColumn>("id");
    const [orderBy, setOrderBy] = useState<OrderBy>("asc");

    const [paginatedSeries, setPaginatedSeries] = useState<Pagination<Series> | null>(null);
    const [series, setSeries] = useState<Array<Series>>([]);

    const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
        setPage(page);
    };

    const handleOrderColumnChange = (event: SelectChangeEvent<SeriesOrderColumn>) => {
        setOrderColumn(event.target.value as SeriesOrderColumn);
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

    useEffect(
        () => {
            setIsRequestLoading(true);

            fetch(`${API_URL}/series/all?page=${page}&quantity=${quantity}&orderColumn=${orderColumn}&orderBy=${orderBy}`)
                .then(handleFetchResponse)
                .catch(console.error)
                .finally(() => setIsRequestLoading(false));
        },

        [
            page,
            quantity,
            orderColumn,
            orderBy
        ]
    );

    useEffect(
        () => {
            paginatedSeries
                ? setSeries(paginatedSeries.data)
                : setSeries([]);

            const isCurrentPageEmpty = paginatedSeries &&
                paginatedSeries.data.length <= 0 &&
                paginatedSeries.currentPage > 1;

            if (isCurrentPageEmpty)
                setPage(1)
        },

        [
            paginatedSeries
        ]
    );

    const handleFetchResponse = async (response: Response) => {
        const data = await response.json();

        if (!response.ok)
            return setStatusCode(response.status as ErrorCardStatusCodeProp);

        const builtPaginatedSeries = new PaginationBuilder<Series>(data);
        setPaginatedSeries(builtPaginatedSeries);
    };

    const noContentWarning = <Typography variant="body1">Não há séries cadastradas.</Typography>

    return (
        <>
            <Box sx={{ position: "relative" }}>
                <PaginatedContent<SeriesOrderColumn>
                    contentTitle="Gerenciar séries"
                    hidePaginationContent={series.length <= 0}
                    isRequestLoading={isRequestLoading}
                    currentQuantity={series.length}
                    totalQuantity={paginatedSeries?.totalQuantity || 0}
                    noContent={noContentWarning}

                    quantityPerPage={quantity}
                    handleQuantityPerPageChange={handleQuantityChange}

                    page={page}
                    handlePageChange={handlePageChange}
                    lastPage={paginatedSeries?.lastPage || 1}

                    orderBy={orderBy}
                    handleOrderByChange={handleOrderByChange}

                    orderColumns={[
                        ["id", "ID"],
                        ["mainName", "Nome"],
                        ["updatedAt", "Recentemente atualizado"]
                    ]}
                    handleOrderColumnChange={handleOrderColumnChange}
                    currentOrderColumn={orderColumn}
                >
                    <AdminPanelSeriesTable
                        dataFormat={
                            [
                                ["id", "ID"],
                                ["mainName", "Nome principal"],
                                ["alternativeName", "Nome alternativo"],
                                ["createdAt", "Criado em"],
                                ["updatedAt", "Atualizado em"]
                            ]
                        }
                        data={series}
                    />
                </PaginatedContent>

                <AdminPanelAddContentFAB href="/series/0" />

                <ErrorCard
                    isOpen={!!statusCode}
                    statusCode={statusCode}
                    handleClose={handleErrorClose}
                    reasons={"Um erro inesperado ocorreu. Por favor, tente novamente mais tarde."}
                />
            </Box>
        </>
    );
}