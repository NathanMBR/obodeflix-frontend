import {
    Grid,
    SelectChangeEvent
} from "@mui/material";
import {
    ChangeEvent,
    useEffect,
    useState
} from "react";

import { API_URL } from "../settings";
import { PaginatedContent } from "../layouts";
import {
    SeriesCard,
    ErrorCard,
    ErrorCardStatusCodeProp
} from "../components";
import {
    Pagination,
    PaginationBuilder,
    Series,
    SeriesOrderColumn,
    OrderBy
} from "../types";

export const AllSeries = () => {
    const [isRequestLoading, setIsRequestLoading] = useState(true);
    const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null);

    const [page, setPage] = useState(1);
    const [quantity, setQuantity] = useState(25);
    const [orderColumn, setOrderColumn] = useState<SeriesOrderColumn>("mainName");
    const [orderBy, setOrderBy] = useState<OrderBy>("asc");

    const [paginatedSeries, setPaginatedSeries] = useState<Pagination<Series> | null>(null);
    const [series, setSeries] = useState<Array<Series>>([]);

    useEffect(
        () => {
            setIsRequestLoading(true);

            fetch(`${API_URL}/series/all?page=${page}&quantity=${quantity}&orderColumn=${orderColumn}&orderBy=${orderBy}`)
                .then(handleFetchResponse)
                .catch(console.error)
                .finally(() => setIsRequestLoading(false));

        },
        [page, quantity, orderColumn, orderBy]
    );

    useEffect(
        () => {
            paginatedSeries
                ? setSeries(paginatedSeries.data)
                : setSeries([]);
        },
        [paginatedSeries]
    );

    const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
        setPage(page);
    }

    const handleOrderColumnChange = (event: SelectChangeEvent<SeriesOrderColumn>) => {
        setOrderColumn(event.target.value as SeriesOrderColumn);
    }

    const handleOrderByChange = (event: SelectChangeEvent<OrderBy>) => {
        setOrderBy(event.target.value as OrderBy);
    }

    const handleQuantityChange = (event: SelectChangeEvent<number>) => {
        const newQuantity = Number(event.target.value);

        if (Number.isNaN(newQuantity))
            return;

        setQuantity(newQuantity);
    }

    const handleErrorClose = () => {
        setStatusCode(null);
        window.location.href = "/";
    }

    const handleFetchResponse = async (response: Response) => {
        const data = await response.json();

        if (!response.ok) {
            setStatusCode(response.status as ErrorCardStatusCodeProp);
            return;
        }

        const builtPaginatedSeries = new PaginationBuilder<Series>(data);
        setPaginatedSeries(builtPaginatedSeries);
    }

    return (
        <>
            <PaginatedContent<SeriesOrderColumn>
                contentTitle="Séries"
                hidePaginationContent={series.length <= 0}
                isRequestLoading={isRequestLoading}
                currentQuantity={series.length}
                totalQuantity={paginatedSeries?.totalQuantity || 0}
                noContentMessage="Não há séries a serem exibidas."

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
                <Grid container spacing={2} style={{ marginTop: 0 }}>
                    {
                        series.map(
                            singleSeries => <SeriesCard
                                key={singleSeries.id}
                                series={singleSeries}
                            />
                        )
                    }
                </Grid>

                <ErrorCard
                    statusCode={statusCode}
                    isOpen={!!statusCode}
                    handleClose={handleErrorClose}
                    reasons={"Um erro inesperado ocorreu. Por favor, tente novamente mais tarde."}
                />
            </PaginatedContent>
        </>
    );
}