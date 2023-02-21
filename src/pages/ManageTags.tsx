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
    AdminPanelDeleteTagCard,
    AdminPanelTagTable,
    ErrorCard,
    ErrorCardStatusCodeProp,
    SuccessCard
} from "../components";
import {
    OrderBy,
    Pagination,
    PaginationBuilder,
    Tag,
    TagOrderColumn
} from "../types";
import { API_URL } from "../settings";

export const ManageTags = () => {
    const hasPermissionToAccess = localStorage.getItem("token") && localStorage.getItem("type") === "ADMIN";
    if (!hasPermissionToAccess)
        return <NotFound />;

    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [statusCode, setStatusCode] = useState<ErrorCardStatusCodeProp>(null);

    const [page, setPage] = useState(1);
    const [quantity, setQuantity] = useState(50);
    const [orderColumn, setOrderColumn] = useState<TagOrderColumn>("id");
    const [orderBy, setOrderBy] = useState<OrderBy>("asc");
    const [search, setSearch] = useState("");

    const [paginatedTags, setPaginatedTags] = useState<Pagination<Tag> | null>(null);
    const [tags, setTags] = useState<Array<Tag>>([]);

    const [deleteTagCardData, setDeleteTagCardData] = useState<Tag | null>(null);
    const [showSuccessCard, setShowSuccessCard] = useState(false);

    const handlePageChange = (_event: ChangeEvent<unknown>, page: number) => {
        setPage(page);
    }

    const handleOrderColumnChange = (event: SelectChangeEvent<TagOrderColumn>) => {
        setOrderColumn(event.target.value as TagOrderColumn);
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

    const handleFetchAllTagsResponse = async (response: Response) => {
        if (!response.ok)
            return setStatusCode(response.status as ErrorCardStatusCodeProp);

        const data = await response.json();
        const builtPaginatedTags = new PaginationBuilder<Tag>(data);
        setPaginatedTags(builtPaginatedTags);
    };

    const fetchAllTags = async () => fetch(`${API_URL}/tag/all?page=${page}&quantity=${quantity}&orderColumn=${orderColumn}&orderBy=${orderBy}${search.length > 0 ? `&search=${search}` : ""}`)
        .then(handleFetchAllTagsResponse)
        .catch(console.error)
        .finally(() => setIsRequestLoading(false));

    const handleDeleteTagResponse = async (response: Response) => {
        if (!response.ok)
            return setStatusCode(response.status as ErrorCardStatusCodeProp);

        setShowSuccessCard(true);
    };

    const getOpenDeleteTagCardHandler = (tag: Tag) => {
        const handleOpenDeleteTagCard = () => {
            setDeleteTagCardData(tag);
        }

        return handleOpenDeleteTagCard;
    };

    const getDeleteTagHandler = (tag: Tag | null) => {
        const finishDeleteProcess = () => {
            setDeleteTagCardData(null);

            fetchAllTags();
        };

        return () => {
            if (!tag)
                return;

            fetch(
                `${API_URL}/tag/inactivate/${tag.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                }
            )
                .then(handleDeleteTagResponse)
                .catch(console.error)
                .finally(finishDeleteProcess);
        }
    };

    const handleDeleteTagCardClose = () => {
        setDeleteTagCardData(null);
    };

    const handleSearchChange = (newSearch: string) => {
        setSearch(newSearch);
    };

    useEffect(
        () => {
            setIsRequestLoading(true);

            fetchAllTags();
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
            paginatedTags
                ? setTags(paginatedTags.data)
                : setTags([]);

            const isCurrentPageEmpty = paginatedTags &&
                paginatedTags.data.length <= 0 &&
                paginatedTags.currentPage > 1;

            if (isCurrentPageEmpty)
                setPage(1);
        },

        [
            paginatedTags
        ]
    );

    const noContentWarning = <Typography variant="body1">Não há tags cadastradas.</Typography>;

    return (
        <Box sx={{ position: "relative" }}>
            <PaginatedContent<TagOrderColumn>
                contentTitle="Gerenciar tags"
                hidePaginationContent={tags.length <= 0}
                isRequestLoading={isRequestLoading}
                currentQuantity={tags.length}
                totalQuantity={paginatedTags?.totalQuantity || 0}
                noContent={noContentWarning}

                newSearch={search}
                handleSearchChange={handleSearchChange}

                quantityPerPage={quantity}
                handleQuantityPerPageChange={handleQuantityChange}

                page={page}
                handlePageChange={handlePageChange}
                lastPage={paginatedTags?.lastPage || 1}

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
                <AdminPanelTagTable
                    data={tags}
                    getDeleteHandler={getOpenDeleteTagCardHandler}
                />
            </PaginatedContent>

            <AdminPanelAddContentFAB href="/admin/tags/0" />

            <AdminPanelDeleteTagCard
                tag={deleteTagCardData}
                isOpen={!!deleteTagCardData}
                handleClose={handleDeleteTagCardClose}
                handleDelete={getDeleteTagHandler(deleteTagCardData)}
            />

            <ErrorCard
                isOpen={!!statusCode}
                statusCode={statusCode}
                handleClose={handleErrorClose}
                reasons="Um erro inesperado ocorreu. Por favor, tente novamente mais tarde."
            />

            <SuccessCard
                message="Tag deletada com sucesso!"
                isOpen={showSuccessCard}
                handleClose={() => setShowSuccessCard(false)}
            />
        </Box>
    );
}